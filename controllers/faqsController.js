const asyncErrorCatch = require("../middleware/asyncErrorHandlers");
const FaqsModel = require("../models/faqs");
const isObjectPropertyEmpty = require("../utils/checkObjectProperties");
const ErrorHandler = require("../utils/errorHandler");

exports.registerFaqs=asyncErrorCatch(async(req,res,next)=>{
    const {question,answer}=req.body
    const faq=FaqsModel.create({question,answer});
    console.log(req.body);
    if(!faq){
        return next(new ErrorHandler(400,"faqs not register"))
    }
    res.status(201).json({success:true,msg:"registered"})
})


exports.updatefaqs=asyncErrorCatch(async(req,res,next)=>{
    const faqs=await FaqsModel.findOne({_id:req?.params?.id,isDeleted:false});
    if(!faqs){
        return next(new ErrorHandler(404,"faqs Not Found"))
    }
    const faqsData={
        question:req.body.question,
        answer:req.body.answer,
      
   
    }
   
    const newData = await isObjectPropertyEmpty(faqsData, faqs)

    const updatedFaqs=await FaqsModel.findByIdAndUpdate(req.params.id, newData, { runValidators: true })
    if(!updatedFaqs){
        return next(new ErrorHandler(400,"faqs not updated"))
    }else{
        res.status(200).json({success:true,msg:"faqs updated"})
    }
})


exports.getAllFaqs=asyncErrorCatch(async(req,res,next)=>{
    const faqs=await FaqsModel.find({isDeleted:false});
    if(!faqs){
        return next(new ErrorHandler(400,"no faq found"))
    }
    res.status(200).json({success:true,faqs})
})

exports.getSingleFaqsDetail=asyncErrorCatch(async(req,res,next)=>{
    console.log(req.params.id);
    const faqs=await FaqsModel.findOne({_id:req.params.id,isDeleted:false});
    if(!faqs){
        return next(new ErrorHandler(400,"faqs not found"))
    }
   return res.status(200).json({success:true,faqs})
})
exports.deletefaqs=asyncErrorCatch(async(req,res,next)=>{
    const faqs=await FaqsModel.findByIdAndUpdate({_id:req.params.id},{$set:{isDeleted:true}});
    if(faqs){
        return res.status(200).json({success:true,msg:"faqs removed"})
    }
    return next(new ErrorHandler(400,"faqs not found"))
})