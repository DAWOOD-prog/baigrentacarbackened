const express=require('express');
const { registerDriver, updateDriver, getAllDrivers, getSingleDriverDetail, deleteDriver, getAllAvailableDrivers, driverLogin } = require('../controllers/driverController');
const { isAuthenticatedAdmin, authorizedStatus } = require('../middleware/auth');
const { uploadDriverImage } = require('../utils/uploadFile');
const router=express.Router();

router.get('/',isAuthenticatedAdmin,authorizedStatus,getAllDrivers)
router.get('/available',isAuthenticatedAdmin,authorizedStatus,getAllAvailableDrivers)
router.get('/:id',isAuthenticatedAdmin,authorizedStatus,getSingleDriverDetail)
router.post('/register',[isAuthenticatedAdmin,authorizedStatus],uploadDriverImage.fields([{
    name: "driverProfile", maxCount: 1
  }, {
    name: "driverLiscence", maxCount: 1
  }]) ,registerDriver);
// router.post('/register',isAuthenticatedAdmin,authorizedStatus,uploadDriverImage.single('image'),registerDriver)
router.put('/update/:id',isAuthenticatedAdmin,authorizedStatus,uploadDriverImage.fields([{
  name: "driverProfile", maxCount: 1
}, {
  name: "driverLiscence", maxCount: 1
}]) ,updateDriver)
router.delete('/delete/:id',isAuthenticatedAdmin,authorizedStatus,deleteDriver)


router.post('/login',driverLogin);
module.exports=router;