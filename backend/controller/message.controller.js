const { io, getReceiverSocketIds } = require("../config/socket");
const Message = require("../models/message.model");
const User = require("../models/user.model");
const imageUploader = require("../utils/imageUploader");

exports.getAllUserForSidebar = async (req, res) => {
  try {
    const user = req.user._id;

    const filteredUser = await User.find({ _id: { $ne: user } }).select(
      "-password",
    );

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      filteredUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!userToChatId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const findAllMessages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "All Messages fetched successfully.",
      findAllMessages,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later!",
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.files?.image;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await imageUploader(
        image,
        process.env.FOLDER_NAME,
        1000,
        1000,
      );
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    // Realtime communication using socket.io
    const receiverSocketIds = getReceiverSocketIds(recieverId);
    receiverSocketIds.forEach((socketId) => {
      io.to(socketId).emit("newMessage", newMessage);
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      newMessage,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while sending Messages. Please try again later!",
    });
  }
};
