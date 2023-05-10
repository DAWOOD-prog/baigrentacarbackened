const mongoose=require('mongoose');

const databaseConnection=()=>{
    mongoose.connect(process.env.URL).then((data)=>{
        console.log("Database Connected Successfully");
    }).catch((error)=>{
        console.log("Db con error ",error);
    })

    mongoose.connection.on('error',(error)=>{
        console.log("Db con error ",error);
    })

}

module.exports=databaseConnection;