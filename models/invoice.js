const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.ObjectId,
        ref: "bookingModel",
        required: [true, "please provide Booking ID"]
    },

    partiallyAmountPaidDate: {
        type: Date,
        // required: [true, "please enter partially amount paid date"]
    },
    overTimeCharges: {
        type: Number,
        default: 0
    },
    accidentalCharges: {
        type: Number,
        default: 0
    },
    paymentStatus: {
        type: String,
        default: "notPaid"
    },

    tax: {
        type: Number,
        default: 0
        // required:true
    },
    partiallyPaidAmount: {
        type: Number,
        default: 0
        // required:true
    },
    totalAmountPayable: {
        type: Number,
        default: 0
        // required:true
    },
    total: {
        type: Number,
        default: 0
        // required:true
    },
    discount: {
        type: Number,
        default: 0
        // required:true
    },
    pendingAmountToPaid: {
        type: Number,
        default: 0
        // required:true
    },
    pendingAmountGetFromUser: {
        type: Number,
        default: 0
    },
    cashFromUser: {
        type: Number,
        default: 0
        // required: true
    },

    cashBackToUser: {
        type: Number,
        default: 0
        // required:true,
    },
    fullPaymentDate: {
        type: Date
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
    // totalAmountPayable: {
    //     type: Number,
    //     required: [true, "please enter total booking amount paybale"],
    // },
    // partiallyAmountPaidRequired: {
    //     type: Number,
    //     required: [true, "please enter how much amount is required to confirm booking"],
    // }

})

const invoiceModel = mongoose.model("invoiceModel", invoiceSchema)
module.exports = invoiceModel