import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { useAuth } from "../../hooks/useAuth";
import lunaImg from "../../assets/moon.png";
import solImg from "../../assets/sun.png";
import { useTheme } from "../../hooks/useTheme";
import { authService } from "../../services/authService";
import { FolderKanban, User, LogOut } from "lucide-react";

const Navbar: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const logout = () => {
    authService.logout();
  };

  return (
    <header className="h-16 border-b border-border-grid bg-bg-main-dark flex items-center justify-between px-4 sm:px-8 text-white sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-50 h-16 flex items-center justify-center">
          <img
            src={logo}
            alt="Kanban Flow Logo"
            className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
          />
        </div>
      </div>

      {/* --- Desktop Version --- */}
      <div className="hidden md:flex items-center gap-6">
        {!isLoggedIn && (
          <div className="flex items-center gap-3 pr-6 border-r border-border-grid">
            <span className="hidden sm:block text-terminal-sm font-weight-title text-slate-500 uppercase tracking-[0.2em]">
              Theme
            </span>
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-card-dark border border-border-grid hover:bg-slate-800 ring-brand-accent/50 transition-all active:scale-90 shadow-lg"
              title="Switch System Theme"
            >
              {theme === "light" ? (
                <img
                  src={lunaImg}
                  alt="dark"
                  className="w-5 h-5 object-contain"
                />
              ) : (
                <img
                  src={solImg}
                  alt="light"
                  className="w-5 h-5 object-contain"
                />
              )}
            </button>
          </div>
        )}

        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-bold hover:text-brand-accent transition-colors tracking-widest uppercase"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-brand-accent text-black px-5 py-2 rounded-xl text-xs font-black uppercase hover:bg-brand-accent-hover transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]"
            >
              Register
            </Link>
          </div>
        ) : (
          <>
            <div className="text-right hidden lg:block">
              <p className="text-terminal-sm text-text-grey font-weight-title uppercase tracking-[0.2em] leading-none mb-1">
                Live System Time
              </p>
              <p className="text-subtitle font-terminal text-brand-accent leading-none">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
            <div className="relative flex items-center gap-4 border-l border-border-grid pl-6">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-4 group focus:outline-none"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-200 group-hover:text-brand-accent transition-colors">
                    {user?.name} {user?.lastName}
                  </p>
                  <p className="text-terminal-sm text-indigo-400 font-weight-title uppercase tracking-tighter text-right">
                    Online Account
                  </p>
                </div>

                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform border border-indigo-400/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </button>

              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  ></div>
                  <div className="absolute right-0 top-full mt-3 w-48 bg-bg-card-dark border border-border-grid rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in duration-150">
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-bg-sub-dark hover:text-white transition-colors uppercase tracking-widest"
                    >
                      <User
                        size={20}
                        className="text-slate-400 group-hover:text-brand-accent transition-colors"
                      />
                      <span>Profile</span>
                    </Link>
                    <div className="h-px bg-border-grid mx-2 my-1"></div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-widest text-left"
                    >
                      <LogOut
                        size={20}
                        className="text-red-400/80 group-hover:text-red-400 transition-colors"
                      />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* --- Mobil Version --- */}
      <div className="flex md:hidden items-center gap-3 sm:gap-4">
        {isLoggedIn && (
          <div className="text-right pr-2 border-r border-border-grid/50">
            <p className="text-[11px] font-terminal text-brand-accent leading-none">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
        )}
        {!isLoggedIn && (
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-card-dark border border-border-grid active:scale-90 transition-transform"
            title="Switch System Theme"
          >
            {theme === "light" ? (
              <img
                src={lunaImg}
                alt="dark"
                className="w-4 h-4 object-contain"
              />
            ) : (
              <img
                src={solImg}
                alt="light"
                className="w-4 h-4 object-contain"
              />
            )}
          </button>
        )}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none p-1.5"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-20 right-4 w-72 bg-bg-main-dark border border-border-grid px-5 py-4 flex flex-col gap-4 md:hidden z-40 rounded-2xl shadow-2xl shadow-black/50 animate-in fade-in zoom-in-95 duration-200">
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3 w-full">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center py-3 text-sm font-bold border border-border-grid rounded-xl hover:text-brand-accent transition-colors uppercase tracking-widest"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center bg-brand-accent text-black py-3 rounded-xl text-xs font-black uppercase hover:bg-brand-accent-hover transition-all"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <div className="items-center mb-4">
                    <p className="text-sm font-bold text-slate-200">
                      {user?.name} {user?.lastName}
                    </p>
                    <p className="text-xs text-indigo-400 uppercase tracking-wider">
                      Online Account
                    </p>
                  </div>

                  <Link
                    to="/projects"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-bg-sub-dark hover:text-white transition-colors uppercase tracking-widest"
                  >
                    <FolderKanban
                      size={20}
                      className="text-slate-400 group-hover:text-brand-accent transition-colors"
                    />
                    <span>My projects</span>
                  </Link>

                  <div className="h-px bg-border-grid mx-2 my-1"></div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-bg-sub-dark hover:text-white transition-colors uppercase tracking-widest"
                  >
                    <User
                      size={20}
                      className="text-slate-400 group-hover:text-brand-accent transition-colors"
                    />
                    <span>Profile</span>
                  </Link>
                  <div className="h-px bg-border-grid mx-2 my-1"></div>

                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-widest text-left"
                  >
                    <LogOut
                      size={20}
                      className="text-red-400/80 group-hover:text-red-400 transition-colors"
                    />
                    <span>Logout</span>
                  </button>
                  <div className="h-px bg-border-grid mx-2 my-1"></div>

                  <div className="flex items-center justify-between mt-4 px-2">
                    <span className="text-terminal-sm font-weight-title text-slate-500 uppercase tracking-[0.2em]">
                      Theme Mode
                    </span>

                    <button
                      onClick={toggleTheme}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-sub-dark border border-border-grid hover:bg-bg-card-dark ring-brand-accent/50 transition-all active:scale-90 shadow-inner"
                      title="Switch Theme"
                    >
                      {theme === "light" ? (
                        <img
                          src={lunaImg}
                          alt="dark"
                          className="w-5 h-5 object-contain"
                        />
                      ) : (
                        <img
                          src={solImg}
                          alt="light"
                          className="w-5 h-5 object-contain"
                        />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
