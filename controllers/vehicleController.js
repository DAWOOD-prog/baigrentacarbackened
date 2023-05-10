const asyncErrorCatch=require('../middleware/asyncErrorHandlers');
const path=require('path')
const fs=require('fs')
const vehicleModel = require('../models/vehicle');
const isObjectPropertyEmpty = require("../utils/checkObjectProperties");
const ErrorHandler = require('../utils/errorHandler');
const ApiFeatures = require('../utils/apiFeatures');
exports.registerVehicle=asyncErrorCatch(async(req,res,next)=>{
    // if(req.files.length<=-1){
    //     return next(new ErrorHandler(400,"you must have to select atleast one image"))
    // }
    // const arrayImages=[];
    // for(let i=0;i<req.files.length;i++){
    //     arrayImages.push({fileName:`${req.files[i].path}`})
        
    // }
    
    const vehicleData={
        name: req.body.name,
        description: req.body.description,
        vehicleSeats: req.body.vehicleSeats,
        haveAc: req.body.haveAc,
        modelYear: req.body.modelYear,
        vehicleNumber: req.body.vehicleNumber,
        perHourRate:req.body.perHourRate,
        brand: req.body.brand,
        perDayRate:req.body.perDayRate,
        noOfDoors:req.body.noOfDoors,
        perLitterFuelAverage:req.body.perLitterFuelAverage,
        vehicleType:req.body.vehicleType,
        isAvailableOnlyWithDriver:req.body.isAvailableOnlyWithDriver,
        image: req?.file?.path
        
    }
     vehicleModel.create(vehicleData,(err,result)=>{
        if(err){
            fs.unlinkSync(req?.file?.path);
            return next(err)
        }
        else{
            res.status(201).json({success:true,msg:"Vehicle Registered",result})
        }
     });
});

exports.updateVehicle=asyncErrorCatch(async(req,res,next)=>{

    const vehicle=await vehicleModel.findById(req?.params?.id);
    if(!vehicle){
        return next(new ErrorHandler(404,"Vehicle  not found"))
    }
    console.log(req.body,"body");
    const vehicleData={
        name: req.body.name,
        description: req.body.description,
        vehicleSeats: req.body.vehicleSeats,
        haveAc: req.body.haveAc,
        modelYear: req.body.modelYear,
        vehicleNumber: req.body.vehicleNumber,
        perHourRate:req.body.perHourRate,
        brand: req.body.brand,
        perDayRate:req.body.perDayRate,
        noOfDoors:req.body.noOfDoors,
        perLitterFuelAverage:req.body.perLitterFuelAverage,
        vehicleType:req.body.vehicleType,
        isAvailableOnlyWithDriver:req.body.isAvailableOnlyWithDriver,   
    }

    if(req?.file?.path){
        vehicleData.image=req?.file?.path
    }

    const newData = await isObjectPropertyEmpty(vehicleData, vehicle)

    const updatedVehicle=await vehicleModel.findByIdAndUpdate(req.params.id, newData, { runValidators: true })
    if(!updatedVehicle){
        if(req?.file?.path){
            fs.unlinkSync(req?.file?.path)
        }
        return next(new ErrorHandler(400,"vehicle not updated"))
    }else{
      
        if(req?.file.path){
            fs.unlinkSync(updatedVehicle?.image)
        }
        res.status(200).json({success:true,msg:"vehicle updated"})
    }
   
});

exports.deleteVehicle=asyncErrorCatch(async(req,res,next)=>{
    const vehicle=await vehicleModel.findByIdAndUpdate({_id:req.params.id},{$set:{isDeleted:true}});
    if(vehicle){
        return res.status(200).json({success:true,msg:"vehicle removed"})
    }
    return next(new ErrorHandler(400,"vehicle not found"))
});

exports.getAllVehicle=asyncErrorCatch(async(req,res,next)=>{
    const resultPerPage=4;
    const apiFeature=new ApiFeatures(vehicleModel.find({isDeleted:false}),req.query).search().filter().pagination(resultPerPage);
    const vehicles=await apiFeature.query
    if(!vehicles){
        return next(new ErrorHandler(400,"no vehicle found"))
    }
    res.status(200).json({success:true,vehicles});
});
exports.getAllVehiclesByAdmin=asyncErrorCatch(async(req,res,next)=>{
    // const resultPerPage=4;
    // const apiFeature=new ApiFeatures(vehicleModel.find(),req.query).search().filter().pagination(resultPerPage);
    const vehicles=await vehicleModel.find({isDeleted:false});
   
    res.status(200).json({success:true,vehicles});
});

exports.getSingleVehicleDetail=asyncErrorCatch(async(req,res,next)=>{
    const vehicle=await vehicleModel.findById(req.params.id);
    if(!vehicle){
        return next(new ErrorHandler(400,"vehicle not found"))
    }
    console.log(vehicle);
    res.status(200).json({success:true,vehicle})
})


exports.getSingleVehicleDetailByAdmin=asyncErrorCatch(async(req,res,next)=>{
    const vehicle=await vehicleModel.findById(req.params.id);
    if(!vehicle){
        return next(new ErrorHandler(400,"vehicle not found"))
    }
    console.log(vehicle);
    res.status(200).json({success:true,vehicle})
})

// exports.createUpdateReview=asyncErrorCatch(async(req,res,next)=>{
//     const{name,rating,comment,}
// })