import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth.js";
import toast from "react-hot-toast";
import { refreshToken } from "../api/auth.js";

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };



  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 1️⃣ Try normal request
        const res = await getCurrentUser();
  
        const userData =
          res.data?.data?.user ||
          res.data?.user ||
          res.data?.data;
  
        setUser(userData);
  
      } catch (err) {
        // 2️⃣ If access token expired → try refresh
        if (err.response?.status === 401) {
          try {
            await refreshToken(); // 🔥 KEY STEP
  
            // Retry after refresh
            const res = await getCurrentUser();
  
            const userData =
              res.data?.data?.user ||
              res.data?.user ||
              res.data?.data;
  
            setUser(userData);
  
          } catch (refreshErr) {
            setUser(null);
            toast.error("Session expired");
          }
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // 🔥 add this (needed in Navbar)
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);