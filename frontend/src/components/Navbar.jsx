import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { logoutUser } from "../api/auth.js";
import { Mountain } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth(); // Keeping your exact context logic
  const navigate = useNavigate();
  const location = useLocation();
  

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout API failed (expected sometimes)");
    }
  
    // Always clear local session
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  
    logout(); 
    toast.success("Refreshing break! See you soon.");
    navigate("/login");
  };
  
  const isActive = (path) => location.pathname === path;

  // ... (Imports and logout logic stay the same)

return (
    <nav className="fixed top-0 left-0 w-full bg-blue backdrop-blur-3xl z-50 transition-all duration-700 border-b border-white/20">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
        
        {/* 🏔️ Everest Logo: Brighter Blue & Volt Green */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200/40 group-hover:scale-110 transition-all">
            <Mountain className="text-[#ccff00] w-7 h-7" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-slate-100 uppercase">
              EVEREST<span className="text-blue-500">.</span>
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-[0.4em] uppercase">
              Peak Focus
            </span>
          </div>
        </Link>
  
        <div className="flex items-center gap-8">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`text-[11px] font-black uppercase tracking-widest px-6 py-2.5 rounded-2xl transition-all ${
                  isActive("/dashboard") 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-200" 
                    : "text-slate-500 hover:text-blue-600 hover:bg-white/40"
                }`}
              >
                My Journey
              </Link>
  
{/* --- UPDATED SIGN OUT BUTTON --- */}
                <button
                onClick={handleLogout}
                className="group flex items-center gap-3 px-5 py-2.5 bg-blue-500 text-white shadow-lg shadow-blue-200 backdrop-blur-md border  rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 hover:text-rose-500 transition-all duration-300  active:scale-95 ml-4"
                >
                {/* Power/Exit Icon that pops on hover */}
                <svg 
                    className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                
                <span>Sign Out</span>
                </button>
            </>
          ) : (
            <Link
              to="/register"
              className="bg-[#ccff00] text-blue-900 px-7 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-105 shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              Join Everest →
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;