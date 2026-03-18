import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Lock, Mail, Loader2, ArrowRight, Mountain, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await loginUser({ email, password });
      const userData = res.data?.data?.user || res.data?.user || res.data;
      login(userData);
      toast.success(`Welcome back to the peak, ${userData.username || 'Climber'}!`);
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Check your gear and try again.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 🧊 CRYSTAL AZURE BG: Optimized for mobile Safar/Chrome
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f0f9ff] via-[#e0f2fe] to-[#f8fafc] px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] relative font-sans overflow-hidden">
      
      {/* --- ENERGY AMBIANCE --- */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#ccff00]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[440px] z-10">
        
        {/* --- BRANDING --- */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200/50 mb-6 rotate-3 active:scale-90 transition-transform">
            <Mountain className="text-[#ccff00] w-9 h-9" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">
            Everest<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 text-[10px] tracking-[0.4em] uppercase mt-2 font-bold italic">Resume your climb</p>
        </div>

        {/* --- LOGIN CARD: Glassy Blue Aesthetic --- */}
        <div className="bg-white/60 backdrop-blur-2xl [-webkit-backdrop-blur:30px] rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/80 transition-all">
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
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white text-slate-800 font-bold transition-all text-base shadow-inner placeholder:text-slate-300"
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
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white text-slate-800 font-bold transition-all text-base shadow-inner"
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
              <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
              
              <div className="relative w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 overflow-hidden shadow-lg shadow-blue-200 active:scale-95">
                {isSubmitting ? (
                  <Loader2 className="animate-spin text-[#ccff00]" size={22} />
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs">Start Climbing</span>
                    <ArrowRight size={20} className="text-[#ccff00] group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* SIGNUP LINK */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-[11px] text-slate-400 font-black uppercase tracking-wider">
                New to the team? 
                <Link to="/register" className="text-blue-600 hover:text-blue-800 transition-colors ml-2 decoration-2 underline-offset-4 hover:underline">
                  Join Everest
                </Link>
             </p>
          </div>
        </div>

        {/* --- TRUST BADGE --- */}
        <div className="mt-12 flex justify-center items-center gap-3 text-slate-300 opacity-60 cursor-default">
           <ShieldCheck size={18} />
           <span className="text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Session Secure</span>
        </div>
      </div>
    </div>
  );
};

export default Login;