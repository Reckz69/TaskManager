import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ✅ IMPORTANT for cookies
});

/**
 * 🔁 RESPONSE INTERCEPTOR
 * Handles token refresh using cookies (no localStorage)
 */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ❗ Prevent infinite loop
    if (originalRequest?._retry) {
      return Promise.reject(error);
    }

    // ❗ Skip logout
    if (originalRequest?.url?.includes("/users/logout")) {
      return Promise.reject(error);
    }

    // 🔄 Handle 401 (expired access token)
    if (error.response?.status === 401) {
      originalRequest._retry = true;

      try {
        // 🔥 Refresh using COOKIE (no body needed)
        await API.post("/users/refresh-token");

        // 🔁 Retry original request
        return API(originalRequest);

      } catch (refreshError) {
        // ❌ Session expired → redirect
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// 🔗 API CALLS (unchanged)
export const loginUser = (data) => API.post("/users/login", data);
export const registerUser = (data) => API.post("/users/register", data);
export const getCurrentUser = () => API.get("/users/me");
export const logoutUser = () => API.post("/users/logout");

export default API;