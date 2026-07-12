const express=require('express');
const { Auth } = require('../middleware/auth.middleware');
const { sendMessage, getAllUserForSidebar, getMessages } = require('../controller/message.controller');
const router=express.Router();

router.post('/send/:id',Auth,sendMessage);
router.get('/get-users/sidebar',Auth,getAllUserForSidebar);
router.get('/get-message/:id',Auth,getMessages);



module.exports=router;