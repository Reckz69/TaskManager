import { useEffect, useState, useMemo } from "react";
import { getTasks, createTask, deleteTask, toggleTask } from "../api/tasks.js";
import toast from "react-hot-toast";
import { Search as SearchIcon, X, Mountain, Check } from "lucide-react";
import debounce from "lodash.debounce";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadTasks = async () => {
    try {
      const res = await getTasks({ page: 1, limit: 10 });
      setTasks(res.data.data.tasks);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const fetchTasks = async (query = "") => {
    try {
      const res = await getTasks({ search: query, page: 1, limit: 10 });
      setTasks(res.data.data.tasks);
    } catch (err) {
      console.log(err);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        if (!value.trim()) {
          loadTasks();
        } else {
          fetchTasks(value);
        }
      }, 400),
    []
  );

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await createTask({ title });
    setTitle("");
    await loadTasks();
    setLoading(false);
    toast.success("Task added to your journey!");
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadTasks();
    toast.error("Task removed");
  };

  const handleToggle = async (id) => {
    await toggleTask(id);
    loadTasks();
  };

  const progress = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) 
    : 0;

  return (
    // 🧊 Mobile Fix: Added pb-32 to ensure bottom tasks aren't hidden by mobile nav bars
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f0f9ff] via-[#e0f2fe] to-[#f8fafc] pt-24 md:pt-32 pb-32 px-4 md:px-6 transition-all duration-700 selection:bg-blue-100">
      <div className="max-w-4xl mx-auto">

        {/* 🏔️ HEADER & UTILITIES */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="shrink-0">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter">
              My Journey<span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em] mt-1 ml-1">
               {tasks.filter(t => !t.completed).length} Peaks remaining
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            {/* 🔍 SEARCH: Touch-friendly pill */}
            <div className="relative group flex-1 md:flex-none">
              <div className={`
                flex items-center bg-white/40 backdrop-blur-xl border border-white/80 rounded-xl md:rounded-2xl transition-all duration-500 shadow-sm
                ${search ? "w-full md:w-64 px-4 py-2.5" : "w-11 h-11 md:w-12 md:h-12 justify-center"}
                focus-within:w-full md:focus-within:w-64 focus-within:px-4 focus-within:bg-white/80
                hover:bg-white/60
              `}>
                <SearchIcon className="text-blue-500 min-w-[18px]" size={18} strokeWidth={2.5} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  placeholder="Find a goal..."
                  className={`
                    bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 transition-all duration-300
                    ${search ? "ml-3 w-full opacity-100" : "w-0 opacity-0 group-hover:ml-3 group-hover:w-full group-hover:opacity-100"}
                  `}
                />
              </div>
            </div>

            {/* 📈 PROGRESS CARD */}
            <div className="bg-white/40 backdrop-blur-xl p-1.5 md:p-2 pr-4 md:pr-5 rounded-xl md:rounded-2xl border border-white/80 flex items-center gap-3 shadow-sm shrink-0">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
                 <span className="text-white font-black text-[9px] md:text-[10px]">{progress}%</span>
              </div>
              <div className="leading-none">
                <p className="text-[7px] md:text-[8px] uppercase font-black text-slate-400 tracking-widest mb-1">Status</p>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-700 uppercase">Climbing</p>
              </div>
            </div>
          </div>
        </header>

        {/* ➕ ADD TASK: Optimized for mobile keyboard pop-ups */}
        <form onSubmit={handleAdd} className="relative mb-12 md:mb-16 group">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Next peaceful move..."
            className="w-full bg-white/60 backdrop-blur-xl border-2 border-white/80 rounded-[1.5rem] md:rounded-[2.2rem] px-6 md:px-10 py-5 md:py-7 pr-32 md:pr-44 text-slate-800 font-bold shadow-xl shadow-blue-900/5 focus:border-blue-400 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 text-base md:text-lg"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 md:right-4 top-2 md:top-4 bottom-2 md:bottom-4 bg-blue-600 hover:bg-indigo-700 text-white px-5 md:px-10 rounded-xl md:rounded-[1.6rem] font-black text-[10px] md:text-xs tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
          >
            {loading ? "..." : "ADD"}
            <span className="text-[#ccff00] text-lg md:text-xl">+</span>
          </button>
        </form>

        {/* 📋 TASK LIST: Larger touch targets for mobile */}
        <div className="grid gap-3 md:gap-5">
          {tasks.length === 0 ? (
            <div className="text-center py-20 bg-white/30 backdrop-blur-sm rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-white/60">
               <p className="text-slate-400 font-bold italic px-4 text-sm md:text-base">The horizon is clear. Add a task to start your ascent.</p>
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t._id}
                className={`group flex items-center justify-between p-5 md:p-7 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-700 border-2 ${
                  t.completed 
                    ? "bg-white/10 border-transparent opacity-40 scale-[0.98]" 
                    : "bg-white/70 backdrop-blur-md border-white/80 shadow-sm hover:shadow-2xl hover:border-blue-200"
                } active:bg-white/90`}
              >
                <div className="flex items-center gap-4 md:gap-6 flex-1">
                  <button 
                    onClick={() => handleToggle(t._id)}
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-xl md:rounded-2xl flex items-center justify-center border-2 shrink-0 transition-all duration-500 ${
                      t.completed 
                        ? "bg-[#ccff00] border-[#ccff00] shadow-[0_0_20px_rgba(204,255,0,0.6)]" 
                        : "border-slate-200 bg-white"
                    } active:scale-90`}
                  >
                    {t.completed && <Check className="w-4 h-4 md:w-5 md:h-5 text-blue-900" strokeWidth={4} />}
                  </button>
                  <span className={`text-base md:text-xl font-bold tracking-tight transition-all duration-700 truncate ${t.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {t.title}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="p-2 md:p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-100 md:opacity-0 group-hover:opacity-100 active:scale-90"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;