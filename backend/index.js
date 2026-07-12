const { app, server } = require('./config/socket');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const messageRoute = require('./routes/message.route');
const cloudinaryConnect = require('./config/cloudinary');
const fileUpload = require('express-fileupload');
const db = require('./config/db');

// Enable CORS
app.use(cors({
    origin: ['https://chat-app-kappa-sand-60.vercel.app','http://localhost:5173'],
    credentials: true
}));

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('Hello world')
});

app.use(fileUpload({
    useTempFiles:true,
    useTempDir:'/tmp/'
}));

// routes config
app.use('/api/v1',userRoute);
app.use('/api/v2',messageRoute);

const PORT=process.env.PORT || 3000;

cloudinaryConnect();
db();

server.listen(PORT,()=>{
    console.log(`Server is listening to the PORT ${PORT}`);
});
