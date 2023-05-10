const customerModel = require("../models/customer");
const asyncErrorCatch=require('../middleware/asyncErrorHandlers');
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/getJwtToken");
const sendEmailToUser = require("../utils/sendMail");
const asyncErrorHandlers = require("../middleware/asyncErrorHandlers");
const crypto=require('crypto');
const isObjectPropertyEmpty = require("../utils/checkObjectProperties");
const adminModel = require("../models/admin");
const bookingModel = require("../models/booking");
exports.customerRegister=asyncErrorCatch(async(req,res,next)=>{
    const Data={
        name:{
            firstName:req.body.firstName,
            lastName:req.body.lastName,
        },
        email:req.body.email,
        cnic:req.body.cnic,
        number:req.body.mobileNumber,
        password:req.body.password,
        gender:req.body.gender,
        address:req.body.address,
        acceptTerms:req.body.acceptTerms
    }

    

    const oldUser=await customerModel.findOne({email:req.body.email});
    if(oldUser){
       return next(new ErrorHandler(400,"You  Already Registered On This Email"))
    }
    const user=await customerModel.create(Data);
    const msg="Signup Successfully"
    if(user){
        sendToken(res,201,user,msg);
    }
})
exports.customerRegisterAdmin=asyncErrorCatch(async(req,res,next)=>{
    const Data={
        name:{
            firstName:req.body.firstName,
            lastName:req.body.lastName,
        },
        email:req.body.email,
        cnic:req.body.cnic,
        number:req.body.number,
        password:req.body.password,
        gender:req.body.gender,
        address:req.body.address,
        acceptTerms:true
    }

    

    const oldUser=await customerModel.findOne({email:req.body.email});
    if(oldUser){
       return next(new ErrorHandler(400,"You  Already Registered On This Email"))
    }
    const user=await customerModel.create(Data);
    const msg="Signup Successfully"
    if(user){
        res.status(200).json({success:true,msg:"Customer Registered"})
    }
})
exports.customerLogin=asyncErrorCatch(async(req,res,next)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return next(new ErrorHandler(400,"please enter email and password"))
    }
    const user=await customerModel.findOne({email:email,isDeleted:false}).select("+password");
    const  admin=await adminModel.findOne({email:email}).select("+password");
    if(!user){
        if(!admin){
            return next(new ErrorHandler(401,"Invalid Email or Password"));
        }
        
    }
    let isPasswordMatchedUser,isPasswordMatchedAdmin;
    if(user){
         isPasswordMatchedUser=await user.comparePassword(password);
    }
    if(admin){
         isPasswordMatchedAdmin=await admin.comparePassword(password);
    
    }
   

    if(!isPasswordMatchedUser){
        if(!isPasswordMatchedAdmin){
            return next(new ErrorHandler(401,"Invalid Email or Password"));
        }
        
    }
    const msg="Login Successfully"
    if(isPasswordMatchedAdmin){
        sendToken(res,200,admin,msg);
    }
    if(isPasswordMatchedUser){
        if(user.status==="blocked"){
            return next(new ErrorHandler(401,"Sorry ,You Are not Be Able To Login"));
        }
        sendToken(res,200,user,msg);
    }
   
})

exports.Logout=asyncErrorCatch(async(req,res,next)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,msg:"Logout successfully"})
})

exports.forgotPassword=asyncErrorCatch(async(req,res,next)=>{
    console.log("called");
    const{email}=req.body;
    const user=await customerModel.findOne({email:email});
    if(!user){
        return next(new ErrorHandler(401,"please enter valid email"))
    }
     console.log(user);
    const resetToken= await user.getResetPasswordToken();
    
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://localhost:3000/api/url/password/reset/${resetToken}`;
    const message=`your reset password link is :- \n\n${resetPasswordUrl}\n\n
    if you have not requested this email then please ignore it`;

    try {
        await sendEmailToUser({
            email:user.email,
            subject:"Rent A Car Password Recovery",
            message,
        })

        res.status(200).json({success:true,message:`email sent to ${user.email} successfully`})
    } catch (error) {
       
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(400,error.message));
    }
})

