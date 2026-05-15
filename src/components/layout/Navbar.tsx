import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../hooks/useAuth'; 
import lunaImg from '../../assets/moon.png';
import solImg from '../../assets/sun.png'; 
import { useTheme } from '../../hooks/useTheme';
import { authService } from '../../services/authService';




const Navbar: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const logout =() => {
    authService.logout();
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-8 text-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-50 h-16 flex items-center justify-center">
          <img 
            src={logo} 
            alt="Kanban Flow Logo" 
            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
          />
        </div>
      </div>
      <div className="flex items-center gap-6">

        {!isLoggedIn && (
        <div className="flex items-center gap-3 pr-6 border-r border-slate-800">
          <span className="hidden sm:block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            Theme
          </span>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:ring-2 ring-amber-400/50 transition-all active:scale-90 shadow-lg"
            title="Switch System Theme"
          >
            {theme === 'light' ? (
              <img src={lunaImg} alt="dark" className="w-5 h-5 object-contain" />
            ) : (
              <img src={solImg} alt="light" className="w-5 h-5 object-contain" />
            )}
          </button>
        </div>
        )}

        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold hover:text-amber-400 transition-colors tracking-widest uppercase">
              Login
            </Link>
            <Link to="/register" className="bg-amber-400 text-black px-5 py-2 rounded-xl text-xs font-black uppercase hover:bg-amber-300 transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              Register
            </Link>
          </div>
        ) : (
        <>
        <div className="text-right hidden lg:block">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-none mb-1">Live System Time</p>
          <p className="text-sm font-mono text-amber-400 leading-none">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
        </div>
        <div className="relative flex items-center gap-4 border-l border-slate-800 pl-6">
          <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-4 group focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                {user?.name} {user?.lastName}
                </p>
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-tighter text-right">
                Online Account
                </p>
                </div>

                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform border border-indigo-400/20">
                {user?.name?.charAt(0).toUpperCase()}
                </div>
          </button>
          
          {isOpen && (
             <>
             <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                <div className="absolute right-0 top-full mt-3 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in duration-150">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors uppercase tracking-widest">
                    Profile
                  </button>
                  <div className="h-px bg-slate-800 mx-2 my-1"></div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-widest"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </>

)}
</div>
</header>
  );
};

export default Navbar;
