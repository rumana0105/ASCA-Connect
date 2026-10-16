import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, 
  ArrowRight, 
  Home, 
  Package, 
  Users, 
  Sparkles, 
  BookOpen, 
  Shirt, 
  GraduationCap, 
  Building2, 
  CheckCircle2, 
  Scale, 
  ShieldCheck, 
  Truck, 
  FlaskConical,
  LogIn,
  SlidersHorizontal,
  Cpu,
  Calculator,
  Code2,
  Recycle,
  Layers
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  openRoleModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, openRoleModal }) => {
  const { currentUser, currentRole, ngos, donations } = useApp();
  const [starvationDemoMode, setStarvationDemoMode] = useState<'memoryless' | 'asca'>('memoryless');

  // Dynamic platform impact aggregates from context
  const totalDonations = donations.length;
  const verifiedNgoCount = ngos.filter(n => n.status === 'verified').length;
  const totalBooksRehomed = donations
    .filter(d => d.category === 'Books' && (d.status === 'allocated' || d.status === 'delivered'))
    .reduce((acc, d) => acc + d.quantity, 148);
  const totalClothesKg = donations
    .filter(d => d.category === 'Clothes' && (d.status === 'allocated' || d.status === 'delivered'))
    .reduce((acc, d) => acc + d.approximateWeightKg, 312);
  const itemsDeliveredCount = donations
    .filter(d => d.status === 'delivered')
    .reduce((acc, d) => acc + d.quantity, 280);

  const handleDonateClick = () => {
    if (currentUser && currentRole === 'donor') {
      onNavigate('/donor/dashboard');
    } else {
      onNavigate('/donor/login');
    }
  };

  const handleNgoClick = () => {
    if (currentUser && currentRole === 'ngo') {
      onNavigate('/ngo/dashboard');
    } else {
      onNavigate('/ngo/login');
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thoughtful, sequential non-profit donation allocation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
              Your Extra Can Become <br className="hidden sm:block" />
              <span className="text-emerald-850 bg-gradient-to-r from-emerald-800 to-teal-800 bg-clip-text text-transparent">
                Someone’s Essential.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl">
              Give your unused clothes, books and useful items a second life by connecting them with organizations that genuinely need them.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="btn-hero-donate-now"
                onClick={handleDonateClick}
                className="px-6 py-3.5 rounded-xl text-base font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <Package className="w-5 h-5" />
                <span>Donate Items</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="btn-hero-im-ngo"
                onClick={handleNgoClick}
                className="px-5 py-3.5 rounded-xl text-base font-semibold bg-white hover:bg-stone-50 text-stone-850 border border-stone-300 transition-all cursor-pointer shadow-xs flex items-center gap-2"
              >
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>I'm an NGO</span>
              </button>

              <button
                id="btn-hero-login"
                onClick={openRoleModal}
                className="px-4 py-3.5 rounded-xl text-base font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Non-Profits Only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>ASCA Fairness Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Doorstep Collection</span>
              </div>
            </div>
          </div>

          {/* Right Visual: HOME -> DONATION -> COMMUNITY -> IMPACT */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-stone-200/50 border border-stone-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    The Sequential Journey
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    Human-Centered Flow
                  </span>
                </div>

                {/* Step 1: HOME */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-150 transition-all hover:bg-stone-50">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">1. Home</h4>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      Useful books, apparel, and supplies stored without everyday use.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 text-stone-300">
                  <span className="text-xs font-mono">↓</span>
                </div>

                {/* Step 2: DONATION */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-stone-50/80 border border-stone-150 transition-all hover:bg-stone-50">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">2. Donation</h4>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      Listed by donor, verified by condition, gathered in categorized runs.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 text-stone-300">
                  <span className="text-xs font-mono">↓</span>
                </div>

                {/* Step 3: ASCA ALLOCATION */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-emerald-950">3. ASCA Fair Allocation</h4>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900">
                        Remembers Shortfall
                      </span>
                    </div>
                    <p className="text-xs text-emerald-850 mt-0.5 leading-relaxed">
                      Balances active need with historical shortfall so small centres never starve.
                    </p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 text-stone-300">
                  <span className="text-xs font-mono">↓</span>
                </div>

                {/* Step 4: IMPACT */}
                <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-teal-950">4. Community Impact</h4>
                    <p className="text-xs text-teal-850 mt-0.5 leading-relaxed">
                      Delivered directly to community reading rooms and shelters with proof receipts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROLE SELECTION SECTION */}
      <section id="role-selection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Participation Portals
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
            How would you like to help?
          </h2>
          <p className="text-base text-stone-600 mt-2 leading-relaxed">
            Choose your role to access dedicated dashboards, transparent tracking, and ASCA allocation controls.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: DONOR */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md hover:shadow-xl hover:border-emerald-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Package className="w-7 h-7 text-emerald-700" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>Donor Space</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                Give useful items a second life.
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                Donate clean clothes, books, and essential educational supplies. Receive doorstep pickup tokens and trace your donation from pickup to final recipient delivery.
              </p>
            </div>

            <div>
              <ul className="space-y-2.5 text-xs text-stone-600 mb-6 pb-6 border-b border-stone-150">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Transparent doorstep pickup token</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live batch allocation notifications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified delivery receipts with community photos</span>
                </li>
              </ul>

              <button
                id="btn-card-donor-signin"
                onClick={() => onNavigate('/donor/login')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In as Donor / Donate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: NGO */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Building2 className="w-7 h-7 text-blue-700" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>NGO Partner Portal</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                Tell us what your community needs.
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                Register verified requirements for education, clothing, and shelter. The ASCA algorithm remembers any unmet deficit and grants higher priority in subsequent rounds.
              </p>
            </div>

            <div>
              <ul className="space-y-2.5 text-xs text-stone-600 mb-6 pb-6 border-b border-stone-150">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Itemized community requirement postings</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Historical shortfall credit accumulation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Fair sequential distribution guarantee</span>
                </li>
              </ul>

              <button
                id="btn-card-ngo-signin"
                onClick={() => onNavigate('/ngo/login')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-blue-800 hover:bg-blue-900 text-white shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In as NGO Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 3: ADMIN */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-7 h-7 text-amber-700" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[11px] font-bold uppercase tracking-wider mb-2">
                <span>Administrative Access</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2">
                Manage donations, organizations & fair allocation.
              </h3>
              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                Approve NGO registrations, oversee door-to-door collection runs, group items into standardized batches, and execute ASCA mathematical allocations.
              </p>
            </div>

            <div>
              <ul className="space-y-2.5 text-xs text-stone-600 mb-6 pb-6 border-b border-stone-150">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>NGO vetting & verification workflows</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Collection run & vehicle route scheduling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>ASCA allocation engine & research simulation</span>
                </li>
              </ul>

              <button
                id="btn-card-admin-signin"
                onClick={() => onNavigate('/admin/login')}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-stone-900 hover:bg-black text-white shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Admin Operations Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIGNIFIED HUMAN REALITY & STORY SECTION */}
      <section id="human-story" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            The Human Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2">
            Two Sides of the Same Problem
          </h2>
          <p className="text-base text-stone-600 mt-4 leading-relaxed">
            In our neighborhoods, usable surpluses and acute shortages coexist. When bridged transparently, everyday items restore opportunity.
          </p>
        </div>

        <div className="grid md:grid-cols-11 gap-6 items-center">
          {/* Left Column: Something You No Longer Need */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              Something You No Longer Need
            </h3>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              Every home has items in good condition that have completed their chapter with us:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-stone-700 text-sm">
                <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Books sitting on shelves</strong> after students advance to next grades.</span>
              </li>
              <li className="flex items-start gap-3 text-stone-700 text-sm">
                <Shirt className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Clothes no longer worn</strong> but clean, warm, and sturdy.</span>
              </li>
              <li className="flex items-start gap-3 text-stone-700 text-sm">
                <GraduationCap className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Stationery & school supplies</strong> left behind as academic years change.</span>
              </li>
            </ul>
          </div>

          {/* Center Bridge */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-4">
            <div className="h-12 w-0.5 bg-stone-300 hidden md:block" />
            <div className="my-2 px-3 py-2 rounded-full bg-stone-900 text-emerald-300 text-[11px] font-bold tracking-wider text-center shadow-md whitespace-nowrap">
              WE CONNECT THEM
            </div>
            <div className="h-12 w-0.5 bg-stone-300 hidden md:block" />
          </div>

          {/* Right Column: Something Someone Else Needs */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">
              Something Someone Else Needs
            </h3>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              Verified grassroots organizations supporting community members with dignity:
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-stone-700 text-sm">
                <Shirt className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>A community centre needing clothes</strong> for families facing changing seasons.</span>
              </li>
              <li className="flex items-start gap-3 text-stone-700 text-sm">
                <BookOpen className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>A learning sanctuary needing books</strong> for children eager to discover reading.</span>
              </li>
              <li className="flex items-start gap-3 text-stone-700 text-sm">
                <Users className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>After-school programs needing supplies</strong> to keep evening tutoring freely accessible.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Dignified Human Message Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-stone-900 text-white text-center max-w-4xl mx-auto shadow-md">
          <p className="text-lg sm:text-xl font-medium text-stone-200 leading-relaxed">
            “The challenge isn't only collecting donations.<br className="hidden sm:block" />
            The challenge is making sure they reach where they are genuinely needed.”
          </p>
        </div>
      </section>

      {/* 4. WHY FAIRNESS MATTERS & ASCA FOUNDATION */}
      <section id="why-fairness" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-stone-100/90 to-emerald-50/50 rounded-3xl p-8 sm:p-12 border border-stone-200">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              The Research Foundation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-1">
              Getting Donations There Is Only Half the Problem.
            </h2>
            <p className="text-base sm:text-lg text-stone-600 mt-4 leading-relaxed">
              When available donations are limited, repeatedly fulfilling the largest or earliest request 
              leaves smaller grassroots organizations chronically underserved across sequential rounds.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-800 text-white text-sm font-semibold shadow-xs">
              <span>Our system remembers past deficits.</span>
            </div>
          </div>

          {/* Sequential Timeline Visual: Round 1 -> Round 2 */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Round 1 Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-stone-100 text-stone-800 uppercase tracking-wide">
                  Round 1: Limited Supply
                </span>
                <span className="text-xs text-stone-400 font-mono-code">t = 1</span>
              </div>
              <p className="text-sm text-stone-600 mb-4">
                A grassroots learning centre submits an urgent request for 100 books.
              </p>
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl text-sm border border-stone-150">
                <div className="flex justify-between">
                  <span className="text-stone-500">Requested:</span>
                  <span className="font-bold text-stone-900">100 items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700 font-medium">Received from batch:</span>
                  <span className="font-bold text-emerald-700">40 items</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                  <span className="text-amber-800 font-semibold">Unmet need (Shortfall):</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold font-mono-code text-xs">
                    60 items
                  </span>
                </div>
              </div>
            </div>

            {/* Round 2 Card */}
            <div className="bg-white rounded-2xl p-6 border border-emerald-300 shadow-xs relative">
              <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs">
                ASCA Memory Active
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 uppercase tracking-wide">
                  Round 2: Sequential Evaluation
                </span>
                <span className="text-xs text-emerald-600 font-mono-code">t = 2</span>
              </div>
              <p className="text-sm text-stone-600 mb-4">
                A new batch arrives. Traditional algorithms wipe the slate clean. <strong>ASCA does not.</strong>
              </p>
              <div className="space-y-3 bg-emerald-50/60 p-4 rounded-xl text-sm border border-emerald-200">
                <div className="flex justify-between">
                  <span className="text-stone-600">Historical Unmet Shortfall:</span>
                  <span className="font-bold text-stone-900 font-mono-code">S(i) = 60 items</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">New Demand d(i,2):</span>
                  <span className="font-bold text-stone-900 font-mono-code">50 items</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-center">
                  <span className="text-emerald-900 font-semibold">ASCA Priority Bonus:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-950 font-bold text-xs">
                    High Priority Rank (+Shortfall Credit)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Starvation Demonstration */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-150">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>Interactive Demonstration: The Starvation Problem</span>
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Compare how a memoryless policy behaves versus Adaptive Shortfall Credit Allocation.
                </p>
              </div>

              {/* Toggle Mode */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setStarvationDemoMode('memoryless')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    starvationDemoMode === 'memoryless'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Memoryless (Traditional)
                </button>
                <button
                  type="button"
                  onClick={() => setStarvationDemoMode('asca')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    starvationDemoMode === 'asca'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  ASCA Policy (Ours)
                </button>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {/* Grassroots Org 1 */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-stone-800">Richa Welfare Centre</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 text-stone-700">Small NGO</span>
                </div>
                <p className="text-xs text-stone-500 mb-3">Repeatedly asks for 60 clothes / round.</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Rounds Allocated:</span>
                    <span className={`font-bold ${starvationDemoMode === 'memoryless' ? 'text-red-600' : 'text-emerald-700'}`}>
                      {starvationDemoMode === 'memoryless' ? '1 of 5 rounds (Starved)' : '4 of 5 rounds (Balanced)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Unmet Shortfall Credit:</span>
                    <span className="font-bold text-stone-800 font-mono-code">
                      {starvationDemoMode === 'memoryless' ? 'Ignored (0 credit)' : '+180 credits carried'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Large Org 2 */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-stone-800">Apex Metropolitan</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">Large NGO</span>
                </div>
                <p className="text-xs text-stone-500 mb-3">Requests 500 clothes / round.</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Rounds Allocated:</span>
                    <span className="font-bold text-stone-800">
                      {starvationDemoMode === 'memoryless' ? '5 of 5 rounds (Dominates)' : '3 of 5 rounds (Fair Share)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Fairness Outcome:</span>
                    <span className="font-bold text-stone-700">
                      {starvationDemoMode === 'memoryless' ? 'Consumes entire batch' : 'Equitable allocation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Metric */}
              <div className={`p-4 rounded-xl border ${
                starvationDemoMode === 'memoryless'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <span className="text-[10px] font-bold uppercase tracking-wider block mb-1">
                  Fairness Index (Jain's JFI)
                </span>
                <div className="text-2xl font-extrabold font-mono-code mb-1">
                  {starvationDemoMode === 'memoryless' ? 'JFI = 0.42 (Unfair)' : 'JFI = 0.89 (Highly Fair)'}
                </div>
                <p className="text-xs leading-relaxed opacity-90">
                  {starvationDemoMode === 'memoryless'
                    ? 'Memoryless policies favor high-volume requesters, causing continuous starvation for smaller grassroots groups.'
                    : 'ASCA boosts starved partners with accumulated shortfall credits, achieving high sequential fairness across rounds.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-2">
            How It Works
          </h2>
          <p className="text-base text-stone-600 mt-3 leading-relaxed">
            From your doorstep to verified community shelves through a 4-step sequence.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 01 DONATE */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-stone-300 group-hover:text-emerald-600 transition-colors font-mono-code">
                  01
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 uppercase tracking-wide">
                Donate
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                List useful clothes, books, and other items in your home. Specify condition and select your preferred pickup schedule.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-stone-100 text-xs text-stone-500 font-medium">
              Doorstep token generated
            </div>
          </div>

          {/* 02 REQUEST */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-stone-300 group-hover:text-emerald-600 transition-colors font-mono-code">
                  02
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 uppercase tracking-wide">
                Request
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Verified NGOs tell us what their communities currently need — exact categories, quantities, and urgency levels.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-stone-100 text-xs text-stone-500 font-medium">
              Vetted partner non-profits
            </div>
          </div>

          {/* 03 ALLOCATE FAIRLY */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-300 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-0" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-emerald-500 font-mono-code">
                  03
                </span>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-emerald-950 mb-2 uppercase tracking-wide">
                Allocate Fairly
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                ASCA evaluates both active demand and historical unmet shortfall, allocating batches with mathematical fairness.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-emerald-100 text-xs text-emerald-800 font-semibold relative z-10">
              Adaptive Shortfall Credit
            </div>
          </div>

          {/* 04 TRACK IMPACT */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-colors group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-extrabold text-stone-300 group-hover:text-emerald-600 transition-colors font-mono-code">
                  04
                </span>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2 uppercase tracking-wide">
                Track Impact
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Follow your donation through pickup, batch grouping, allocation, and final physical delivery to the recipient organization.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-stone-100 text-xs text-stone-500 font-medium">
              Verified recipient receipts
            </div>
          </div>
        </div>
      </section>

      {/* 6. IMPACT SECTION */}
      <section id="impact-metrics" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xl">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Measurable Outcomes
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 text-stone-50">
              Small Things. Real Impact.
            </h2>
            <p className="text-stone-400 mt-3 text-sm sm:text-base leading-relaxed">
              Every bookshelf organized and wardrobe decluttered adds up to real resources for community welfare.
            </p>
          </div>

          {/* Platform Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 pb-12 border-b border-stone-800">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono-code">
                {totalDonations}
              </div>
              <div className="text-xs sm:text-sm text-stone-400 mt-1 font-medium">
                Donations Received
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono-code">
                {totalBooksRehomed}+
              </div>
              <div className="text-xs sm:text-sm text-stone-400 mt-1 font-medium">
                Books Rehomed
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono-code">
                {totalClothesKg} kg
              </div>
              <div className="text-xs sm:text-sm text-stone-400 mt-1 font-medium">
                Clothes Collected
              </div>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-300 font-mono-code">
                {verifiedNgoCount}
              </div>
              <div className="text-xs sm:text-sm text-stone-400 mt-1 font-medium">
                NGOs Supported
              </div>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono-code">
                {itemsDeliveredCount}
              </div>
              <div className="text-xs sm:text-sm text-stone-400 mt-1 font-medium">
                Items Delivered
              </div>
            </div>
          </div>

          {/* Sample Impact Stories */}
          <div className="pt-10 grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-750">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Impact Story</span>
              </div>
              <p className="text-base text-stone-100 font-medium leading-relaxed">
                “20 books found their way into a community learning centre.”
              </p>
              <p className="text-xs text-stone-400 mt-2">
                Allocated to St. Jude Youth Sanctuary via BATCH-1042 under ASCA priority weighting.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-750">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Impact Story</span>
              </div>
              <p className="text-base text-stone-100 font-medium leading-relaxed">
                “15 kg of warm clothing delivered to a neighborhood daycare.”
              </p>
              <p className="text-xs text-stone-400 mt-2">
                Delivered to Richa Community Welfare Centre with verified digital handover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6.5 ALGORITHM & PSEUDOCODE EVALUATION SHOWCASE */}
      <section id="algorithms-showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-150">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                MCA Algorithm Defense & Formulations
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
                ASCA Algorithms & Working Calculations
              </h2>
              <p className="text-base text-stone-600 mt-2 max-w-2xl leading-relaxed">
                Explore the formal pseudocode, mathematical derivations, input validations, and dynamic calculations powering the ASCA reverse logistics platform.
              </p>
            </div>

            <button
              id="btn-open-algorithm-workbench"
              onClick={() => onNavigate('/algorithms')}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-emerald-800 hover:bg-emerald-900 text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer shrink-0"
            >
              <Cpu className="w-4 h-4 text-emerald-300" />
              <span>Launch Algorithm Workbench</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* 4 Interactive Algorithm Quick Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div 
              onClick={() => onNavigate('/algorithms')}
              className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                  Algo A
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                Donation Eligibility
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Quantitative validation, hygiene filtering, and vehicle dispatch radius calculation.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-800 group-hover:underline">
                <span>View Pseudocode & Math</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('/algorithms')}
              className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                  Algo B
                </span>
                <Recycle className="w-4 h-4 text-blue-700" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-blue-900 transition-colors">
                Material Classification
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Routes clothes & books to direct reuse, mending, fibre recycling, or bio-quarantine.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-blue-800 group-hover:underline">
                <span>View Pseudocode & Math</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('/algorithms')}
              className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                  Algo C
                </span>
                <Truck className="w-4 h-4 text-amber-700" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                Collection Progress
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Dynamic target fulfillment, remaining quantity calculation, and vehicle payload tracking.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-amber-800 group-hover:underline">
                <span>View Pseudocode & Math</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div 
              onClick={() => onNavigate('/algorithms')}
              className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-teal-100 text-teal-900 uppercase">
                  Algo D
                </span>
                <Layers className="w-4 h-4 text-teal-700" />
              </div>
              <h4 className="text-sm font-bold text-stone-900 group-hover:text-teal-900 transition-colors">
                Circular Material Impact
              </h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                Mass balance conservation, landfill diversion rate, and reuse/recycling partition.
              </p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-teal-800 group-hover:underline">
                <span>View Pseudocode & Math</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to give something a second life?
            </h2>
            <p className="text-emerald-200 text-sm sm:text-base leading-relaxed">
              Join our network of donors and verified grassroots partners making fair distribution a reality.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                id="btn-cta-donate"
                onClick={handleDonateClick}
                className="px-6 py-3 rounded-xl text-sm font-semibold bg-white text-emerald-950 hover:bg-emerald-50 transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                <span>Donate Items Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-cta-ngo-register"
                onClick={handleNgoClick}
                className="px-5 py-3 rounded-xl text-sm font-semibold bg-emerald-800 hover:bg-emerald-700 text-white border border-emerald-600 transition-all cursor-pointer flex items-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                <span>Partner With Us as an NGO</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">ASCA Project</span>
            <span>—</span>
            <span>Adaptive Shortfall Credit Allocation for Fair Sequential Donation Distribution</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              id="footer-algorithms"
              onClick={() => onNavigate('/algorithms')}
              className="text-stone-700 hover:text-emerald-700 font-medium"
            >
              Algorithm & Pseudocode
            </button>
            <button
              onClick={() => onNavigate('/research-lab')}
              className="text-stone-700 hover:text-emerald-700 font-medium"
            >
              ASCA Research Lab
            </button>
            <button
              onClick={() => onNavigate('/admin/login')}
              className="text-stone-700 hover:text-amber-800 font-medium"
            >
              Admin Portal
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
