import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowLeft,
  CheckCircle2,
  Scale
} from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../config/demoAuth';

interface NgoLoginProps {
  onNavigate: (path: string) => void;
}

export const NgoLogin: React.FC<NgoLoginProps> = ({ onNavigate }) => {
  const { login, currentUser, currentRole } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated as NGO
  const isAlreadyNgo = currentUser && currentRole === 'ngo';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    const result = login('ngo', username, password);
    setIsSubmitting(false);

    if (result.success) {
      onNavigate('/ngo/dashboard');
    } else {
      setErrorMessage(result.error || 'Invalid username or password.');
    }
  };

  const handleQuickFill = () => {
    setUsername(DEMO_ACCOUNTS.ngo.username);
    setPassword(DEMO_ACCOUNTS.ngo.password);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Homepage</span>
        </button>

        {/* Card Container */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-stone-200/60 border border-stone-200">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 mb-1 shadow-xs">
              <Building2 className="w-6 h-6 text-blue-700" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold uppercase tracking-wider">
              <span>NGO Partner Portal</span>
            </div>

            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Sign In as NGO Partner
            </h1>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Submit community item requirements and track fair sequential ASCA shortfall allocations.
            </p>
          </div>

          {/* Already logged in alert */}
          {isAlreadyNgo && (
            <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Signed in as <strong>{currentUser.name}</strong> ({currentUser.organizationName})</span>
              </div>
              <button
                onClick={() => onNavigate('/ngo/dashboard')}
                className="font-bold underline hover:text-blue-950"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div 
              id="ngo-login-error"
              className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="ngo-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. richa.ngo"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="ngo-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              id="btn-ngo-login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Verifying...' : 'Sign In to NGO Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Academic Evaluation Demo Box */}
          <div className="mt-6 pt-5 border-t border-stone-150">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Academic Evaluation Account</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold">
                  Demo
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mb-2">
                Organization: <strong>Richa Community Welfare Centre</strong>
              </p>
              <div className="text-xs text-stone-600 space-y-1 font-mono-code mb-3 bg-white p-2.5 rounded-lg border border-stone-200">
                <div className="flex justify-between">
                  <span className="text-stone-400">Username:</span>
                  <span className="font-bold text-stone-900">richa.ngo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Password:</span>
                  <span className="font-bold text-stone-900">Richa@123</span>
                </div>
              </div>
              <button
                type="button"
                id="btn-quick-fill-ngo"
                onClick={handleQuickFill}
                className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-stone-200/80 hover:bg-stone-300 text-stone-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Auto-fill Richa's Credentials</span>
              </button>
            </div>
          </div>

          {/* Alternative Links */}
          <div className="mt-6 space-y-2 text-center text-xs text-stone-500">
            <div>
              Are you an individual donor?{' '}
              <button
                onClick={() => onNavigate('/donor/login')}
                className="text-blue-800 font-bold hover:underline"
              >
                Sign in to Donor Space
              </button>
            </div>
            <div>
              <button
                onClick={() => onNavigate('/admin/login')}
                className="text-stone-500 hover:text-stone-800 hover:underline"
              >
                Administrative Access
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
