const express=require('express');
const { registerFaqs, getAllFaqs, getSingleFaqsDetail, deletefaqs, updatefaqs } = require('../controllers/faqsController');
const { isAuthenticatedAdmin, authorizedStatus } = require('../middleware/auth');
const router=express.Router();

router.post('/register',isAuthenticatedAdmin,registerFaqs);
router.get('/',getAllFaqs)
router.put('/:id',isAuthenticatedAdmin,updatefaqs)
router.get('/:id',isAuthenticatedAdmin,getSingleFaqsDetail)
router.delete('/:id',isAuthenticatedAdmin,authorizedStatus,deletefaqs)
module.exports=router;