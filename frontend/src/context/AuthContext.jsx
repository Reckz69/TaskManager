import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth.js";
import toast from "react-hot-toast";


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
        const res = await getCurrentUser();
  
        const userData =
          res.data?.data?.user ||
          res.data?.user ||
          res.data?.data;
  
        setUser(userData);
  
      } catch (err) {
        // ❌ DO NOT manually call refresh here
        // Axios interceptor already handles it
  
        setUser(null);
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