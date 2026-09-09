import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/public/LandingPage';
import { DonorDashboard } from './components/donor/DonorDashboard';
import { NgoDashboard } from './components/ngo/NgoDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ResearchLab } from './components/research/ResearchLab';
import { DonorLogin } from './components/auth/DonorLogin';
import { NgoLogin } from './components/auth/NgoLogin';
import { AdminLogin } from './components/auth/AdminLogin';
import { RoleSelectModal } from './components/auth/RoleSelectModal';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export type AppRoute = 
  | '/' 
  | '/donor/login' 
  | '/ngo/login' 
  | '/admin/login' 
  | '/donor/dashboard' 
  | '/ngo/dashboard' 
  | '/admin/dashboard' 
  | '/research-lab';

const MainLayout: React.FC = () => {
  const { currentRole, currentUser } = useApp();
  
  // Track route state - strictly defaults to '/' (Landing Page)
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const path = window.location.pathname;
    const validRoutes: AppRoute[] = [
      '/',
      '/donor/login',
      '/ngo/login',
      '/admin/login',
      '/donor/dashboard',
      '/ngo/dashboard',
      '/admin/dashboard',
      '/research-lab'
    ];
    if (validRoutes.includes(path as AppRoute)) {
      return path as AppRoute;
    }
    return '/';
  });

  const [roleModalOpen, setRoleModalOpen] = useState(false);

  // Sync state with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as AppRoute;
      const validRoutes: AppRoute[] = [
        '/',
        '/donor/login',
        '/ngo/login',
        '/admin/login',
        '/donor/dashboard',
        '/ngo/dashboard',
        '/admin/dashboard',
        '/research-lab'
      ];
      if (validRoutes.includes(path)) {
        setCurrentRoute(path);
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Safe navigation helper
  const navigate = (path: string) => {
    let targetRoute: AppRoute = '/';
    if (path === '/' || path === 'home') targetRoute = '/';
    else if (path === '/donor/login' || path === 'donor-login') targetRoute = '/donor/login';
    else if (path === '/ngo/login' || path === 'ngo-login') targetRoute = '/ngo/login';
    else if (path === '/admin/login' || path === 'admin-login') targetRoute = '/admin/login';
    else if (path === '/donor/dashboard' || path === 'donor-dashboard') targetRoute = '/donor/dashboard';
    else if (path === '/ngo/dashboard' || path === 'ngo-dashboard') targetRoute = '/ngo/dashboard';
    else if (path === '/admin/dashboard' || path === 'admin-dashboard') targetRoute = '/admin/dashboard';
    else if (path === '/research-lab' || path === 'research-lab') targetRoute = '/research-lab';

    setCurrentRoute(targetRoute);
    try {
      window.history.pushState({}, '', targetRoute);
    } catch {
      // Ignore in certain iframe environments
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Route Protection & Guards
  const renderContent = () => {
    // 1. PUBLIC LANDING PAGE
    if (currentRoute === '/') {
      return (
        <LandingPage 
          onNavigate={(target) => navigate(target)} 
          openRoleModal={() => setRoleModalOpen(true)} 
        />
      );
    }

    // 2. RESEARCH LAB (Publicly accessible for academic review)
    if (currentRoute === '/research-lab') {
      return (
        <ResearchLab onNavigateHome={() => navigate('/')} />
      );
    }

    // 3. LOGIN ROUTES
    if (currentRoute === '/donor/login') {
      return <DonorLogin onNavigate={navigate} />;
    }

    if (currentRoute === '/ngo/login') {
      return <NgoLogin onNavigate={navigate} />;
    }

    if (currentRoute === '/admin/login') {
      return <AdminLogin onNavigate={navigate} />;
    }

    // 4. PROTECTED ROUTE: DONOR DASHBOARD
    if (currentRoute === '/donor/dashboard') {
      if (!currentUser || currentRole !== 'donor') {
        return (
          <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-lg text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">Donor Access Required</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                You must be signed in with a donor account to view and manage your donations.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="btn-guard-donor-login"
                  onClick={() => navigate('/donor/login')}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In as Donor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2 px-4 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-all"
                >
                  Back to Homepage
                </button>
              </div>
            </div>
          </div>
        );
      }
      return <DonorDashboard onNavigateHome={() => navigate('/')} />;
    }

    // 5. PROTECTED ROUTE: NGO DASHBOARD
    if (currentRoute === '/ngo/dashboard') {
      if (!currentUser || currentRole !== 'ngo') {
        return (
          <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-lg text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">NGO Partner Access Required</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                Please sign in with verified organization credentials to submit community requirements and view allocations.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="btn-guard-ngo-login"
                  onClick={() => navigate('/ngo/login')}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In as NGO Partner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2 px-4 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-all"
                >
                  Back to Homepage
                </button>
              </div>
            </div>
          </div>
        );
      }
      return <NgoDashboard />;
    }

    // 6. PROTECTED ROUTE: ADMIN DASHBOARD
    if (currentRoute === '/admin/dashboard') {
      if (!currentUser || currentRole !== 'admin') {
        return (
          <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-lg text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">Administrator Credentials Required</h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                This area contains restricted controls for logistics and ASCA allocation execution.
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="btn-guard-admin-login"
                  onClick={() => navigate('/admin/login')}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-stone-900 hover:bg-black text-white transition-all flex items-center justify-center gap-2"
                >
                  <span>Sign In as Administrator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-2 px-4 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100 transition-all"
                >
                  Back to Homepage
                </button>
              </div>
            </div>
          </div>
        );
      }
      return <AdminDashboard />;
    }

    // Fallback: Landing Page
    return <LandingPage onNavigate={navigate} openRoleModal={() => setRoleModalOpen(true)} />;
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Primary Navigation */}
      <Navbar 
        currentRoute={currentRoute}
        onNavigate={navigate}
        onOpenRoleModal={() => setRoleModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Role Selection Modal */}
      <RoleSelectModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        onSelectRole={(target) => navigate(target)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
