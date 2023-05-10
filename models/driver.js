const mongoose=require('mongoose');
const driverSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter driver name"]
    },
    number:{
        type:Number,
        required:[true,"please enter driver phone number"]
    },
    cnic:{
        type:String,
        required:[true,"please enter driver cinic number"]
    },
    email:{
        type:String,
        required:[true,"please enter driver email"]
    },
    address:{
        house:{type:String,required:true},
        street:{type:String,required:true},
        sector:{type:String,required:true}
    },
    drivingLiscence:{
        type:String,
        required:[true,"please upload driver lisence front image"]
    },
    driverProfile:{
        type:String,
        required:[true,"please upload driver profile image"]
    },
    status:{
        type:String,
        default:"active"
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: [8, "password should be greater than 8 characters"],
    },
    //active
    //blocked
    isAvailable:{
        type:Boolean,
        default:true
    },
    isDeleted:{
        type:Boolean,
        default:false
      }
})
driverSchema.methods.getJWTToken = async function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
}
const driverModel=mongoose.model("driverModel",driverSchema)
module.exports=driverModel