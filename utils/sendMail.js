const nodemailer=require('nodemailer');
const asyncErrorCatch = require('../middleware/asyncErrorHandlers');

const sendEmailToUser=asyncErrorCatch(async(options)=>{
    const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASSWORD

        }
    })

    const mailOptions={ 
        from:process.env.SMPT_USER,
        to:options.email, 
        subject:options.subject,
        text:options.message
    }

    await transporter.sendMail(mailOptions);
})

module.exports=sendEmailToUser;