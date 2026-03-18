import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { logoutUser } from "../api/auth.js";
import { Mountain, LogOut } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout API failed (expected sometimes)");
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    logout(); 
    toast.success("See you soon!");
    navigate("/login");
  };
  
  const isActive = (path) => location.pathname === path;

  return (
    // 📱 Mobile-First Design: Added -webkit-backdrop-blur for Safari (iPhone)
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-3xl [-webkit-backdrop-blur:30px] z-[100] transition-all duration-700 border-b border-white/20 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        
        {/* 🏔️ Logo - Scaled for mobile */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/40 active:scale-90 transition-all">
            <Mountain className="text-[#ccff00] w-5 h-5 md:w-7 md:h-7" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none hidden xs:flex">
            <span className="text-lg md:text-2xl font-black tracking-tighter text-slate-800 uppercase">
              EVEREST<span className="text-blue-500">.</span>
            </span>
          </div>
        </Link>
  
        {/* 🔗 Actions - Optimized for Touch */}
        <div className="flex items-center gap-2 md:gap-6">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest px-4 md:px-6 py-2.5 rounded-xl md:rounded-2xl transition-all active:scale-95 ${
                  isActive("/dashboard") 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                    : "text-slate-500 hover:text-blue-600 bg-white/20"
                }`}
              >
                {/* On very small mobile, we can just show an icon or short text */}
                <span className="hidden sm:inline">My Journey</span>
                <span className="sm:hidden text-[9px]">Dashboard</span>
              </Link>
  
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-3 md:px-5 py-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-rose-500 active:bg-rose-50 transition-all active:scale-90"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-500" strokeWidth={2.5} />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-[10px] md:text-[11px] font-bold text-slate-600 uppercase px-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#ccff00] text-blue-900 px-5 md:px-7 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 shadow-md shadow-blue-100"
              >
                Join<span className="hidden sm:inline"> Everest</span> →
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;