const express=require('express');
const { registerVehicle, updateVehicle, deleteVehicle, getAllVehicle, getSingleVehicleDetail, getAllVehiclesByAdmin, getSingleVehicleDetailByAdmin } = require('../controllers/vehicleController');
const { isAuthenticatedAdmin, authorizedStatus } = require('../middleware/auth');
const { uploadVehicleImage } = require('../utils/uploadFile');
const router=express.Router();

router.post('/register',[isAuthenticatedAdmin,authorizedStatus,uploadVehicleImage.single('image')],registerVehicle);
router.put('/update/:id',[isAuthenticatedAdmin,authorizedStatus,uploadVehicleImage.single('image')],updateVehicle);

router.delete('/delete/:id',[isAuthenticatedAdmin,authorizedStatus],deleteVehicle);
router.get('/',getAllVehicle);
router.get('/:id',getSingleVehicleDetail);
router.get('/admin/:id',isAuthenticatedAdmin,getSingleVehicleDetailByAdmin);
router.get('/all/admin',isAuthenticatedAdmin,getAllVehiclesByAdmin);


module.exports=router;