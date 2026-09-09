import React from 'react';
import { X, Package, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (route: string) => void;
}

export const RoleSelectModal: React.FC<RoleSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectRole
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Access Portals
          </span>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            How would you like to sign in?
          </h2>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Choose your role to access your dedicated space with tailored features.
          </p>
        </div>

        <div className="space-y-3">
          {/* Donor Option */}
          <button
            onClick={() => {
              onClose();
              onSelectRole('/donor/login');
            }}
            className="w-full text-left p-4 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-900">
                    Individual Donor
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    Give Items
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Give unused clothes, books, or supplies a second life.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* NGO Option */}
          <button
            onClick={() => {
              onClose();
              onSelectRole('/ngo/login');
            }}
            className="w-full text-left p-4 rounded-2xl border border-stone-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-blue-900">
                    NGO Partner
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                    Request Items
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Submit community requirements & receive ASCA allocations.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Admin Option */}
          <button
            onClick={() => {
              onClose();
              onSelectRole('/admin/login');
            }}
            className="w-full text-left p-4 rounded-2xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-900">
                    ASCA Administrator
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                    Operations & Research
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage collections, NGO verification, and ASCA execution.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
