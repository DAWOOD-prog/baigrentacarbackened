const asyncErrorCatch = require("../middleware/asyncErrorHandlers");
const driverModel = require("../models/driver");
const ErrorHandler = require("../utils/errorHandler");
const fs=require('fs')
const sendToken = require("../utils/getJwtToken");
const isObjectPropertyEmpty = require("../utils/checkObjectProperties");
const bookingModel = require("../models/booking");
exports.registerDriver=asyncErrorCatch(async(req,res,next)=>{
     console.log("vcsdf");
    if (!req?.files?.driverProfile) {
        return next(new ErrorHandler(400, "Please select your driver profile"))
    }
    if (!req?.files?.driverLiscence) {
        return next(new ErrorHandler(400, "Please select your driver liscence"))
    }
    const driver=await driverModel.findOne({email:req?.body?.email})
    if(driver){
        return next(new ErrorHandler(400,"Driver already registered on this email"))
    }
    console.log(req.body,"body");
    console.log(req?.files,"files");
    const driverData={
        name:req.body.name,
        email:req.body.email.toLowerCase(),
        number:req.body.number,
        cnic:req.body.cnic,
        address:{
            house:req.body.house,
            street:req.body.street,
            sector:req.body.sector,
        },
        driverProfile:req?.files?.driverProfile[0]?.path,
        drivingLiscence:req?.files?.driverLiscence[0]?.path,
    }
    const randomPasswordNumber=`${req.body.name.toLowerCase()}-${Math.floor(100000+Math.random()*900000)}`;
    driverData.password=randomPasswordNumber
    driverModel.create(driverData,(err,result)=>{
        if(err){
            fs.unlinkSync(req?.files?.driverProfile[0]?.path);
            fs.unlinkSync(req?.files?.driverLiscence[0]?.path);
            return next(new ErrorHandler(400, err.message));
        }
        return res.status(201).json({success:true,msg:"driver registered",result})
    });
})

exports.updateDriver=asyncErrorCatch(async(req,res,next)=>{
    const driver=await driverModel.findById(req?.params?.id);
    if(!driver){
        return next(new ErrorHandler(404,"Driver Not Found"))
    }
    const driverData={
        name:req.body.name,
        number:req.body.number,
        cnic:req.body.cnic,
        password:req.body.password,
        address:{
            house:req.body.house,
            street:req.body.street,
            sector:req.body.sector,
        },
        status:req.body.status,
   
    }
    if (req?.files?.driverLiscence) {
        driverData.drivingLiscence=req?.files?.driverLiscence[0]?.path
    }
    if (req?.files?.driverProfile) {
        driverData.driverProfile=req?.files?.driverProfile[0]?.path
    }
    const newData = await isObjectPropertyEmpty(driverData, driver)

    const updatedDriver=await driverModel.findByIdAndUpdate(req.params.id, newData, { runValidators: true })
    if(!updatedDriver){
        if (req?.files?.driverLiscence) {
            fs.unlinkSync(req?.files?.driverLiscence[0]?.path)
        }
        if (req?.files?.driverProfile) {
            fs.unlinkSync(req?.files?.driverProfile[0]?.path)
        }
        return next(new ErrorHandler(400,"driver not updated"))
    }else{
      
        if (req?.files?.driverLiscence) {
            fs.unlinkSync(updatedDriver?.drivingLiscence)
        }
        if (req?.files?.driverProfile) {
            fs.unlinkSync(updatedDriver?.driverProfile)
        }
        res.status(200).json({success:true,msg:"driver updated"})
    }
})
exports.getAllDrivers=asyncErrorCatch(async(req,res,next)=>{
    const drivers=await driverModel.find({isDeleted:false});
    return res.status(200).json({success:true,drivers})
})
exports.getAllAvailableDrivers=asyncErrorCatch(async(req,res,next)=>{
    const drivers=await driverModel.find({isAvailable:true,isDeleted:false});
    return res.status(200).json({success:true,drivers})
})
exports.getSingleDriverDetail=asyncErrorCatch(async(req,res,next)=>{
    const driver=await driverModel.findById(req.params.id);
    if(!driver){
        return next(new ErrorHandler(400,"driver not found"))
    }
   return res.status(200).json({success:true,driver})
})
exports.deleteDriver=asyncErrorCatch(async(req,res,next)=>{
    const driver=await driverModel.findByIdAndUpdate({_id:req.params.id},{$set:{isDeleted:true}});
    if(driver){
        return res.status(200).json({success:true,msg:"driver removed"})
    }
    return next(new ErrorHandler(400,"driver not found"))
})



exports.driverLogin=asyncErrorCatch(async(req,res,next)=>{
    const{password}=req.body;
    const {email}=req.body.email.toLowerCase();
    if(!email||!password){
        return next(new ErrorHandler(400,"please enter email and password"))
    }
    const driver=await driverModel.findOne({email:email,password:password,isDeleted:false})
    if(!driver){
        return next(new ErrorHandler(401,"Invalid Email or Password"));
    }

    const msg="Login Successfully"
    sendToken(res,200,driver,msg);
   
   
})

exports.getDriverBookingLocation=asyncErrorCatch(async(req,res,next)=>{
    if(!req.params.id){
        return next(new ErrorHandler(400,"please enter driver Id"))
    }

    const driverBooking=await bookingModel.findOne({driver:req.params.id,status:"confirmed"});
    if(!driverBooking){
        res.status(200).json({success:true,message:"No Booking Found",isDriverHasBooking:false})
    }else{
        res.status(200).json({success:true,message:"Booking Found",isDriverHasBooking:true,pickUpLocation:driverBooking?.pickUpLocation,dropOffLocation:driverBooking?.dropOffLocation})
    }
})