exports.resetPassword=asyncErrorCatch(async(req,res,next)=>{
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user=await customerModel.findOne({resetPasswordToken,resetPasswordExpire:{$gt:Date.now()}})
    if(!user){
        return next(new ErrorHandler(400,"Reset password link is expired"))
    }
    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler(400,"Password and confirm password not matched"))
    }
    user.resetPasswordExpire=undefined;
    user.resetPasswordToken=undefined;
    user.password=req.body.password;

    await user.save({validateBeforeSave:false});

    res.status(200).json({success:true,message:"Password updated successfully"})

})

 exports.getCustomerOwnProfile=asyncErrorCatch(async(req,res,next)=>{
    const customer=await customerModel.findById(req.customer._id);
    return res.status(200).json({success:true,customer})
 })

 exports.updateCustomerOwnPassword=asyncErrorCatch(async(req,res,next)=>{
    const {oldPassword,newPassword,confirmNewPassword}=req.body;
    const isEmpty=Object.values(req.body).every((x)=>x===''||x===null);
    if(isEmpty){
        return next(new ErrorHandler(400,"password field cannot be empty"))
    }
    const customer=await customerModel.findById(req.customer._id).select("+password");
    const isPasswordMatched=await customer.comparePassword(oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler(401,"old password does not match"))
    }
    if(newPassword!==confirmNewPassword){
        return next(new ErrorHandler(400,"password and confirm password does not match"))
    }
    customer.password=newPassword;
    await customer.save({validateBeforeSave:false});
    return res.status(200).json({success:true,msg:"password updated"})
 })

 exports.updateCustomerOwnProfile=asyncErrorCatch(async(req,res,next)=>{
     const customer=await customerModel.findById(req.customer._id);
    if(!customer){
        return next(new ErrorHandler(400,"Customer not found"))
    }
    const updatedData={
        name:{
            firstName:req.body.firstName,
            lastName:req.body.lastName,
        },
        email:req.body.email,
        cnic:req.body.cnic,
        number:req.body.number,
        gender:req.body.gender,
        address:req.body.address,
    }
    const newData=await isObjectPropertyEmpty(updatedData,customer)
    const updateCustomer=await customerModel.findByIdAndUpdate(req.customer._id,newData);
    if(!updateCustomer){
        return next(new ErrorHandler(400,"record not updated"))
    }
    res.status(200).json({success:true,msg:"Record Updated"})


 })
//admin
exports.getAllCustomers=asyncErrorCatch(async(req,res,next)=>{
    const customers=await customerModel.find({isDeleted:false});
    if(customers?.length===0){
        return next(new ErrorHandler(404,"No Customer Found"));
    }
    res.status(200).json({success:true,customers})
})

exports.getSingleCustomerDetail=asyncErrorCatch(async(req,res,next)=>{

    const customer=await customerModel.findOne({_id:req.params.id,isDeleted:false});
    if(!customer){
        return next(new ErrorHandler(404,"No Customer Found"))
    }
    res.status(200).json({success:true,customer})
})
// admin

exports.updateCustomerInfo=asyncErrorCatch(async(req,res,next)=>{
    const customer=await customerModel.findById(req.params.id);
    console.log("req.body",req.body);
    if(!customer){
        return next(new ErrorHandler(404,"Customer not found"))
    }
    const updatedData={
        name:{
            firstName:req.body.firstName,
            lastName:req.body.lastName,
        },
        email:req.body.email,
        cnic:req.body.cnic,
        number:req.body.number,
        gender:req.body.gender,
        status:req.body.status,
        address:req.body.address,
    }
    const newData=await isObjectPropertyEmpty(updatedData,customer)
    const updateCustomer=await customerModel.findByIdAndUpdate(req.params.id,newData);
    if(!updateCustomer){
        return next(new ErrorHandler(400,"record not updated"))
    }
    res.status(200).json({success:true,msg:"Record Updated"})
})

// update customer password by admin
// exports.updateCustomerPassword=asyncErrorCatch(async(req,res,next)=>{
//     const{newPassword,confirmNewPassword}=req.body;
//     if(newPassword!==confirmNewPassword){
//         return next(new ErrorHandler(400,"password and confirm password does not match"))
//     }
//     const customer=await customerModel.findById(req.params.id).select("+password")
//     if(!customer){
//         return next(new ErrorHandler(400,"customer not found"));
//     }
//     customer.password=newPassword;
//     await customer.save({validateBeforeSave:false});
//     res.status(200).json({success:true,msg:"password updated"})

// })

//admin

exports.deleteCustomer=asyncErrorCatch(async(req,res,next)=>{
    const customer=await customerModel.findByIdAndUpdate({_id:req.params.id},{$set:{isDeleted:true}});
    if(customer){
        return res.status(200).json({success:true,msg:"customer record deleted"})
    }
    return next(new ErrorHandler(404,"customer not found"))
})

exports.verifyUser=asyncErrorCatch(async(req,res,next)=>{
    return res.status(200).json({success:true})
})

exports.getAllSpecificCustomerBookings = asyncErrorCatch(async (req, res, next) => {
    const bookings = await bookingModel.find({customer:req.params.id}).populate(["customer", "vehicle"]);
    res.status(200).json({ success: true, bookings })
})