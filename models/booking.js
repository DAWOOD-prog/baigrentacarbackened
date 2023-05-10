const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: "customerModel",
        required: [true, "please provide customer detail"]
    },
    vehicle: {
        type: mongoose.Schema.ObjectId,
        ref: "vehicleModel",
        required: [true, "please select vehicle that you want to book"]
    },
    pickUpDate: {
        type: Date,
        required: [true, "please select pick up date"]
    },
    pickUpLocation: {
        latitude: {
            type: Number,
            // required:true
        },
        longitude: {
            type: Number,
            // required:true
        },
        address: {
            type: String,
            // required:true
        }
    },
    pickUpTime: {
        type: String,
        required: [true, "please select pick up time"]
    },
    additionalPickUpDescription: {
        type: String
    },
    dropOffDate: {
        type: Date,
        required: [true, "please select drop off date"]
    },
    dropOffLocation: {
        latitude: {
            type: Number,
            // required:true
        },
        longitude: {
            type: Number,
            // required:true
        },
        address: {
            type: String,
            // required:true
        }
    },
    dropOffTime: {
        type: String,
        required: [true, "please select drop off time"]
    },
    additionalDropOffDescription: {
        type: String
    },
    customerLiscence: {
        type: String,
    },
    customerIdCard: {
        type: String,
        required: [true, "Please upload your CNIC "]
    },
    noOfDays: {
        type: String
    },
    status: {
        type: String,
        default: "pending"
    },
    bookingUnit:{
        type:String,
        default:""
    },
    onDateCustomerReturned:{
        type:Date,
        default:null
    },
    isWithDriver: {
        type: Boolean,
        required: [true, "please select booking with driver or without driver"]
    },
    driver: {
        type: mongoose.Schema.ObjectId,
        ref: "driverModel",  
        default:null
    },
    perDayBookingVehicleRate: {
        type: Number,
        required: [true, "please enter booking vehicle per day rate"],
    },
    overTimePerHour: {
        type: Number,
        required: [true, "please enter booking vehicle over time per hour rate"],
    },
    totalAmountPayable: {
        type: Number,
        required: [true, "please enter total booking amount paybale"],
    },
    partiallyAmountPaidRequired: {
        type: Number,
        required: [true, "please enter how much amount is required to confirm booking"],
    }

})

const bookingModel = mongoose.model("bookingModel", bookingSchema)
module.exports = bookingModel