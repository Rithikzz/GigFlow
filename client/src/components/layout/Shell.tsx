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
  ChevronRight
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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads Pipeline', href: '/leads', icon: Layers },
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
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-lg object-cover ring-2 ring-brand-500/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-brand-600/20 flex items-center justify-center border border-brand-500/20">
                <UserIcon className="w-5 h-5 text-brand-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white truncate m-0 leading-tight">
                {user?.name || 'Alex Mercer'}
              </h2>
              <p className="text-xs text-dark-400 truncate mt-0.5">
                {user?.email || 'demo@gigflow.com'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all font-sans text-sm font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen relative z-10 px-6 py-6 md:px-10 md:py-8">
        {children}
      </main>
    </div>
  );
};
