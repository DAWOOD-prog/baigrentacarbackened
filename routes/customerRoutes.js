const express=require('express');
const router=express.Router();
const { customerRegister, customerLogin, Logout, forgotPassword, resetPassword, getAllCustomers, getSingleCustomerDetail, updateCustomerInfo, deleteCustomer, updateCustomerPassword, getCustomerOwnProfile, updateCustomerOwnPassword, updateCustomerOwnProfile, verifyUser, getAllSpecificCustomerBookings, customerRegisterAdmin } = require('../controllers/customerController');
const {isAuthenticatedAdmin,authorizedRoles, isAuthenticatedUser,authorizedStatus, isAuthenticated} = require('../middleware/auth');
const customerModel = require('../models/customer');



router.post('/register',customerRegister);
router.post('/login',customerLogin);
router.post('/logout',Logout);

router.post('/password/forgot',forgotPassword);
router.put('/password/reset/:token',resetPassword);

router.get('/me',isAuthenticatedUser,getCustomerOwnProfile);
router.put('/me/update/password',isAuthenticatedUser,updateCustomerOwnPassword)
router.put('/me/update',isAuthenticatedUser,updateCustomerOwnProfile)

//admin routes
router.post('/register/admin',isAuthenticatedAdmin,customerRegisterAdmin);
router.get('/admin/users',isAuthenticatedAdmin,authorizedRoles,authorizedStatus,getAllCustomers);
router.get('/admin/user/:id',isAuthenticatedAdmin,authorizedRoles,authorizedStatus,getSingleCustomerDetail);
router.put('/admin/user/:id',isAuthenticatedAdmin,authorizedRoles,authorizedStatus,updateCustomerInfo);
// router.put('/admin/user/password/reset/:id',isAuthenticatedAdmin,authorizedRoles,updateCustomerPassword)
router.delete('/admin/user/:id',isAuthenticatedAdmin,authorizedRoles,authorizedStatus,deleteCustomer);
router.get('/admin/users/bookings/:id',isAuthenticatedAdmin,authorizedRoles,authorizedStatus,getAllSpecificCustomerBookings);

//verify token

router.get('/verify', isAuthenticatedUser, verifyUser)
module.exports=router;