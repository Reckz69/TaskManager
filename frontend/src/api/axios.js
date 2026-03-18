import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
/**
 * 🔐 REQUEST INTERCEPTOR
 * Adds access token to every request
 */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * 🔁 RESPONSE INTERCEPTOR
 * Handles token refresh (but skips logout)
 */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❗ Skip refresh logic for logout
    if (originalRequest?.url?.includes("/users/logout")) {
      return Promise.reject(error);
    }

    // 🔄 Handle expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/users/refresh-token",
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;

        // Save new token
        localStorage.setItem("accessToken", accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);

      } catch (refreshError) {
        // ❌ Session expired completely
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 🔗 API CALLS
export const loginUser = (data) => API.post("/users/login", data);
export const registerUser = (data) => API.post("/users/register", data);
export const getCurrentUser = () => API.get("/users/me");
export const logoutUser = () => API.post("/users/logout");

export default API;