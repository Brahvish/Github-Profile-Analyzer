import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Sun, Moon, Menu, X, BarChart2, Users, Bookmark, Info } from 'lucide-react';
import { useStore } from '@/store/useStore';

const navLinks = [
  { path: '/analyze', label: 'Analyze', icon: BarChart2 },
  { path: '/compare', label: 'Compare', icon: Users },
  { path: '/saved', label: 'Saved', icon: Bookmark },
  { path: '/about', label: 'About', icon: Info },
];

export function Navbar() {
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

            <Link
              to="/analyze"
              className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-[10px] bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
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
