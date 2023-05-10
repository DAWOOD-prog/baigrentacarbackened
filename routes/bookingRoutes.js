const express=require('express');
const { getSingleBookingDetail, getAllBookings, registerBooking, deleteBooking, updateBookings, updateBookingStatus } = require('../controllers/bookingController');
const { isAuthenticatedAdmin, authorizedStatus, isAuthenticatedUser } = require('../middleware/auth');
const { uploadCustomerLisence, uploadBookingImage } = require('../utils/uploadFile');
const router=express.Router();

router.get('/',isAuthenticatedAdmin,authorizedStatus,getAllBookings)
router.get('/:id',isAuthenticatedAdmin,authorizedStatus,getSingleBookingDetail)

router.post('/register',isAuthenticatedUser,uploadBookingImage.fields([{
    name: 'userCnic', maxCount: 1
  }, {
    name: 'userLiscence', maxCount: 1
  }]) ,registerBooking);
  
// router.post('/register',isAuthenticatedUser,uploadCustomerLisence.single('customerLiscence'),registerBooking)
router.put('/update/:id',isAuthenticatedAdmin,authorizedStatus,uploadCustomerLisence.single('customerLiscence'),updateBookings)
router.put('/update/status/:id',isAuthenticatedAdmin,authorizedStatus,updateBookingStatus)

router.delete('/delete/:id',isAuthenticatedAdmin,authorizedStatus,deleteBooking);

module.exports=router