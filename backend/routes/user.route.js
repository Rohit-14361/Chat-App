const express=require('express');
const { Signup, Login, health, updateProfile, Logout } = require('../controller/user.controller');
const { Auth } = require('../middleware/auth.middleware');
const { getAllUserForSidebar ,getMessages} = require('../controller/message.controller');
const router=express.Router();

router.post('/signup',Signup);
router.post('/login',Login);
router.put('/update-profile',Auth,updateProfile);
router.post('/logout',Logout);
router.get('/health',health)


module.exports=router;