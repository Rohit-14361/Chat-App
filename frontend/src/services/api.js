const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://chat-app-nsc8.onrender.com";

export const authEndPoints = {
  SIGNUP_API: BASE_URL + "/api/v1/signup",
  LOGIN_API: BASE_URL + "/api/v1/login",
  LOGOUT_API: BASE_URL + "/api/v1/logout",
  UPDATE_PROFILE: BASE_URL + "/api/v1/update-profile",
};

export const messageEndPoints = {
  SEND_MESSAGE_API: BASE_URL + "/api/v2/send",
  GET_SIDEBAR_USERS: BASE_URL + "/api/v2/get-users/sidebar",
  GET_MESSAGES: BASE_URL + "/api/v2/get-message",
};
