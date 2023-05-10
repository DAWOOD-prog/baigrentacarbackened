const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const customerSchema = new mongoose.Schema({
    name: {
        firstName: {
            type: String,
            required: [true, "please enter your first name"]
        },
        lastName: {
            type: String,
            required: [true, "please enter your first name"]
        },
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        validate: [validator.isEmail, "please enter correct email"]
    },
    address: {
        type: String,
        required: [true, "please enter your address"],
    },
    cnic: {
        type: String,
        required: [true, "please enter your cnic"]
    },
    number: {
        type: Number,
        required: [true, "please enter your number"]
    },
    gender: {
        type: String,
        required: [true, "please select your gender"]
    },
    status: {
        type: String,
        default: "active"
    },
    acceptTerms: {
        type: Boolean,
        required: true
    },
    role: {
        type: String,
        default: "user"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        minLength: [8, "password should be greater than 8 characters"],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

//this method will be called before saving schema
customerSchema.pre('save', async function (req, res, next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12)
})

//get JWT Token

customerSchema.methods.getJWTToken = async function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
}

//compare password

customerSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//reset password token 
customerSchema.methods.getResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex');
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000)
    return resetToken;
}


const customerModel = mongoose.model('customerModel', customerSchema);

module.exports = customerModel;