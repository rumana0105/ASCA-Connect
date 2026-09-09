import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Donation, DonationCategory, DonationCondition, DonationStatus } from '../../types';
import { 
  Package, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Layers, 
  Scale, 
  HeartHandshake, 
  Calendar, 
  MapPin, 
  Upload, 
  ArrowRight, 
  AlertCircle,
  BookOpen,
  Shirt,
  GraduationCap,
  Boxes,
  Eye,
  Info
} from 'lucide-react';

interface DonorDashboardProps {
  onNavigateHome: () => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({ onNavigateHome }) => {
  const { currentUser, donations, batches, deliveries, createDonation, schedulePickup } = useApp();

  // Navigation tab within Donor Space
  const [subTab, setSubTab] = useState<'overview' | 'donate' | 'history' | 'impact'>('overview');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // Form states
  const [category, setCategory] = useState<DonationCategory>('Books');
  const [quantity, setQuantity] = useState<number>(20);
  const [approximateWeightKg, setApproximateWeightKg] = useState<number>(8.5);
  const [condition, setCondition] = useState<DonationCondition>('Usable');
  const [description, setDescription] = useState('');
  const [pickupAddress, setPickupAddress] = useState(
    currentUser?.address || '742 Evergreen Terrace, Apt 4B, Eastbrook'
  );
  const [preferredPickupDate, setPreferredPickupDate] = useState(
    new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  );
  const [createdDonationId, setCreatedDonationId] = useState<string | null>(null);

  // Filter donations belonging to this donor or demo donor
  const myDonations = donations.filter(
    d => d.donorId === currentUser?.id || d.donorEmail === currentUser?.email || d.donorName === currentUser?.name
  );

  const totalDonatedItems = myDonations.reduce((acc, d) => acc + d.quantity, 0);
  const activePickups = myDonations.filter(d => d.status === 'pickup_scheduled' || d.status === 'approved').length;
  const completedDonations = myDonations.filter(d => d.status === 'delivered').length;
  const completedImpactKg = myDonations
    .filter(d => d.status === 'delivered')
    .reduce((acc, d) => acc + d.approximateWeightKg, 0);

  const handleSubmitDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    const id = createDonation({
      category,
      quantity: Number(quantity),
      approximateWeightKg: Number(approximateWeightKg),
      condition,
      description: description || `${quantity} items of ${category.toLowerCase()} in ${condition.toLowerCase()} condition.`,
      photos: [
        category === 'Books'
          ? 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80'
          : category === 'Clothes'
          ? 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&auto=format&fit=crop&q=80'
      ],
      pickupAddress,
      preferredPickupDate
    });

    setCreatedDonationId(id);
    setSubTab('history');
  };

  // 7-step visual workflow stages for tracking
  const STAGES: { key: DonationStatus; label: string; desc: string }[] = [
    { key: 'submitted', label: 'Submitted', desc: 'Listed by donor' },
    { key: 'approved', label: 'Verified', desc: 'Admin condition check' },
    { key: 'pickup_scheduled', label: 'Pickup Scheduled', desc: 'Token generated' },
    { key: 'collected', label: 'Collected', desc: 'Gathered by run agent' },
    { key: 'available', label: 'Added to Batch', desc: 'Grouped by category' },
    { key: 'allocated', label: 'Allocated', desc: 'Matched via ASCA' },
    { key: 'delivered', label: 'Delivered', desc: 'Received by community' }
  ];

