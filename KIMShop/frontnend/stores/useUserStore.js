import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { logout } from "../../backend/controllers/auth.controller.js";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
        confirmPassword,
      });

      set({ user: res.data, loading: false });
      toast.success("Signup successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  login: async ({ email, password }) => {
    console.log("Login function called with:", email, password);
    set({ loading: true });

    try {
      const res = await axios.post("/auth/login", { email, password });
      console.log("Response received:", res.data);
      set({ user: res.data, loading: false });
      toast.success("Login successful!");
    } catch (error) {
      set({ loading: false });
      console.error("Login error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout"); //Backend route will handle the actual logout procedure
      set({ user: null });
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },

  
  checkAuth: async () => {
    try {
      const response = await axios.get("/auth/profile");
      set({ user: response.data, checkingAuth: false });
    } catch (error) {
      set({ checkingAuth: false, user: null });
    }
  },
}));
