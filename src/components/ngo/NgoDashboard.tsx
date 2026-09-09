import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NGO, NGORequirement, DonationCategory, UrgencyLevel, BeneficiaryType } from '../../types';
import { 
  Building2, 
  Plus, 
  Clock, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  History, 
  Calendar, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Truck,
  FileText,
  Info,
  BookOpen,
  Shirt,
  Sparkles
} from 'lucide-react';

export const NgoDashboard: React.FC = () => {
  const { currentUser, ngos, requirements, deliveries, postRequirement } = useApp();

  const [subTab, setSubTab] = useState<'overview' | 'post-requirement' | 'history' | 'deliveries'>('overview');

  // Active NGO context
  const myNgo: NGO = ngos.find(n => n.id === currentUser?.ngoId) || ngos[0];

  // Requirements for this NGO
  const myRequirements = requirements.filter(r => r.ngoId === myNgo.id);
  const activeReqsCount = myRequirements.filter(r => r.status === 'active' || r.status === 'partially_fulfilled').length;
  const myDeliveries = deliveries.filter(d => d.ngoId === myNgo.id);

  // Form states
  const [item, setItem] = useState('');
  const [category, setCategory] = useState<DonationCategory>('Books');
  const [quantity, setQuantity] = useState(50);
  const [weightKg, setWeightKg] = useState(22.5);
  const [urgency, setUrgency] = useState<UrgencyLevel>('High');
  const [requiredBy, setRequiredBy] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [beneficiaryType, setBeneficiaryType] = useState<BeneficiaryType>(myNgo.beneficiaryType);
  const [description, setDescription] = useState('');

  const fulfillmentRate = myNgo.cumulativeDemand > 0
    ? Math.round((myNgo.cumulativeAllocated / myNgo.cumulativeDemand) * 100)
    : 0;

  const handlePostRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.trim() || quantity <= 0) return;

    postRequirement({
      item,
      category,
      quantity: Number(quantity),
      weightKg: Number(weightKg),
      urgency,
      requiredBy,
      beneficiaryType,
      description: description || `Urgent requirement for ${quantity} units of ${item} to support ${beneficiaryType}.`
    });

    setItem('');
    setDescription('');
    setSubTab('overview');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* NGO Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>{myNgo.name}</span>
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-semibold uppercase ${
              myNgo.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {myNgo.status}
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Tell us what your community needs.
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Registered partner portal with transparent historical shortfall tracking and ASCA allocation.
          </p>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 shrink-0">
          <button
            onClick={() => setSubTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'overview'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Dashboard
          </button>
          <button
            id="ngo-btn-post-req"
            onClick={() => setSubTab('post-requirement')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              subTab === 'post-requirement'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-blue-800 hover:bg-blue-50'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Requirement</span>
          </button>
          <button
            id="ngo-btn-need-history"
            onClick={() => setSubTab('history')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'history'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Your Need History
          </button>
          <button
            onClick={() => setSubTab('deliveries')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              subTab === 'deliveries'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Deliveries ({myDeliveries.length})
          </button>
        </div>
      </div>

      {/* 6 CARDS: Current Requirements, Pending Allocations, Received Items, Fulfillment Rate, Historical Shortfall, Current Priority */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Current Need</span>
          <div className="text-2xl font-bold text-stone-900 font-mono-code mt-1">
            {myNgo.currentDemand}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Active units requested</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Requirements</span>
          <div className="text-2xl font-bold text-blue-700 font-mono-code mt-1">
            {activeReqsCount}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Active requests logged</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Received Items</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono-code mt-1">
            {myNgo.cumulativeAllocated}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Cumulative allocated</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-xs font-medium text-stone-500">Fulfillment Rate</span>
          <div className="text-2xl font-bold text-stone-900 font-mono-code mt-1">
            {fulfillmentRate}%
          </div>
          <p className="text-[11px] text-stone-400 mt-1">Received vs Demanded</p>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-xs font-medium text-amber-900">Historical Shortfall</span>
          <div className="text-2xl font-bold text-amber-900 font-mono-code mt-1">
            {myNgo.historicalShortfall}
          </div>
          <p className="text-[11px] text-amber-700 mt-1">S(i) = max(0, D - A)</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-4 rounded-2xl shadow-sm">
          <span className="text-xs font-medium text-blue-200">ASCA Priority</span>
          <div className="text-2xl font-bold text-emerald-300 font-mono-code mt-1">
            {myNgo.currentAscaPriority ? myNgo.currentAscaPriority.toFixed(3) : '0.880'}
          </div>
          <p className="text-[11px] text-blue-200 mt-1">α=0.5, β=0.5 weighted</p>
        </div>
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {subTab === 'overview' && (
        <div className="space-y-8">
          {/* Post Requirement CTA Bar */}
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                Submit an Active Requirement
              </h2>
              <p className="text-sm text-stone-600 max-w-xl leading-relaxed">
                Whether you need children's textbooks, winter jackets, or educational supplies, our ASCA allocation 
                engine factors your unfulfilled past demand so you won't be forgotten.
              </p>
            </div>
            <button
              onClick={() => setSubTab('post-requirement')}
              className="px-6 py-3.5 rounded-xl font-bold bg-blue-700 text-white hover:bg-blue-800 shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>Post a Requirement</span>
            </button>
          </div>

          {/* Active Requirements List */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Active Community Requirements</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  These active requirements are currently evaluated against incoming donation batches.
                </p>
              </div>
              <button
                onClick={() => setSubTab('history')}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                View Need History
              </button>
            </div>

            {myRequirements.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-sm">
                No active requirements at the moment.
              </div>
            ) : (
              <div className="divide-y divide-stone-150">
                {myRequirements.map(req => (
                  <div key={req.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-base">{req.item}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                          {req.category}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                          req.urgency === 'Critical' ? 'bg-red-100 text-red-800' :
                          req.urgency === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {req.urgency} Urgency
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 max-w-xl">
                        {req.description}
                      </p>
                      <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-4">
                        <span>Required By: <strong>{req.requiredBy}</strong></span>
                        <span>Beneficiaries: <strong>{req.beneficiaryType}</strong></span>
                        <span>Created: {new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-stone-900 font-mono-code">
                        {req.fulfilledQuantity} / {req.quantity} units
                      </div>
                      <span className="text-[11px] text-stone-500">
                        {req.fulfilledQuantity >= req.quantity ? 'Fully Fulfilled' : 'In ASCA Pool'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: POST REQUIREMENT FORM */}
      {subTab === 'post-requirement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm max-w-3xl mx-auto">
          <div className="mb-8 pb-6 border-b border-stone-150">
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              Post a Requirement
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Specify your target items and timeframe. ASCA prioritizes allocations using both current urgency and past shortfalls.
            </p>
          </div>

          <form onSubmit={handlePostRequirement} className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Item Title / Name
              </label>
              <input
                type="text"
                required
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="e.g. High School Physics & Chemistry Textbooks"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DonationCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Books">Books & Literature</option>
                  <option value="Clothes">Clothes & Apparel</option>
                  <option value="School Supplies">School Supplies</option>
                  <option value="Other Useful Items">Other Useful Items</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Urgency Level
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-semibold"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Required Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    setQuantity(q);
                    setWeightKg(Number((q * 0.45).toFixed(1)));
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Estimated Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Required By Date
                </label>
                <input
                  type="date"
                  required
                  value={requiredBy}
                  onChange={(e) => setRequiredBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Beneficiary Focus
                </label>
                <select
                  value={beneficiaryType}
                  onChange={(e) => setBeneficiaryType(e.target.value as BeneficiaryType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Learning Centre">Learning Centre</option>
                  <option value="Shelter">Shelter</option>
                  <option value="Children Home">Children Home</option>
                  <option value="Senior Care">Senior Care</option>
                  <option value="Rural School">Rural School</option>
                  <option value="Community Centre">Community Centre</option>
                  <option value="Disaster Relief">Disaster Relief</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                Community Context & Specific Needs
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain who will benefit and why this item is essential for your community..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold bg-blue-700 text-white hover:bg-blue-800 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Publish Requirement into ASCA Pool</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SUBTAB 3: SECTION 11 - YOUR NEED HISTORY */}
      {subTab === 'history' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-6">
            <div className="max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Section 11: Non-Profit Demand History
              </span>
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                Your Need History
              </h2>
              <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                ASCA tracks cumulative community requests versus total items delivered across sequential rounds.
              </p>
            </div>

            {/* Visual Demand vs Allocation Timeline Breakdown */}
            <div className="grid md:grid-cols-4 gap-4 p-6 rounded-2xl bg-stone-50 border border-stone-200">
              <div>
                <span className="text-xs text-stone-500 font-medium">Cumulative Demand D(i)</span>
                <div className="text-2xl font-bold text-stone-900 font-mono-code mt-1">
                  {myNgo.cumulativeDemand} kg
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Total requirements posted</p>
              </div>

              <div>
                <span className="text-xs text-stone-500 font-medium">Cumulative Allocated A(i)</span>
                <div className="text-2xl font-bold text-emerald-700 font-mono-code mt-1">
                  {myNgo.cumulativeAllocated} kg
                </div>
                <p className="text-[11px] text-emerald-600 mt-0.5">Distributed to your facility</p>
              </div>

              <div>
                <span className="text-xs text-amber-800 font-semibold">Historical Shortfall S(i)</span>
                <div className="text-2xl font-bold text-amber-900 font-mono-code mt-1">
                  {myNgo.historicalShortfall} kg
                </div>
                <p className="text-[11px] text-amber-700 mt-0.5">max(0, D - A) credit</p>
              </div>

              <div>
                <span className="text-xs text-blue-800 font-semibold">Current ASCA Priority</span>
                <div className="text-2xl font-bold text-blue-900 font-mono-code mt-1">
                  {myNgo.currentAscaPriority ? myNgo.currentAscaPriority.toFixed(3) : '0.880'}
                </div>
                <p className="text-[11px] text-blue-700 mt-0.5">High allocation tier</p>
              </div>
            </div>

            {/* Research explanation callout box */}
            <div className="p-6 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-emerald-950 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-700" />
                <h4 className="font-bold text-sm">
                  ASCA remembers this unmet requirement when evaluating future donation rounds.
                </h4>
              </div>
              <p className="text-xs text-emerald-850 leading-relaxed">
                If your organization requested 100 kg in Round 1 and received only 40 kg, the unmet 60 kg is not forgotten or discarded. 
                Instead, it forms your <strong>Historical Shortfall S(i)</strong>, raising your allocation priority weight ($\beta = 0.5$) in 
                the next sequential allocation round.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: DELIVERIES (Section 23) */}
      {subTab === 'deliveries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-900">Consignments & Deliveries</h2>
            <span className="text-xs text-stone-500">Tracking Delivery Records (ASCA-DL-XXXXX)</span>
          </div>

          {myDeliveries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-400">
              No delivery records currently dispatched to your organization.
            </div>
          ) : (
            <div className="space-y-4">
              {myDeliveries.map(del => (
                <div key={del.id} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-150">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 font-mono-code text-base">{del.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold capitalize">
                          {del.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        Consignment of {del.quantity} {del.category} ({del.weightKg} kg) allocated from Batch {del.batchId}.
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Delivery Target</span>
                      <span className="text-xs font-bold text-stone-900">{del.estimatedDeliveryDate}</span>
                    </div>
                  </div>

                  {/* Delivery Timeline */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-stone-700 block">Dispatch Journey:</span>
                    <div className="grid sm:grid-cols-4 gap-2">
                      {['allocated', 'delivery_scheduled', 'out_for_delivery', 'delivered'].map((st, i) => {
                        const isDone = del.timeline.some(t => t.status === st);
                        return (
                          <div
                            key={st}
                            className={`p-2.5 rounded-xl border text-xs text-center ${
                              isDone
                                ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-950'
                                : 'bg-stone-50 border-stone-200 text-stone-400'
                            }`}
                          >
                            <span className="capitalize">{st.replace('_', ' ')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
