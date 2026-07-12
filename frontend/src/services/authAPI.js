import { toast } from "react-hot-toast";
import { apiConnector } from "./apiConnector";
import { authEndPoints } from "./api";
import { setToken, setLoading, setUser, setProfileImage } from "../features/slices/authSlice";

const { SIGNUP_API, LOGIN_API, LOGOUT_API, UPDATE_PROFILE } = authEndPoints;

export function Signup(name, email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating account...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        name,
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Signup failed");
      }

      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("SIGNUP_API_ERROR", err);
      toast.error(err.response?.data?.message || err.message || "Signup Failed!");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function Login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging in...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Login failed");
      }

      const token = response.data.token;
      const user = response.data.user;

      toast.success("Login Successful");
      
      dispatch(setToken(token));
      dispatch(setUser(user));

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      console.error("LOGIN API ERROR...", err);
      toast.error(err.response?.data?.message || err.message || "Login failed!");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function Logout(navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging out...");
    try {
      await apiConnector("POST", LOGOUT_API);
      
      dispatch(setToken(null));
      dispatch(setUser(null));
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("LOGOUT_API_ERROR", err);
      toast.error("Logout failed!");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function updateProfilePicture(profileImage, token) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating profile image...");
    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage);

      const response = await apiConnector(
        "PUT",
        UPDATE_PROFILE,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const updatedUser = response.data.user;
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile picture updated successfully");
    } catch (err) {
      console.error("UPDATE_PROFILE_API_ERROR", err);
      toast.error(err.response?.data?.message || "Failed to update profile image");
    } finally {
      toast.dismiss(toastId);
    }
  };
}
