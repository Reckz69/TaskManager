import axios from "axios";

const API = axios.create({
  baseURL: "https://taskmanager-u7vk.onrender.com/api/v1",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
  
      // ❗ Skip logout request
      if (originalRequest?.url?.includes("/users/logout")) {
        return Promise.reject(error);
      }
  
      // 🔁 Try refresh once
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        try {
          const res = await axios.post(
            "https://taskmanager-u7vk.onrender.com/api/v1/users/refresh-token",
            {},
            { withCredentials: true }
          );
  
          const { accessToken } = res.data.data;
  
          // Save new token
          localStorage.setItem("accessToken", accessToken);
  
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return API(originalRequest);
  
        } catch (refreshError) {
          // 🔥 SESSION EXPIRED
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
  
          // Let React handle redirect
          return Promise.reject(refreshError);
        }
      }
  
      return Promise.reject(error);
    }
  );

export const loginUser = (data) =>
  API.post("/users/login", data);

export const registerUser = (formData) =>
  API.post("/users/register", formData);

export const getCurrentUser = () =>
  API.get("/users/me");

// CHANGE PASSWORD
export const changePassword = (data) =>
    API.post("/users/change-password", data);
  
// REFRESH TOKEN
export const refreshToken = () =>
    API.post("/users/refresh-token");

// LOGOUT
export const logoutUser = () =>
    API.post("/users/logout");
  

export default API;