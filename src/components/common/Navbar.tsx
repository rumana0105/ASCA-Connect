import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  LogIn, 
  LogOut, 
  FlaskConical,
  Package,
  Building2,
  ShieldCheck,
  Menu,
  X,
  Sparkles,
  Cpu
} from 'lucide-react';
import { AppRoute } from '../../App';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute | string) => void;
  onOpenRoleModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentRoute, 
  onNavigate, 
  onOpenRoleModal 
}) => {
  const { currentUser, currentRole, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('/');
  };

  const handleNavScroll = (id: string) => {
    if (currentRoute !== '/') {
      onNavigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Academic & Research Notification Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
              MCA RESEARCH PROJECT
            </span>
            <span className="hidden sm:inline text-stone-400">
              Adaptive Shortfall Credit Allocation (ASCA) for Fair Sequential Donation Distribution
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Link to Algorithm & Pseudocode */}
            <button
              id="topbar-algorithms"
              onClick={() => onNavigate('/algorithms')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                currentRoute === '/algorithms'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
              }`}
            >
              <Cpu className="w-3 h-3 text-emerald-400" />
              <span>Algorithm & Pseudocode</span>
            </button>

            {/* Direct Link to Academic Research Lab */}
            <button
              onClick={() => onNavigate('/research-lab')}
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                currentRoute === '/research-lab'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:text-white border border-stone-700'
              }`}
            >
              <FlaskConical className="w-3 h-3 text-emerald-400" />
              <span>ASCA Research Lab</span>
            </button>

            {/* Quick Portal Switchers */}
            <div className="hidden md:flex items-center gap-1 pl-2 border-l border-stone-800">
              <span className="text-[10px] text-stone-500 uppercase font-mono mr-1">Portals:</span>
              <button
                onClick={() => onNavigate('/donor/login')}
                className="text-[11px] text-stone-400 hover:text-emerald-300 hover:underline px-1"
              >
                Donor
              </button>
              <span className="text-stone-700">·</span>
              <button
                onClick={() => onNavigate('/ngo/login')}
                className="text-[11px] text-stone-400 hover:text-blue-300 hover:underline px-1"
              >
                NGO
              </button>
              <span className="text-stone-700">·</span>
              <button
                onClick={() => onNavigate('/admin/login')}
                className="text-[11px] text-stone-400 hover:text-amber-300 hover:underline px-1"
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('/')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-700 to-teal-850 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform bg-emerald-800">
              <HeartHandshake className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-stone-900">ASCA</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-medium border border-emerald-200">
                  Fair Impact
                </span>
              </div>
              <p className="text-[11px] text-stone-500 tracking-wide font-normal -mt-0.5">
                Sequential donation allocation
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-home"
              onClick={() => onNavigate('/')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentRoute === '/'
                  ? 'bg-stone-200/70 text-stone-900 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              Home
            </button>

            <button
              id="nav-why-we-connect"
              onClick={() => handleNavScroll('human-story')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Why We Connect
            </button>

            <button
              id="nav-fairness"
              onClick={() => handleNavScroll('why-fairness')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Fairness in Distribution
            </button>

            <button
              id="nav-how-it-works"
              onClick={() => handleNavScroll('how-it-works')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              How It Works
            </button>

            <button
              id="nav-impact"
              onClick={() => handleNavScroll('impact-metrics')}
              className="px-3 py-2 rounded-lg text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Impact
            </button>

            <button
              id="nav-algorithms"
              onClick={() => onNavigate('/algorithms')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentRoute === '/algorithms'
                  ? 'bg-stone-900 text-emerald-400 font-semibold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Algorithm & Pseudocode</span>
            </button>

            <button
              id="nav-research-lab"
              onClick={() => onNavigate('/research-lab')}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentRoute === '/research-lab'
                  ? 'bg-stone-900 text-emerald-400 font-semibold shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              <span>Research Lab</span>
            </button>

            {/* If Authenticated: Link to Active Dashboard */}
            {currentUser && currentRole === 'donor' && (
              <button
                id="nav-donor-dash"
                onClick={() => onNavigate('/donor/dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentRoute === '/donor/dashboard'
                    ? 'bg-emerald-100 text-emerald-900 font-semibold border border-emerald-300'
                    : 'text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                <Package className="w-4 h-4 text-emerald-600" />
                <span>My Donor Space</span>
              </button>
            )}

            {currentUser && currentRole === 'ngo' && (
              <button
                id="nav-ngo-dash"
                onClick={() => onNavigate('/ngo/dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentRoute === '/ngo/dashboard'
                    ? 'bg-blue-100 text-blue-900 font-semibold border border-blue-300'
                    : 'text-blue-800 hover:bg-blue-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>NGO Space</span>
              </button>
            )}

            {currentUser && currentRole === 'admin' && (
              <button
                id="nav-admin-dash"
                onClick={() => onNavigate('/admin/dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  currentRoute === '/admin/dashboard'
                    ? 'bg-amber-100 text-amber-950 font-semibold border border-amber-300'
                    : 'text-amber-900 hover:bg-amber-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin Operations</span>
              </button>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* User Identity Chip */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-left">
                  <div className="w-7 h-7 rounded-full bg-stone-300 flex items-center justify-center text-xs font-bold text-stone-700 overflow-hidden shrink-0">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900 leading-none">{currentUser.name}</p>
                    <p className="text-[10px] text-stone-500 uppercase tracking-wider font-mono-code leading-none mt-1">
                      {currentUser.role}
                    </p>
                  </div>
                </div>

                {/* Clear Sign Out Button */}
                <button
                  id="btn-nav-logout"
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-red-700 hover:bg-red-50 border border-stone-200 hover:border-red-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Sign In Button */}
                <button
                  id="btn-nav-signin"
                  onClick={onOpenRoleModal}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5 cursor-pointer border border-transparent hover:border-stone-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>

                {/* Donate Now CTA */}
                <button
                  id="btn-nav-donate-cta"
                  onClick={() => onNavigate('/donor/login')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>Donate Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-200 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { onNavigate('/'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('/algorithms'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 hover:bg-emerald-50 flex items-center gap-2"
          >
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>Algorithm & Pseudocode</span>
          </button>
          <button
            onClick={() => { onNavigate('/research-lab'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 hover:bg-emerald-50 flex items-center gap-2"
          >
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            <span>ASCA Research Lab</span>
          </button>
          
          {currentUser ? (
            <>
              {currentRole === 'donor' && (
                <button
                  onClick={() => { onNavigate('/donor/dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  My Donor Space
                </button>
              )}
              {currentRole === 'ngo' && (
                <button
                  onClick={() => { onNavigate('/ngo/dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-blue-800 hover:bg-blue-50"
                >
                  NGO Space
                </button>
              )}
              {currentRole === 'admin' && (
                <button
                  onClick={() => { onNavigate('/admin/dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-amber-900 hover:bg-amber-50"
                >
                  Admin Operations
                </button>
              )}
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Sign Out ({currentUser.name})
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-stone-200 space-y-2">
              <button
                onClick={() => { onNavigate('/donor/login'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 hover:bg-emerald-50"
              >
                Donor Sign In
              </button>
              <button
                onClick={() => { onNavigate('/ngo/login'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-blue-800 hover:bg-blue-50"
              >
                NGO Partner Sign In
              </button>
              <button
                onClick={() => { onNavigate('/admin/login'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-100"
              >
                Admin Sign In
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
