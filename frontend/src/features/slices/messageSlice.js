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
      // Avoid duplicate messages if socket fires twice or overlaps with fetch
      const exists = state.messages.some((msg) => msg._id === action.payload._id);
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
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
