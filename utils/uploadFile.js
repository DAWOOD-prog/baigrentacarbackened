const multer=require('multer');
const maxSize=2*1024*1024;

const Vehiclestorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./resources/images/vehicles");
    },
    
    filename:(req,file,cb)=>{ //cb(err,result)
        cb(null,`${Date.now()}${file.originalname.replace(/\s/g,"_")}`,function(err,result){
            console.log(err,result);
            if(err){
                throw err;
            }
        });
    }
})
const driverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "driverProfile") {
            cb(null, "./resources/images/driver/profile")
        }
        else if (file.fieldname === "driverLiscence") {
            cb(null, "./resources/images/driver/liscence")
        }
    },

    filename: (req, file, cb) => { //cb(err,result)
        cb(null, `${Date.now()}${file.originalname.replace(/\s/g, "_")}`, function (err, result) {
            console.log(err, result);
            if (err) {
                fs.unlinkSync(req.file.path);
                throw err;
            }
        });
    }
})

const CustomerLisenceStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./resources/images/customerLisence");
    },
    
    filename:(req,file,cb)=>{ //cb(err,result)
        cb(null,`${Date.now()}${file.originalname.replace(/\s/g,"_")}`,function(err,result){
            console.log(err,result);
            if(err){
                throw err;
            }
        });
    }
})
const bookingStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "userCnic") {
            cb(null, "./resources/images/booking/cnic")
        }
        else if (file.fieldname === "userLiscence") {
            cb(null, "./resources/images/booking/liscense")
        }
    },

    filename: (req, file, cb) => { //cb(err,result)
        cb(null, `${Date.now()}${file.originalname.replace(/\s/g, "_")}`, function (err, result) {
            console.log(err, result);
            if (err) {
                fs.unlinkSync(req.file.path);
                throw err;
            }
        });
    }
})

const filterFile=(req,file,cb)=>{
    if(file.mimetype==="image/jpeg" || file.mimetype==="image/jpg" ||file.mimetype==="image/png"){
        cb(null,true,function(err,result){
            if(err){
                throw err;
            }
        })
    }
    else{
        cb(null,false)
    }
}

exports.uploadVehicleImage=multer({storage:Vehiclestorage,fileFilter:filterFile});
exports.uploadDriverImage=multer({storage:driverStorage,fileFilter:filterFile});
exports.uploadCustomerLisence=multer({storage:CustomerLisenceStorage,limits:{fileSize:maxSize},fileFilter:filterFile});

exports.uploadBookingImage=multer({storage:bookingStorage});
