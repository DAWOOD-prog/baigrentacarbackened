const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin");
const customerModel = require("../models/customer");
const atob = require("../utils/atob");
const ErrorHandler = require("../utils/errorHandler");
const asyncErrorCatch = require("./asyncErrorHandlers");

// we actually do this for authentication that which resources are available for customer

const isAuthenticatedUser = asyncErrorCatch(async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if(!bearerHeader){
        return next(new ErrorHandler(401,"please login first to access this resource 1"));
    }
    const bearer=bearerHeader.split(' ')
    const token=bearer[1]
   
    if(!token){
        return next(new ErrorHandler(401,"please login first to access this resource 11"));
    }
    // const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    // if (Math.floor((new Date).getTime() / 1000) >= expiry) {
    //     return next(new ErrorHandler(401, "please login first to access this resource"));
    // }
    //verify token if it verify then it return an id
    console.log("jhiuguyfdyt");
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedData);
    const customer = await customerModel.findById(decodedData.id);
    console.log("customer",customer);
    if (!customer) {
        return next(new ErrorHandler(401, "please login first to access this resource"));
    }
    req.customer = customer
    next();
})



const isAuthenticated = asyncErrorCatch(async (req, res, next) => {
    const cookies = req.headers.cookie;
    console.log("cookie",cookies);
    if (!cookies) {
        return next(new ErrorHandler(401, "please login first to access this resource"));
    }
    const token = cookies.split("=")[1];
    console.log("token",token);
    if (!token) {
        console.log("jrede");
        return next(new ErrorHandler(401, "please login first to access this resource"));
    }
    // const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    // if (Math.floor((new Date).getTime() / 1000) >= expiry) {
    //     return next(new ErrorHandler(401, "please login first to access this resource"));
    // }
    //verify token if it verify then it return an id
    console.log("jhiuguyfdyt");
    const decodedData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedData);
    const customer = await customerModel.findById(decodedData.id);
    if(customer){
        req.customer = customer
    }
    const admin = await adminModel.findById(decodedData.id);
    if(admin){
        req.admin = admin
    }
    if (!customer&&!admin) {
        return next(new ErrorHandler(401, "please login first to access this resource"));
    }
    
    next();
})
// const isAuthenticatedUser=asyncErrorCatch(async(req,res,next)=>{
//     // if(Date.now()>=process.env.JWT_EXPIRE*60*60*1000){
//     //     return next(new ErrorHandler(401,"please login to avail this service"))
//     // }
//     // req.cookies
//     const token=req.headers.cookies;
//     console.log(typeof token);
//     console.log(token);
//     if(!token){
//         return next(new ErrorHandler(401,"please login first to access this resource"));
//     }
//     const expiry=(JSON.parse(atob(token.split('.')[1]))).exp;
//     console.log((JSON.parse(atob(token.split('.')[1]))).exp);
//     console.log(Math.floor((new Date).getTime()/1000));
//     if(Math.floor((new Date).getTime()/1000)>=expiry){
//         return next(new ErrorHandler(401,"please login first to access this resource"));
//     }
//     //verify token if it verify then it return an id
//     const decodedData=await jwt.verify(token,process.env.JWT_SECRET_KEY);
//     const customer=await customerModel.findById(decodedData.id);
//     if(!customer){
//         return next(new ErrorHandler(401,"please login first to access this resource"));
//     }
//     req.customer=customer
//     console.log(req.customer);
//     next();
// })
const isAuthenticatedAdmin=asyncErrorCatch(async(req,res,next)=>{
    const bearerHeader = req.headers['authorization'];
    if(!bearerHeader){
        return next(new ErrorHandler(401,"please login first to access this resource 1"));
    }
    const bearer=bearerHeader.split(' ')
    const token=bearer[1]
   
    if(!token){
        return next(new ErrorHandler(401,"please login first to access this resource 11"));
    }
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    if (Math.floor((new Date).getTime() / 1000) >= expiry) {
        return next(new ErrorHandler(401, "please login first to access this resource"));
    }
    //verify token if it verify then it return an id
    const decodedData=await jwt.verify(token,process.env.JWT_SECRET_KEY)
    const admin=await adminModel.findById(decodedData.id);
    if(!admin){
       return next(new ErrorHandler(401,"please login as admin to access this resource"))
    }
    req.admin=admin;
    console.log(req.admin);
    next();
})

const authorizedStatus=(req,res,next)=>{
    if(!req.admin.isActive){
        return next(new ErrorHandler(400,"You don't have rights to access this"));
    }
    next();
}
const authorizedRoles=(req,res,next)=>{
    if(req.admin.role!=="admin"){
         return next(new ErrorHandler(400,"only admin has to access this resource"));
    }
    next();
}
module.exports={isAuthenticatedUser,isAuthenticated,authorizedRoles,isAuthenticatedAdmin,authorizedStatus};