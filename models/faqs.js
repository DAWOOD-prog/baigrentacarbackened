const mongoose=require('mongoose');

const faqsSchema=new mongoose.Schema({
    question:{
        type:String,
    },
    answer:{
        type:String,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})

const FaqsModel=mongoose.model("FaqsModel",faqsSchema);
module.exports=FaqsModel