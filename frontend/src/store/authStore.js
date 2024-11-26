import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";
axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  // Signup function
  signup: async (email, password, username, fullname) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, username, fullname });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user in localStorage
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({
        isAuthenticated: true,
        user: response.data.user,
        error: null,
        isLoading: false,
      });
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user in localStorage
    } catch (error) {
      set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
      localStorage.removeItem('user'); // Remove user from localStorage
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  // Verify Email function
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Update user in localStorage
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  // Forgot Password function
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error sending reset password email",
      });
      throw error;
    }
  },

  // Reset Password function
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Error resetting password",
      });
      throw error;
    }
  },

  // Check authentication status function
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            set({ 
                user: null, 
                isAuthenticated: false, 
                isCheckingAuth: false 
            });
            return;
        }

        const userObj = JSON.parse(storedUser);
        if (!userObj || !userObj._id) {
            localStorage.removeItem('user');
            set({ 
                user: null, 
                isAuthenticated: false, 
                isCheckingAuth: false 
            });
            return;
        }

        const response = await axios.get(`${API_URL}/check-auth?userID=${userObj._id}`);
        
        if (response.data.success) {
            set({ 
                user: response.data.user, 
                isAuthenticated: true, 
                isCheckingAuth: false 
            });
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        localStorage.removeItem('user');
        set({ 
            user: null, 
            isAuthenticated: false, 
            isCheckingAuth: false,
            error: error.response?.data?.message || "Authentication failed" 
        });
    }
}
}));