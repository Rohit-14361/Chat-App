import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import OpenRoute from "./components/OpenRoute";

import { connectSocket, disconnectSocket } from "./services/socketService";
import { setOnlineUsers, setUserTyping, addMessage, updateUserInList } from "./features/slices/messageSlice";

function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  // Manage global socket connection and event listeners
  useEffect(() => {
    if (token && user) {
      // Connect to Socket.io
      const socket = connectSocket(user._id);

      // Listen for list of online users
      socket.on("getOnlineUsers", (usersList) => {
        dispatch(setOnlineUsers(usersList));
      });

      // Listen for incoming messages
      socket.on("newMessage", (msg) => {
        dispatch(addMessage(msg));
      });

      // Listen for user typing indicators
      socket.on("userTyping", ({ userId, isTyping }) => {
        dispatch(setUserTyping({ userId, isTyping }));
      });

      // Listen for user details/avatar updates
      socket.on("userUpdated", (updatedUser) => {
        dispatch(updateUserInList(updatedUser));
      });

      // Cleanup listeners and disconnect socket on logout/unmount
      return () => {
        socket.off("getOnlineUsers");
        socket.off("newMessage");
        socket.off("userTyping");
        socket.off("userUpdated");
        disconnectSocket();
      };
    } else {
      disconnectSocket();
    }
  }, [dispatch, token, user]);

  return (
    <div className="w-screen h-screen overflow-hidden bg-slate-900">
      <Routes>
        {/* Protected Chat Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Public Routes for Authentication */}
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;