import { LayoutDashboard, FolderKanban, Notebook, Calendar } from 'lucide-react'; 
import solImg from '../../assets/sun.png'; 
import lunaImg from '../../assets/moon.png';
import { useTheme } from '../../hooks/useTheme';

const Sidebar = () => {
  const menuItems = [
    { name: 'My Projects', icon: <FolderKanban size={20}/> },
    { name: 'My Tasks', icon: <LayoutDashboard size={20}/> },
    { name: 'My Notes', icon: <Notebook size={20}/> },
    { name: 'Calendar', icon: <Calendar size={20}/> },
  ];
    const { theme, toggleTheme } = useTheme();

  return (
    <aside className="w-64 min-h-screen bg-slate-950 border-r border-slate-800 p-6 flex flex-col">
      <nav className="space-y-4">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className="flex items-center gap-4 text-slate-400 hover:text-white hover:bg-slate-900 p-3 rounded-2xl transition-all group"
          >
            <span className="group-hover:text-amber-400">{item.icon}</span>
            <span className="font-semibold text-sm">{item.name}</span>
          </a>
        ))}
      </nav> 
      <div className="mt-auto pt-10 border-t border-slate-800/50">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Theme Mode
          </span>
          
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 hover:ring-2 ring-amber-400/50 transition-all active:scale-90"
            title="Switch Theme"
          >
            {theme === 'light' ? (
              <img src={lunaImg} alt="dark" className="w-5 h-5 object-contain" />
            ) : (
              <img src={solImg} alt="light" className="w-5 h-5 object-contain" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

