const mongoose = require("mongoose");
require("./brand");
const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter vehicle name"],
  },
  description: {
    type: String,
    required: [true, "please enter vehicle description"],
  },
  vehicleSeats: {
    type: Number,
    required: [true, "please enter number of seats"],
  },
  vehicleType: {
    type: String,
    required: [true, "please select vehicle type"],
  },
  haveAc: {
    type: Boolean,
    required: [true, "please select a car have an AC or not"],
  },
  modelYear: {
    type: Number,
    required: [true, "please enter vehicle model year"],
  },
  vehicleNumber: {
    type: String,
    required: [true, "please enter vehicle number"],
  },
  isAvailable: {
    type: Boolean,
   default:true
  },
  perHourRate: {
    type: Number,
    required: [true, "please enter vehicle per hour rate"],
  },

  perDayRate: {
    type: Number,
    required: [true, "please enter vehicle per day rate"],
  },
  noOfDoors: {
    type: Number,
    required: [true, "please enter no of doors"],
  },
  perLitterFuelAverage: {
    type: Number,
    required: [true, "please enter fuel average"],
  },

  rating: {
    type: String,
    default: 0,
  },
  status:{
    type:String,
    default:"available"
  },
  noOfReviews: {
    type: Number,
    default: 0,
  },
  // vehicleType:{
  //     type:String,
  //     required:[true,"please select vehicle type"]
  // },
  brand: {
    type: String,
    required: [true, "please select car brand"],
  },
  image: {
    type: String,
    required: [true, "please select file"],
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
  isAvailableOnlyWithDriver: {
    type: Boolean,
    required: [true, "please select is car only available with driver or not"],
  },
  // reviews:[
  //     {
  //         customer:{
  //             type:mongoose.Schema.ObjectId,
  //             ref:"customerModel",
  //             required:true
  //         },
  //         rating:{
  //             type:Number,
  //             required:true
  //         },
  //         comment:{
  //             type:String,
  //             required:true
  //         }
  //     }
  // ],
  // faqs:[
  //     {
  //         question:{
  //             type:String,
  //         },
  //         answer:{
  //             type:String,
  //         }
  //     }
  // ]
});

vehicleSchema.method("transform", function () {
  var obj = this.toObject();

  //Rename fields
  obj.id = obj._id;
  delete obj._id;

  return obj;
});

const vehicleModel = mongoose.model("vehicleModel", vehicleSchema);
module.exports = vehicleModel;
