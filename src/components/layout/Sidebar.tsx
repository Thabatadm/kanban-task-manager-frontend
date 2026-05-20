import { Link, useLocation } from 'react-router-dom'; 
import { LayoutDashboard, FolderKanban, Notebook, Calendar } from 'lucide-react'; 
import solImg from '../../assets/sun.png'; 
import lunaImg from '../../assets/moon.png';
import { useTheme } from '../../hooks/useTheme';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation(); 

  const menuItems = [
    { name: 'My Projects', icon: <FolderKanban size={20} />, path: '/projects' },
    { name: 'My Tasks', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'My Notes', icon: <Notebook size={20} />, path: '#' },
    { name: 'Calendar', icon: <Calendar size={20} />, path: '#' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-bg-main-dark border-r border-border-grid p-6 flex flex-col">
      <nav className="space-y-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path} 
              className={`flex items-center gap-4 p-3 rounded-2xl transition-all group ${
                isActive 
                  ? 'text-brand-accent bg-bg-card-dark border border-border-grid/50 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-bg-card-dark/40'
              }`}
            >
              <span className={isActive ? 'text-brand-accent' : 'group-hover:text-brand-accent transition-colors'}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav> 
      
      <div className="mt-auto pt-10 border-t border-border-grid/50">
        <div className="flex items-center justify-between px-2">
          <span className="text-terminal-sm font-weight-title text-slate-500 uppercase tracking-[0.2em]">
            Theme Mode
          </span>
          
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-sub-dark border border-border-grid hover:bg-bg-card-dark ring-brand-accent/50 transition-all active:scale-90 shadow-inner"
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