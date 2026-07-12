import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  messages: [],
  selectedUser: null,
  onlineUsers: [],
  typingUsers: {},
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      if (!state.selectedUser) return;

      // Only append if the message belongs to the current conversation
      const isFromSelectedUser = message.senderId === state.selectedUser._id;
      const isToSelectedUser = message.recieverId === state.selectedUser._id;

      if (isFromSelectedUser || isToSelectedUser) {
        // Avoid duplicate messages if socket fires twice or overlaps with fetch
        const exists = state.messages.some((msg) => msg._id === message._id);
        if (!exists) {
          state.messages.push(message);
        }
      }
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      state.messages = []; // Clear messages immediately when switching users to avoid stale UI bleed
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setTypingUsers: (state, action) => {
      state.typingUsers = action.payload;
    },
    setUserTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      state.typingUsers[userId] = isTyping;
    },
  },
});

export const {
  setUsers,
  setMessages,
  addMessage,
  setSelectedUser,
  setOnlineUsers,
  setTypingUsers,
  setUserTyping,
} = messageSlice.actions;

export default messageSlice.reducer;
