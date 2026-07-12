import { apiConnector } from "./apiConnector";
import { messageEndPoints } from "./api";
import { setUsers, setMessages, addMessage } from "../features/slices/messageSlice";
import { toast } from "react-hot-toast";

const { SEND_MESSAGE_API, GET_SIDEBAR_USERS, GET_MESSAGES } = messageEndPoints;

export function fetchSidebarUsers(token) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        GET_SIDEBAR_USERS,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUsers(response.data.filteredUser));
    } catch (err) {
      console.error("GET_SIDEBAR_USERS_ERROR", err);
      toast.error("Failed to load users list");
    }
  };
}

export function fetchChatHistory(userToChatId, token) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        "GET",
        `${GET_MESSAGES}/${userToChatId}`,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setMessages(response.data.findAllMessages));
    } catch (err) {
      console.error("GET_CHAT_HISTORY_ERROR", err);
      toast.error("Failed to load chat history");
    }
  };
}

export function sendChatMessage(recieverId, text, imageFile, token) {
  return async (dispatch) => {
    try {
      let bodyData;
      let headers = { Authorization: `Bearer ${token}` };

      if (imageFile) {
        const formData = new FormData();
        formData.append("text", text || "");
        formData.append("image", imageFile);
        bodyData = formData;
        headers["Content-Type"] = "multipart/form-data";
      } else {
        bodyData = { text };
      }

      const response = await apiConnector(
        "POST",
        `${SEND_MESSAGE_API}/${recieverId}`,
        bodyData,
        headers
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(addMessage(response.data.newMessage));
      return response.data.newMessage;
    } catch (err) {
      console.error("SEND_MESSAGE_ERROR", err);
      toast.error("Message could not be sent");
      return null;
    }
  };
}
