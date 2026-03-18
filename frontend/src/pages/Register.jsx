import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/auth.js";
import { 
  Mail, Lock, User, AtSign,
  Loader2, ArrowRight, 
  ShieldCheck, Mountain
} from "lucide-react";
import toast from "react-hot-toast";

const Register = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ fullName: "", username: "", email: "", password: "" });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
      
        try {
          await registerUser({
            fullName: formData.fullName,
            username: formData.username,
            email: formData.email,
            password: formData.password,
          });
      
          toast.success("Welcome to the team!");
          navigate("/login");
      
        } catch (err) {
          toast.error(err.response?.data?.message || "Registration failed.");
        } finally {
          setIsSubmitting(false);
        }
      };

  return (
    // 🧊 Mobile-Optimized Container with Safe Areas
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f0f9ff] via-[#e0f2fe] to-[#f8fafc] flex items-center justify-center px-4 pt-[env(safe-area-inset-top)] pb-12 relative overflow-hidden font-sans">
      
      {/* --- ENERGY AMBIANCE --- */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#ccff00]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[500px] z-10 relative">
        
        {/* --- BRAND HEADER --- */}
        <div className="flex flex-col items-center mb-8 md:mb-10">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-200/50 mb-6 -rotate-3 active:scale-90 transition-transform">
            <Mountain className="text-[#ccff00] w-8 h-8 md:w-9 md:h-9" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-800 uppercase text-center">
            Join Everest<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 text-[9px] md:text-[10px] tracking-[0.4em] uppercase mt-2 font-bold text-center italic">
            Focus like still water. Start your climb.
          </p>
        </div>

        {/* --- REGISTER CARD: FAINT BLUE GLASS --- */}
        <div className="bg-white/60 backdrop-blur-2xl [-webkit-backdrop-blur:30px] rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white/80 relative">
          
          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            
            {/* --- INPUT GRID (Responsive columns) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <EverestInput 
                label="Full Name" 
                placeholder="Narendra M." 
                icon={<User size={18}/>} 
                onChange={(val) => setFormData({...formData, fullName: val})} 
              />
              
              <EverestInput 
                label="Username" 
                placeholder="narendra_01" 
                icon={<AtSign size={18}/>} 
                onChange={(val) => setFormData({...formData, username: val})} 
              />
            </div>

            <EverestInput 
              label="Email Address" 
              placeholder="climber@everest.com" 
              icon={<Mail size={18}/>} 
              type="email" 
              onChange={(val) => setFormData({...formData, email: val})} 
            />
            <EverestInput 
              label="Secure Password" 
              placeholder="••••••••" 
              icon={<Lock size={18}/>} 
              type="password" 
              onChange={(val) => setFormData({...formData, password: val})} 
            />

            {/* --- SUBMIT BUTTON --- */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group mt-4 md:mt-6"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-100 active:scale-95">
                {isSubmitting ? (
                  <Loader2 className="animate-spin text-[#ccff00]" size={22} />
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-[10px] md:text-xs">Begin the Journey</span>
                    <ArrowRight size={20} className="text-[#ccff00] group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* --- FOOTER --- */}
          <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] md:text-[11px] text-slate-400 font-black uppercase tracking-wider">
              Already part of the team? 
              <Link to="/login" className="text-blue-600 hover:text-blue-800 transition-colors ml-2 decoration-2 underline-offset-4 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* --- SECURITY FOOTER --- */}
        <div className="mt-8 md:mt-10 flex justify-center items-center gap-3 text-slate-300 opacity-60">
           <ShieldCheck size={18} />
           <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Privacy-First Peak Security</span>
        </div>
      </div>
    </div>
  );
};

/* --- EVEREST BRANDED INPUT: LIGHT GLASS STYLE (Responsive Fonts) --- */
const EverestInput = ({ label, placeholder, icon, type = "text", onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        // 16px (text-base) prevents iOS auto-zoom on focus
        className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-blue-400 focus:bg-white text-slate-800 font-bold transition-all text-base md:text-sm shadow-inner placeholder:text-slate-300"
        required
      />
    </div>
  </div>
);

export default Register;