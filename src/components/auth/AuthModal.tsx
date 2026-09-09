import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Phone, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  initialRole?: UserRole;
  onSuccessNavigate: (tab: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  initialRole = 'donor',
  onSuccessNavigate
}) => {
  const { login, register, switchRole } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole === 'guest' ? 'donor' : initialRole);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [beneficiaryType, setBeneficiaryType] = useState('Learning Centre');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      if (!email.trim()) {
        setErrorMsg('Please enter your email address.');
        return;
      }
      const ok = login(email, selectedRole);
      if (ok) {
        onClose();
        if (selectedRole === 'donor') onSuccessNavigate('donor-dashboard');
        else if (selectedRole === 'ngo') onSuccessNavigate('ngo-dashboard');
        else if (selectedRole === 'admin') onSuccessNavigate('admin-dashboard');
      }
    } else {
      // Register
      if (!name.trim() || !email.trim()) {
        setErrorMsg('Please complete all required fields.');
        return;
      }
      if (selectedRole === 'admin') {
        setErrorMsg('Admin registration is restricted. Please sign in using pre-configured admin access.');
        return;
      }
      if (selectedRole === 'ngo' && !orgName.trim()) {
        setErrorMsg('Organization name is required for NGO accounts.');
        return;
      }

      const ok = register({
        name,
        email,
        role: selectedRole,
        orgName: selectedRole === 'ngo' ? orgName : undefined,
        phone,
        beneficiaryType: selectedRole === 'ngo' ? beneficiaryType : undefined
      });

      if (ok) {
        onClose();
        if (selectedRole === 'donor') onSuccessNavigate('donor-dashboard');
        else if (selectedRole === 'ngo') onSuccessNavigate('ngo-dashboard');
      }
    }
  };

  // Quick 1-click login for evaluation demonstration
  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role);
    onClose();
    if (role === 'donor') onSuccessNavigate('donor-dashboard');
    else if (role === 'ngo') onSuccessNavigate('ngo-dashboard');
    else if (role === 'admin') onSuccessNavigate('admin-dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 sm:p-8 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-800">
              ASCA Access Portal
            </span>
          </div>
          <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
            {mode === 'login' ? 'Sign In to Your Space' : 'Create an Account'}
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Single unified authentication system for Donors, NGOs, and Research Administrators.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="px-6 sm:px-8">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
            Select Your Role
          </label>
          <div className="grid grid-cols-3 gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              type="button"
              id="auth-role-donor"
              onClick={() => setSelectedRole('donor')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'donor'
                  ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              I'M A DONOR
            </button>

            <button
              type="button"
              id="auth-role-ngo"
              onClick={() => setSelectedRole('ngo')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'ngo'
                  ? 'bg-white text-blue-800 shadow-xs border border-blue-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              I'M AN NGO
            </button>

            <button
              type="button"
              id="auth-role-admin"
              onClick={() => {
                setSelectedRole('admin');
                setMode('login'); // Admin registration forbidden
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                selectedRole === 'admin'
                  ? 'bg-white text-amber-900 shadow-xs border border-amber-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              I'M AN ADMIN
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 pt-4 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {errorMsg}
            </div>
          )}

          {selectedRole === 'admin' && mode === 'register' && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              Admin registration is not publicly available. Please use pre-configured administrator credentials or quick sign-in below.
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {mode === 'register' && selectedRole === 'ngo' && (
            <>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Organization / NGO Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Hope Literacy Mission"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Beneficiary Focus
                </label>
                <select
                  value={beneficiaryType}
                  onChange={(e) => setBeneficiaryType(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                >
                  <option value="Learning Centre">Learning Centre / Youth Education</option>
                  <option value="Shelter">Shelter & Homeless Relief</option>
                  <option value="Children Home">Children Home / Orphanage</option>
                  <option value="Senior Care">Senior Care Facility</option>
                  <option value="Rural School">Rural School</option>
                  <option value="Community Centre">Community Centre</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  selectedRole === 'donor' 
                    ? 'maya.chen@example.com' 
                    : selectedRole === 'ngo' 
                    ? 'reed@stjudelearning.org' 
                    : 'admin@asca-impact.org'
                }
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-700 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-3 rounded-xl text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{mode === 'login' ? 'Continue' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mode Switcher */}
          <div className="text-center pt-2">
            {selectedRole !== 'admin' && (
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-xs text-stone-600 hover:text-emerald-700 font-medium"
              >
                {mode === 'login' 
                  ? "Don't have an account yet? Register here" 
                  : 'Already have an account? Sign in'}
              </button>
            )}
          </div>
        </form>

        {/* Evaluation Quick-Sign-In Bar (Section 44 Testing) */}
        <div className="bg-stone-50 p-4 border-t border-stone-200">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Viva / Evaluator One-Click Sign In:</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('donor')}
              className="py-1.5 px-2 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-emerald-900 hover:bg-emerald-50 transition-colors"
            >
              Demo Donor
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ngo')}
              className="py-1.5 px-2 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-blue-900 hover:bg-blue-50 transition-colors"
            >
              Demo NGO
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1.5 px-2 rounded-lg bg-white border border-stone-200 text-[11px] font-semibold text-amber-900 hover:bg-amber-50 transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
