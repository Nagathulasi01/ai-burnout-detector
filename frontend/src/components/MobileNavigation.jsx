import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Zap, Settings, Menu, X, Home as HomeIcon } from 'lucide-react';

/**
 * Mobile Bottom Navigation for PWA
 * Provides quick access to main sections on mobile devices
 */
export default function MobileNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Hide navigation on login page
  const isLoginPage = location.pathname === '/';
  if (isLoginPage) return null;

  const navItems = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/assessment', label: 'Assessment', icon: Zap },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/reminders', label: 'Reminders', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-colors ${
                isActive(item.path)
                  ? 'text-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={item.label}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Menu Button (shown on desktop as well for consistency) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/50"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Menu Dropdown */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-xl backdrop-blur-xl overflow-hidden">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Safe area padding on mobile with notch support */}
      <style>{`
        @supports (padding: max(0px)) {
          nav {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
}
