const asyncErrorCatch=require('../middleware/asyncErrorHandlers');
const adminModel = require('../models/admin');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/getJwtToken');
const registerAdmin=asyncErrorCatch(async(req,res,next)=>{
    const {name,email,password,isActive}=req.body;
    const oldAdmin=await adminModel.findOne({email});
    if(oldAdmin){
        return next(new ErrorHandler(400,"Admin already register on this email"));
    }
    const admin=await adminModel.create({name,email,password,isActive})    
    if(admin){
        const msg="Login Successfully"
        sendToken(res,201,admin,msg);
    }
})

const loginAdmin=asyncErrorCatch(async(req,res,next)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return next(new ErrorHandler(400,"please enter your email and password"))
    }
    const admin=await adminModel.findOne({email}).select("+password");
    if(!admin){
        return next(new ErrorHandler(401,"please enter correct email and password"))
    }
    const isPasswordMatched=await admin.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler(401,"please enter correct email and password"))
    }
    sendToken(res,200,admin);
})

const logoutAdmin=asyncErrorCatch(async(req,res,next)=>{
    res.clearCookie("token");
    res.status(200).json({success:true,msg:"Admin Logout Successfully"})
})

const updateAdmin=asyncErrorCatch(async(req,res,next)=>{
    const updatedData={
        name:req.body.name,
        email:req.body.email,
    }
    const admin=await adminModel.findByIdAndUpdate(req.admin._id,updatedData);
    if(!admin){
        return next(new ErrorHandler(400,"Admin Not Found"));
    }
     res.status(200).json({success:true,msg:"Record Updated",admin});
})

//when admin wants to update the password can we ask first about previous password?
const updatePassword=asyncErrorCatch(async(req,res,next)=>{
    console.log("called");
    const{oldPassword,newPassword,confirmNewPassword}=req.body;
    
    const admin=await adminModel.findById(req.admin._id).select("+password");
    const isPasswordMatched=await admin.comparePassword(oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler(401,"please enter correct old password"));
    }
    if(newPassword!==confirmNewPassword){
        return next(new ErrorHandler(400,"password and confirm password does not match"))
    }
    admin.password=newPassword;
    await admin.save({validateBeforeSave:false});
    sendToken(res,200,admin)

})
// exports.deleteAdmin=asyncErrorCatch(async(req,res,next)=>{
//     const admin=await adminModel.findByIdAndDelete(req.params.id);
//     if(!admin){
//         return next(new ErrorHandler(400,"Admin Not Found"));
//     }
//     res.status(200).json({success:true,msg:"Record Deleted",admin});
// })

// exports.getAllAdmins=asyncErrorCatch(async(req,res,next)=>{
//     const admins=await adminModel.find();
//     if(!admins){
//         return next(new ErrorHandler(400,"No Record Found"));
//     }
//     res.status(200).json({success:true,admins})
// })

// exports.getSingleAdminDetails=asyncErrorCatch(async(req,res,next)=>{
//     const admin=await adminModel.findById(req.params.id);
//     if(!admin){
//         return next(new ErrorHandler(400,"No Record Found"));
//     }
//     res.status(200).json({success:true,admin})
// })

//update admin own profile,password,customers password by verification,other admins password
const verifyUser=asyncErrorCatch(async(req,res,next)=>{
    return res.status(200).json({success:true})
})
module.exports={registerAdmin,verifyUser,updateAdmin,updatePassword,loginAdmin,logoutAdmin} 