const sendToken=async(res,statusCode,user,msg)=>{
    const token=await user.getJWTToken();
    //cookies option
    const options={
        maxAge:new Date(Date.now()+process.env.COOKIE_EXPIRE*60*60*1000),
    }

    res.status(statusCode).cookie("token",token,options).json({success:true,token,msg,user})
}

module.exports=sendToken;