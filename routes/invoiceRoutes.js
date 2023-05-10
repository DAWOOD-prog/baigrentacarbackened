const express=require('express');
const { registerVehicle, updateVehicle, deleteVehicle, getAllVehicle, getSingleVehicleDetail, getAllVehiclesByAdmin, getSingleVehicleDetailByAdmin } = require('../controllers/vehicleController');
const { isAuthenticatedAdmin, authorizedStatus } = require('../middleware/auth');
const { uploadVehicleImage } = require('../utils/uploadFile');
const { getSingleInvoiceDetail, createInvoice, getAllInvoices, deleteInvoice, getSingleInvoiceDetailWithPDF, getSingleInvoiceDetailWithBooking } = require('../controllers/invoiceController');
const router=express.Router();

// router.post('/register',[isAuthenticatedAdmin,authorizedStatus,uploadVehicleImage.single('image')],registerVehicle);
router.put('/:id',isAuthenticatedAdmin,createInvoice);

router.delete('/:id',isAuthenticatedAdmin,deleteInvoice);
 router.get('/',isAuthenticatedAdmin,getAllInvoices);
router.get('/:id',isAuthenticatedAdmin,getSingleInvoiceDetail);
router.get('/pdf/:id',isAuthenticatedAdmin,getSingleInvoiceDetailWithPDF);
router.get('/booking/:id',isAuthenticatedAdmin,getSingleInvoiceDetailWithBooking);
// router.get('/all/admin',isAuthenticatedAdmin,getAllVehiclesByAdmin);


module.exports=router;