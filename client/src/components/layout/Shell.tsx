import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  LogOut, 
  Menu, 
  X, 
  TrendingUp, 
  User as UserIcon,
  ChevronRight,
  BriefcaseBusiness,
  Sun,
  Moon
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('gigflow_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // default to dark
  });

  React.useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem('gigflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', href: '/leads', icon: Layers },
  ];

  const handleLogout = () => {
    clearAuth();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row relative">
      {/* Background radial glows */}
      <div className="bg-glow-purple top-10 left-10" />
      <div className="bg-glow-cyan bottom-10 right-10" />

      {/* Mobile Navbar Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-dark-900/60 backdrop-blur-md border-b border-white/5 z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-lg text-white tracking-wide">
            Gig<span className="text-brand-400">Flow</span>
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-dark-300 hover:text-white transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Desktop & Mobile Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-dark-900/60 backdrop-blur-xl border-r border-white/5 flex flex-col z-40 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        md:translate-x-0 md:static md:h-screen
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Logo Info */}
        <div className="hidden md:flex items-center gap-3 px-8 py-8 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-brand-500/25">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl text-white tracking-wide m-0 leading-none">
              Gig<span className="text-brand-400">Flow</span>
            </h1>
            <p className="text-xs text-dark-400 mt-1 font-sans">Smart Leads CRM</p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                  ${active 
                    ? 'bg-brand-600/15 border-l-4 border-brand-500 text-white font-medium shadow-inner shadow-brand-500/5' 
                    : 'text-dark-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${active ? 'text-brand-400' : 'text-dark-400 group-hover:text-white'}`} />
                  <span className="text-sm font-sans">{item.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'}`} />
              </Link>
            );
          })}
        </nav>

        {/* User Card Profile & Sign Out */}
        <div className="p-4 border-t border-white/5 bg-dark-950/40">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5 mb-3">
            <div className="w-10 h-10 rounded-lg bg-brand-600/20 flex items-center justify-center border border-brand-500/20">
              <UserIcon className="w-5 h-5 text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white truncate m-0 leading-tight">
                {user?.name || 'GigFlow User'}
              </h2>
              <p className="text-xs text-dark-400 truncate mt-0.5">
                {user?.email || 'user@gigflow.com'}
              </p>
              <p className="text-[11px] mt-1 inline-flex items-center gap-1 text-brand-300">
                <BriefcaseBusiness className="w-3 h-3" />
                Role: {user?.role ?? 'SALES'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-sans text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen relative z-10">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-dark-950/80 px-6 py-4 backdrop-blur-md md:px-10">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-dark-400">Smart Leads Dashboard</p>
              <h2 className="text-lg font-semibold text-white">GigFlow CRM</h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle Control */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-dark-300 hover:text-white hover:bg-white/10 active:scale-95 transition-all shadow-md flex items-center justify-center cursor-pointer"
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-brand-600" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <UserIcon className="h-4 w-4 text-brand-300" />
                <div className="text-right">
                  <p className="text-xs text-white">{user?.name ?? 'User'}</p>
                  <p className="text-[11px] text-dark-300">{user?.role ?? 'SALES'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-rose-500/20 px-2 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/30"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        <section className="px-6 py-6 md:px-10 md:py-8">
        {children}
        </section>
      </main>
    </div>
  );
};
