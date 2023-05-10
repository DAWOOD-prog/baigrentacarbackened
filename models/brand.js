const mongoose=require('mongoose');

const brandSchema=new mongoose.Schema({
    brandName:{
        type:String,
        required:true
    }
})

const brandModel=mongoose.model("brandModel",brandSchema);
module.exports=brandModel;