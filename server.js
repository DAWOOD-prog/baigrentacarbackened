const app=require('./app')
const dotenv=require('dotenv');
const multer=require('multer');
const databaseConnection=require('./config/db.config')

//config dot env
dotenv.config({path:'./config/config.env'});

//database connection
databaseConnection();

const server=multer.diskStorage({ 
    destination:function(req,file,cb){
        cb(null,'./uploads')
    }
})
app.listen(process.env.PORT,()=>{
    console.log("server is listening at port "+ process.env.PORT);
})

