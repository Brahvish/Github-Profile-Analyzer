import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Sun, Moon, Menu, X, BarChart2, Users, Bookmark, Info, LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';

const navLinks = [
  { path: '/analyze', label: 'Analyze', icon: BarChart2 },
  { path: '/compare', label: 'Compare', icon: Users },
  { path: '/saved', label: 'Saved', icon: Bookmark },
  { path: '/about', label: 'About', icon: Info },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode, authUser, logout } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080A0F]/85 backdrop-blur-[12px] border-b border-white/[0.06] shadow-card'
          : 'bg-transparent'
      }`}
    >
      {/* Thin 1px top accent line in brand gradient color */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#7C6FFF] to-[#38BDF8]" />
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
              <GitBranch className="w-4 h-4 text-accent" />
            </div>
            <span className="font-semibold text-ink tracking-tight">
              Git<span className="text-accent">Insight</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => {
              const active = location.pathname.startsWith(path);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-accent/10 text-accent'
                      : 'text-ink-muted hover:text-ink hover:bg-white/5'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-white/5 transition-all"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {authUser ? (
              <div className="relative">
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-accent/30 hover:bg-white/[0.07] transition-all"
                >
                  {authUser.photoURL ? (
                    <img
                      src={authUser.photoURL}
                      alt={authUser.displayName || 'User'}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent/30 flex items-center justify-center">
                      <User className="w-3 h-3 text-accent" />
                    </div>
                  )}
                  <span className="hidden md:block text-xs text-slate-300 font-medium max-w-[100px] truncate">
                    {authUser.githubUsername || authUser.displayName || authUser.email?.split('@')[0] || 'Account'}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0E1118]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-xs font-semibold text-white truncate">
                          {authUser.displayName || authUser.email || 'User'}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {authUser.githubUsername ? `@${authUser.githubUsername}` : authUser.email}
                        </p>
                      </div>
                      <div className="p-1.5 flex flex-col gap-0.5">
                        {authUser.provider === 'github' && authUser.githubUsername && (
                          <button
                            id="view-my-profile-btn"
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate(`/report/${authUser.githubUsername}`);
                            }}
                            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all text-left"
                          >
                            <User className="w-3.5 h-3.5 text-accent" />
                            View my profile analysis
                          </button>
                        )}
                        <button
                          id="logout-btn"
                          onClick={async () => {
                            setUserMenuOpen(false);
                            await logout();
                          }}
                          className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-red-400 hover:bg-red-500/[0.08] transition-all text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                id="login-nav-btn"
                className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-[10px] bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              to="/analyze"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-[10px] border border-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.05] transition-colors"
            >
              Analyze Profile
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink hover:bg-white/5 transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-[#080A0F]/95 backdrop-blur-xl"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => {
                const active = location.pathname.startsWith(path);
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-accent/10 text-accent'
                        : 'text-ink-muted hover:text-ink hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
