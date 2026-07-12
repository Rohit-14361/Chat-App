import { createSlice } from "@reduxjs/toolkit";

const getInitialToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return token.startsWith('"') ? JSON.parse(token) : token;
  } catch {
    return null;
  }
};

const getInitialUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState = {
  token: getInitialToken(),
  user: getInitialUser(),
  loading: false,
};

export const authSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfileImage: (state, action) => {
      if (state.user) {
        state.user.profilePic = action.payload;
      }
    },
  },
});

export const { setToken, setLoading, setUser, setProfileImage } = authSlice.actions;
export default authSlice.reducer;