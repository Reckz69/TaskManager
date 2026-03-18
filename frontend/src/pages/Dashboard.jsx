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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#f0f9ff] via-[#e0f2fe] to-[#f8fafc] pt-28 pb-12 px-6 transition-all duration-700">
      <div className="max-w-4xl mx-auto">

        {/* 🏔️ HEADER & UTILITIES */}
        <header className="mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">
              My Journey<span className="text-blue-600">.</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-1 ml-1">
               {tasks.filter(t => !t.completed).length} Peaks remaining
            </p>
          </div>

          {/* 🛠️ Utilities: Search & Stats Grouped */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            
            {/* 🔍 SEARCH: Sleek Expanding Pill */}
            <div className="relative group">
              <div className={`
                flex items-center bg-white/40 backdrop-blur-xl border border-white/80 rounded-2xl transition-all duration-500 shadow-sm
                ${search ? "w-64 px-4 py-2.5" : "w-12 h-12 justify-center"}
                focus-within:w-64 focus-within:px-4 focus-within:bg-white/80 focus-within:border-blue-200
                hover:w-64 hover:px-4
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
                    bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-400 transition-all duration-300
                    ${search ? "ml-3 w-full opacity-100" : "w-0 opacity-0 focus:ml-3 focus:w-full focus:opacity-100 group-hover:ml-3 group-hover:w-full group-hover:opacity-100"}
                  `}
                />
                {search && (
                  <button onClick={() => { setSearch(""); loadTasks(); }} className="ml-2 text-rose-400 hover:scale-110 transition-transform">
                    <X size={14} strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>

            {/* 📈 PROGRESS CARD */}
            <div className="bg-white/40 backdrop-blur-xl p-2 pr-5 rounded-2xl border border-white/80 flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50">
                 <span className="text-white font-black text-[10px]">{progress}%</span>
              </div>
              <div className="hidden sm:block leading-none">
                <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest mb-1">Status</p>
                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-tighter">Climbing</p>
              </div>
            </div>
          </div>
        </header>

        {/* ➕ ADD TASK: High-Contrast Glass Input */}
        <form onSubmit={handleAdd} className="relative mb-16 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-300 rounded-[2.2rem] blur-xl opacity-0 group-focus-within:opacity-10 transition-opacity" />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Plan your next peaceful move..."
            className="w-full bg-white/60 backdrop-blur-xl border-2 border-white/80 rounded-[2.2rem] px-10 py-7 pr-44 text-slate-800 font-bold shadow-2xl shadow-blue-900/5 focus:border-blue-400 focus:bg-white focus:outline-none transition-all placeholder:text-slate-300 text-lg"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-4 top-4 bottom-4 bg-blue-600 hover:bg-indigo-700 text-white px-10 rounded-[1.6rem] font-black text-xs tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
          >
            {loading ? "..." : "ADD TASK"}
            <span className="text-[#ccff00] text-xl">+</span>
          </button>
        </form>

        {/* 📋 TASK LIST */}
        <div className="grid gap-5">
          {tasks.length === 0 ? (
            <div className="text-center py-24 bg-white/30 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-white/60">
               <p className="text-slate-400 font-bold italic">The horizon is clear. Add a task to start your ascent.</p>
            </div>
          ) : (
            tasks.map((t) => (
              <div
                key={t._id}
                className={`group flex items-center justify-between p-7 rounded-[2.5rem] transition-all duration-700 border-2 ${
                  t.completed 
                    ? "bg-white/10 border-transparent opacity-40 scale-[0.98]" 
                    : "bg-white/70 backdrop-blur-md border-white/80 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1 hover:border-blue-200"
                }`}
              >
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => handleToggle(t._id)}
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${
                      t.completed 
                        ? "bg-[#ccff00] border-[#ccff00] shadow-[0_0_25px_rgba(204,255,0,0.6)]" 
                        : "border-slate-200 bg-white hover:border-blue-400 shadow-inner"
                    }`}
                  >
                    {t.completed && <Check className="w-5 h-5 text-blue-900" strokeWidth={4} />}
                  </button>
                  <span className={`text-xl font-bold tracking-tight transition-all duration-700 ${t.completed ? "line-through text-slate-400" : "text-slate-800"}`}>
                    {t.title}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={22} strokeWidth={2.5} />
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