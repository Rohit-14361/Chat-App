const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

// used to store online users
const userSocketMap = {}; // { userId: Set<socketId> }

const getReceiverSocketIds = (userId) => {
  return userSocketMap[userId] ? Array.from(userSocketMap[userId]) : [];
};

const getReceiverSocketId = (userId) => {
  const ids = getReceiverSocketIds(userId);
  return ids.length > 0 ? ids[0] : undefined;
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!userSocketMap[userId]) {
      userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);
  }

  // Send online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("typing", ({ senderId, receiverId }) => {
    const receiverSocketIds = getReceiverSocketIds(receiverId);
    receiverSocketIds.forEach((socketId) => {
      io.to(socketId).emit("userTyping", { userId: senderId, isTyping: true });
    });
  });

  socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSocketIds = getReceiverSocketIds(receiverId);
    receiverSocketIds.forEach((socketId) => {
      io.to(socketId).emit("userTyping", { userId: senderId, isTyping: false });
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    if (userId && userSocketMap[userId]) {
      userSocketMap[userId].delete(socket.id);
      if (userSocketMap[userId].size === 0) {
        delete userSocketMap[userId];
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = {
  io,
  app,
  server,
  getReceiverSocketId,
  getReceiverSocketIds,
};