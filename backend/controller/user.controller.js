const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const imageUploader = require("../utils/imageUploader");
const { io } = require("../config/socket");


exports.health=async(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"Server is responding."
    })
}

exports.Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Required field is missing.",
      });
    }

    if (password.length <= 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }
    // check user exist or not
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        success: false,
        message: "User already exists.",
      });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const payload = {
      id: newUser._id,
      email: newUser.email,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    
    const options = {
      httpOnly: true,
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    };

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.cookie("token", token, options).status(201).json({
      success: true,
      message: "User signup successfully.",
      token,
      user: userResponse,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while Signup. Please try again later!",
    });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password must be required.",
      });
    }

    if (password.length <= 5) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Please Signup First.",
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (verifyPassword) {
      const payload = {
        id: user._id,
        email: user.email,
      };
      const token = await jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      };

      const userResponse = user.toObject();
      delete userResponse.password;

      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Logged in successfully",
        token,
        user: userResponse,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later!",
    });
  }
};

exports.Logout = async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0), httpOnly: true });
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while Logout. Please try again later!",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profileImage = req.files?.profileImage;
    const userId = req.user.id || req.user._id;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile Image is required.",
      });
    }

    const image = await imageUploader(
      profileImage,
      process.env.FOLDER_NAME,
      1000,
      1000,
    );

    // update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: image.secure_url },
      { new: true }
    ).select("-password");

    // Broadcast profile update to all connected clients
    if (io) {
      io.emit("userUpdated", user);
    }

    return res.status(200).json({
      success: true,
      message: "Image upload successfully.",
      user,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message:
        "Internal Server error while updating the profile. Please try again later!",
    });
  }
};

