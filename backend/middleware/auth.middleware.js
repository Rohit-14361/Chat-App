const jwt=require('jsonwebtoken');
const User= require('../models/user.model');


exports.Auth=async(req,res,next)=>{
    try{
        const token = req.cookies?.token || req.headers["authorization"]?.replace("Bearer ", "");
        console.log("--- Auth Middleware Debug ---");
        console.log("Extracted Token:", token);

        if(!token || token===null || token === "undefined"){
            console.log("Auth Failed: Token is missing, null, or 'undefined' string");
            return res.status(401).json({
                success:false,
                message:"Please log in first!"
            })
        }

        const decode=await jwt.verify(token,process.env.JWT_SECRET);
        console.log("Decoded Payload:", decode);

        const user=await User.findById(decode.id).select("-password");
        console.log("Database User Found:", user ? user.email : "null");

        if(!user){
            console.log("Auth Failed: User not found in DB");
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        if(!decode){
            console.log("Auth Failed: Decode payload is invalid");
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        }


        req.user=user;
        next();
    }
    catch(err){
        console.log("Auth Middleware Error:", err.message);
        console.error(err);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the token!"
        })
    }
}