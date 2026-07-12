import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import WelcomeContainer from "../components/WelcomeContainer";

import { Logout, updateProfilePicture } from "../services/authAPI";
import { fetchSidebarUsers, fetchChatHistory, sendChatMessage } from "../services/messageAPI";
import { setSelectedUser } from "../features/slices/messageSlice";
import { getSocket } from "../services/socketService";

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, token } = useSelector((state) => state.auth);
  const { users, messages, selectedUser, onlineUsers, typingUsers } = useSelector(
    (state) => state.message
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  // Initial fetch of sidebar users
  useEffect(() => {
    if (token) {
      dispatch(fetchSidebarUsers(token));
    }
  }, [dispatch, token]);

  // Fetch chat history when selectedUser changes
  useEffect(() => {
    if (selectedUser && token) {
      dispatch(fetchChatHistory(selectedUser._id, token));
      setInputText("");
      setSelectedImage(null);
      setImagePreview(null);
    }
  }, [dispatch, selectedUser, token]);

  // Handle message send
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    // Send via API
    dispatch(sendChatMessage(selectedUser._id, inputText, selectedImage, token));

    // Emit stop typing
    const socket = getSocket();
    if (socket) {
      socket.emit("stopTyping", { senderId: user._id, receiverId: selectedUser._id });
    }

    setInputText("");
    setSelectedImage(null);
    setImagePreview(null);
    setIsTyping(false);
  };

  // Handle typing status
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    const socket = getSocket();
    if (!socket || !selectedUser) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { senderId: user._id, receiverId: selectedUser._id });
    }

    // Debounce/Timeout to stop typing indicator after 1.5 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { senderId: user._id, receiverId: selectedUser._id });
      setIsTyping(false);
    }, 1500);
  };

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Handle image attachment selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image attachment
  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Handle avatar upload click
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(updateProfilePicture(file, token));
    }
  };

  const handleLogout = () => {
    dispatch(Logout(navigate));
  };

  const handleSelectUser = (selectedContact) => {
    dispatch(setSelectedUser(selectedContact));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-955 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-gray-200">
      
      {/* Sidebar Component */}
      <Sidebar
        currentUser={user}
        users={users}
        selectedUser={selectedUser}
        onlineUsers={onlineUsers}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSelectUser={handleSelectUser}
        onLogout={handleLogout}
        onAvatarChange={handleAvatarChange}
      />

      {/* Main Container: Chat Container or Welcome Splash Screen */}
      {selectedUser ? (
        <ChatContainer
          currentUser={user}
          selectedUser={selectedUser}
          messages={messages}
          onlineUsers={onlineUsers}
          typingUsers={typingUsers}
          inputText={inputText}
          onInputChange={handleInputChange}
          imagePreview={imagePreview}
          onImageSelect={handleImageChange}
          onRemoveImage={removeSelectedImage}
          onSubmitMessage={handleSendMessage}
        />
      ) : (
        <WelcomeContainer />
      )}
    </div>
  );
}

export default Dashboard;