  const getStageIndex = (status: DonationStatus) => {
    switch (status) {
      case 'submitted': return 0;
      case 'under_review': return 0;
      case 'approved': return 1;
      case 'pickup_scheduled': return 2;
      case 'collected': return 3;
      case 'available': return 4;
      case 'allocated': return 5;
      case 'delivered': return 6;
      default: return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Donor Space Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            <span>Donor Space</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Good to have you here{currentUser ? `, ${currentUser.name}` : ''}.
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Give unused household items a meaningful second life with transparent tracking.
          </p>
        </div>

        {/* Sub-Navigation Buttons */}
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 shrink-0">
          <button
            onClick={() => setSubTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'overview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Overview
          </button>
          <button
            id="donor-tab-donate"
            onClick={() => setSubTab('donate')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              subTab === 'donate'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Give Something</span>
          </button>
          <button
            onClick={() => setSubTab('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'history'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Donations ({myDonations.length})
          </button>
          <button
            onClick={() => setSubTab('impact')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'impact'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            My Impact
          </button>
        </div>
      </div>

      {/* 5 CARDS: My Donations, Items Donated, Active Pickup, Completed Donations, My Impact */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-medium text-stone-500">My Donations</span>
          <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-mono-code mt-1">
            {myDonations.length}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Contributions logged</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Items Donated</span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-mono-code mt-1">
            {totalDonatedItems}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Units given second life</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Active Pickup</span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-700 font-mono-code mt-1">
            {activePickups}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Scheduled / in progress</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Completed</span>
          <div className="text-2xl sm:text-3xl font-bold text-blue-700 font-mono-code mt-1">
            {completedDonations}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Delivered to NGOs</p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-medium text-emerald-200">My Impact</span>
          <div className="text-2xl sm:text-3xl font-bold text-white font-mono-code mt-1">
            {completedImpactKg.toFixed(1)} kg
          </div>
          <p className="text-[11px] text-emerald-300 mt-1">Rehomed via ASCA</p>
        </div>
      </div>

      {/* Main Content Areas */}

      {/* SUBTAB 1: OVERVIEW */}
      {subTab === 'overview' && (
        <div className="space-y-8">
          {/* Main CTA Banner */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Give Something a Second Life
              </h2>
              <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
                Have books, apparel, or school kits taking up room? We will arrange a doorstep collection run 
                and ensure your items reach organizations that have been waiting the longest.
              </p>
            </div>
            <button
              onClick={() => setSubTab('donate')}
              className="px-6 py-3.5 rounded-xl font-bold bg-emerald-750 text-white hover:bg-emerald-850 shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer bg-emerald-800"
            >
              <Plus className="w-5 h-5" />
              <span>Give Something a Second Life</span>
            </button>
          </div>

          {/* Active Donation Tracker Highlights */}
          {myDonations.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Latest Donation Journey</h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Real-time status of your most recent contribution.
                  </p>
                </div>
                <button
                  onClick={() => setSubTab('history')}
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  View All ({myDonations.length})
                </button>
              </div>

              {/* Render latest donation timeline */}
              {(() => {
                const latest = myDonations[0];
                const currentIndex = getStageIndex(latest.status);

                return (
                  <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-base">{latest.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            {latest.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {latest.quantity} items ({latest.approximateWeightKg} kg) • {latest.description}
                        </p>
                      </div>

                      {latest.pickupToken && (
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-stone-200 text-right">
                          <span className="text-[10px] text-stone-400 block uppercase font-mono">Pickup Token</span>
                          <span className="text-xs font-bold text-stone-900 font-mono-code">{latest.pickupToken}</span>
                        </div>
                      )}
                    </div>

                    {/* Section 8: Visual Timeline */}
                    <div className="relative">
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                        {STAGES.map((st, idx) => {
                          const isDone = idx <= currentIndex;
                          const isCurrent = idx === currentIndex;

                          return (
                            <div
                              key={st.key}
                              className={`p-3 rounded-xl border text-center flex flex-col items-center justify-between min-h-[90px] transition-all ${
                                isCurrent
                                  ? 'bg-emerald-50 border-emerald-400 shadow-xs'
                                  : isDone
                                  ? 'bg-white border-emerald-200'
                                  : 'bg-stone-100/60 border-stone-200 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-center mb-1">
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Clock className="w-4 h-4 text-stone-400" />
                                )}
                              </div>
                              <div className="text-xs font-bold text-stone-900 leading-tight">
                                {st.label}
                              </div>
                              <div className="text-[10px] text-stone-500 mt-1">
                                {st.desc}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: DONATION FORM */}
      {subTab === 'donate' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-3xl mx-auto">
          <div className="mb-8 pb-6 border-b border-stone-150">
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Give Something a Second Life
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Please share accurate details so our sorting volunteers can group your items cleanly.
            </p>
          </div>

          <form onSubmit={handleSubmitDonation} className="space-y-6">
            {/* Category Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                Item Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['Books', 'Clothes', 'School Supplies', 'Other Useful Items'] as DonationCategory[]).map(cat => {
                  const isSel = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSel
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <div className="mb-2">
                        {cat === 'Books' && <BookOpen className="w-5 h-5 text-emerald-700" />}
                        {cat === 'Clothes' && <Shirt className="w-5 h-5 text-emerald-700" />}
                        {cat === 'School Supplies' && <GraduationCap className="w-5 h-5 text-emerald-700" />}
                        {cat === 'Other Useful Items' && <Boxes className="w-5 h-5 text-emerald-700" />}
                      </div>
                      <span className="text-xs font-bold text-stone-900">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Weight */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Quantity (Units / Books / Garments)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setQuantity(q);
                    setApproximateWeightKg(Number((q * (category === 'Books' ? 0.5 : 0.4)).toFixed(1)));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Approximate Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={approximateWeightKg}
                  onChange={(e) => setApproximateWeightKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                Item Condition
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Usable', 'Needs Sorting', 'Not Suitable'] as DonationCondition[]).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      condition === c
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Description & Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Clean grade school readers, science workbooks, gently worn sweaters."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Pickup Address & Date */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Pickup Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Preferred Pickup Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={preferredPickupDate}
                    onChange={(e) => setPreferredPickupDate(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              id="btn-submit-donation-form"
              className="w-full py-3.5 rounded-xl font-bold bg-emerald-750 text-white hover:bg-emerald-850 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer bg-emerald-800"
            >
              <span>Submit Donation & Generate ID</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUBTAB 3: MY DONATIONS & JOURNEY TRACKING */}
      {subTab === 'history' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">Donation History & Tracking</h2>
            <button
              onClick={() => setSubTab('donate')}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              + List New Donation
            </button>
          </div>

          {myDonations.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No donations yet.</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Have books or clothes sitting unused? Give them a second life.
              </p>
              <button
                onClick={() => setSubTab('donate')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-750 text-white hover:bg-emerald-850 bg-emerald-800"
              >
                Create First Donation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myDonations.map(don => {
                const currentIdx = getStageIndex(don.status);
                const isDelivered = don.status === 'delivered';

                return (
                  <div
                    key={don.id}
                    className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-base">{don.id}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold border border-stone-200">
                            {don.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 capitalize">
                            {don.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          {don.quantity} units • {don.approximateWeightKg} kg • Condition: {don.condition} • {don.pickupAddress}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {don.pickupToken && (
                          <div className="text-right">
                            <span className="text-[10px] text-stone-400 uppercase font-mono block">Pickup Token</span>
                            <span className="text-xs font-bold font-mono-code text-stone-900">{don.pickupToken}</span>
                          </div>
                        )}
                        {don.batchId && (
                          <div className="text-right border-l border-stone-200 pl-3">
                            <span className="text-[10px] text-stone-400 uppercase font-mono block">Batch</span>
                            <span className="text-xs font-bold font-mono-code text-emerald-800">{don.batchId}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
                      {STAGES.map((st, sIdx) => {
                        const isDone = sIdx <= currentIdx;
                        const isCurrent = sIdx === currentIdx;

                        return (
                          <div
                            key={st.key}
                            className={`p-2.5 rounded-xl border text-center text-[11px] ${
                              isCurrent
                                ? 'bg-emerald-100/70 border-emerald-400 font-bold text-emerald-950'
                                : isDone
                                ? 'bg-stone-50 border-emerald-200 text-stone-800'
                                : 'bg-stone-50/50 border-stone-200 text-stone-400 opacity-60'
                            }`}
                          >
                            <div className="flex justify-center mb-1">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-stone-400" />
                              )}
                            </div>
                            <span className="leading-tight block">{st.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* If delivered, show Section 9 Impact Badge */}
                    {isDelivered && (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <div>
                            <p className="text-xs font-bold text-emerald-950">
                              Your donation found a new purpose.
                            </p>
                            <p className="text-[11px] text-emerald-800">
                              Allocated through ASCA to support community learning and relief.
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-bold font-mono-code text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                          Delivered
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: DONOR IMPACT (Section 9) */}
      {subTab === 'impact' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-lg">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Verified Purpose
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1 text-white">
              Your donation found a new purpose.
            </h2>
            <p className="text-sm text-stone-300 mt-2 max-w-xl leading-relaxed">
              Every item you handed over was checked, batched, and allocated through our Adaptive Shortfall Credit Allocation system to reach partner organizations.
            </p>
          </div>

          {/* Impact items */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <span className="text-xs font-bold uppercase text-stone-400">Completed Allocation</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Delivered
                </span>
              </div>
              <div className="space-y-2 text-sm text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">You donated:</span>
                  <span className="font-bold text-stone-900">18 winter garments</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Donation Batch:</span>
                  <span className="font-mono-code font-bold text-stone-900">BATCH-1039</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Allocated through:</span>
                  <span className="font-bold text-emerald-700">ASCA (Round 4)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Recipient Partner:</span>
                  <span className="font-bold text-stone-900">Pathways Night Shelter</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery Status:</span>
                  <span className="font-semibold text-emerald-700">Signed & Verified Receipt</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <span className="text-xs font-bold uppercase text-stone-400">Active Batch Allocation</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                  Batch Available
                </span>
              </div>
              <div className="space-y-2 text-sm text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">You donated:</span>
                  <span className="font-bold text-stone-900">24 Science & Literature Books</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Donation Batch:</span>
                  <span className="font-mono-code font-bold text-stone-900">BATCH-1042</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Status:</span>
                  <span className="font-semibold text-amber-700">Awaiting Batch Round</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Target Beneficiaries:</span>
                  <span className="font-bold text-stone-900">Rural Literacy & Tribal Schools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
