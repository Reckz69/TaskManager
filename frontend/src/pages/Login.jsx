import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.js"; // Ensure your API helper is updated
import { useAuth } from "../context/AuthContext.jsx";
import { Lock, Mail, Loader2, ArrowRight, Mountain, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth(); // Using the login function from your AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 1. Functional API Call
      const res = await loginUser({ email, password });
      
      // 2. Extracting User Data (Adapting to common MERN structures)
      const userData = res.data?.data?.user || res.data?.user || res.data;
      
      // 3. Update Global Auth State
      login(userData);
      
      // 4. Feedback & Navigation
      toast.success(`Welcome back to the peak, ${userData.username || 'Climber'}!`);
      navigate("/dashboard");
    } catch (err) {
      // Functional Error Handling
      const errorMsg = err.response?.data?.message || "Check your gear and try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative font-sans overflow-hidden">
      
      {/* --- ENERGY AMBIANCE (Happy Blue/Green Orbs) --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#ccff00]/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-[440px] z-10">
        
        {/* --- BRANDING: EVEREST --- */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 rotate-3">
            {/* Volt Green Icon for High Contrast */}
            <Mountain className="text-[#ccff00] w-9 h-9" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Everest<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase mt-2 font-bold">Resume your climb</p>
        </div>

        {/* --- LOGIN CARD --- */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* EMAIL INPUT */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Climber Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@everest.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-bold transition-all text-sm shadow-inner"
                  required
                />
              </div>
            </div>

            {/* PASSWORD INPUT */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Secure Key</label>
                <Link to="/forgot" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot Key?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-bold transition-all text-sm shadow-inner"
                  required
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group mt-4"
            >
              {/* Pulsing Glow behind the button */}
              <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              
              <div className="relative w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-blue-200 active:scale-95">
                {isSubmitting ? (
                  <Loader2 className="animate-spin text-[#ccff00]" size={22} />
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-sm">Start Climbing</span>
                    <ArrowRight size={20} className="text-[#ccff00] group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* SIGNUP LINK */}
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
             <p className="text-[11px] text-slate-400 font-black uppercase tracking-wider">
                New to the team? 
                <Link to="/register" className="text-blue-600 hover:text-blue-800 transition-colors ml-2 decoration-2 underline-offset-4 hover:underline">
                  Join Everest
                </Link>
             </p>
          </div>
        </div>

        {/* --- TRUST BADGE --- */}
        <div className="mt-12 flex justify-center items-center gap-3 text-slate-400 group cursor-default">
           <ShieldCheck size={18} className="group-hover:text-blue-500 transition-colors" />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Session Secure</span>
        </div>
      </div>
    </div>
  );
};

export default Login;