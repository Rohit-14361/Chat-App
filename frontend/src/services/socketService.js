import { io } from "socket.io-client";

let socket = null;

export const getSocket = () => {
  return socket;
};

export const connectSocket = (userId) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  if (!socket) {
    socket = io(backendUrl, {
      query: { userId },
      transports: ["websocket"], 
    });
    console.log("Socket connected for user:", userId);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected");
  }
};
