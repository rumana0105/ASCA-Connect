import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  NGO, 
  Donation, 
  DonationBatch, 
  DonationCategory, 
  AuditLog,
  CollectionRun
} from '../../types';
import { 
  calculateAscaPriorities 
} from '../../utils/asca';
import { 
  ShieldCheck, 
  Building2, 
  Package, 
  Scale, 
  Truck, 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Plus, 
  Filter, 
  Sparkles, 
  ArrowRight,
  Boxes,
  FileCheck,
  AlertCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    ngos, 
    donations, 
    requirements, 
    batches, 
    allocations, 
    collectionRuns, 
    deliveries, 
    auditLogs,
    verifyNgo,
    reviewDonation,
    schedulePickup,
    createBatch,
    executeAllocation,
    updateDeliveryStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'ngos' | 'donations' | 'batches' | 'allocation-engine' | 'logistics' | 'audit'
  >('overview');

  // Filter state
  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [selectedCategory, setSelectedCategory] = useState<DonationCategory>('Books');
  const [allocationSuccessMsg, setAllocationSuccessMsg] = useState<string | null>(null);

  // Aggregates
  const totalDonors = new Set(donations.map(d => d.donorEmail)).size;
  const verifiedNgos = ngos.filter(n => n.status === 'verified').length;
  const pendingNgos = ngos.filter(n => n.status === 'pending').length;
  const activeDonationsCount = donations.filter(d => d.status !== 'delivered' && d.status !== 'rejected').length;
  const availableBatchesCount = batches.filter(b => b.status === 'available').length;
  const pendingPickupsCount = donations.filter(d => d.status === 'approved' || d.status === 'pickup_scheduled').length;
  const pendingAllocationsCount = batches.filter(b => b.status === 'available').length;
  const completedDeliveriesCount = deliveries.filter(d => d.status === 'delivered').length;

  // For Allocation Engine view
  const currentBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  
  // Compute real-time ASCA candidate metrics for display
  const activeReqs = requirements.filter(r => r.status === 'active' || r.status === 'partially_fulfilled');
  const ascaCandidateInputs = activeReqs.map(r => {
    const ngo = ngos.find(n => n.id === r.ngoId);
    return {
      ngoId: r.ngoId,
      ngoName: r.ngoName,
      requirementId: r.id,
      item: r.item,
      currentDemand: Math.max(10, r.quantity - r.fulfilledQuantity),
      historicalShortfall: ngo ? ngo.historicalShortfall : 20
    };
  });

  const ascaAllocationResult = calculateAscaPriorities(
    ascaCandidateInputs,
    currentBatch ? currentBatch.itemCount : 50,
    0.5,
    0.5
  );
  const ascaCandidates = ascaAllocationResult.explanations;

  const handleRunBatchAllocation = () => {
    if (!currentBatch || currentBatch.status !== 'available') return;

    const result = executeAllocation(currentBatch.id, 0.5, 0.5);
    if (result) {
      setAllocationSuccessMsg(
        `Successfully allocated Batch ${currentBatch.id} (${currentBatch.totalWeightKg} kg) across ${result.allocations.length} verified NGOs according to ASCA priority weights!`
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2 border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>Admin Operations & Research Verification</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            Sequential Donation Operations
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Manage grassroots partner vetting, physical logistics, batch grouping, and execute ASCA allocations.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'ngos', label: `NGOs (${pendingNgos} Pending)` },
            { id: 'donations', label: 'Donations' },
            { id: 'batches', label: 'Batches' },
            { id: 'allocation-engine', label: 'ASCA Engine', highlight: true },
            { id: 'logistics', label: 'Logistics' },
            { id: 'audit', label: 'Audit Trail' }
          ].map(tab => (
            <button
              key={tab.id}
              id={`admin-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? tab.highlight 
                    ? 'bg-emerald-700 text-white shadow-xs' 
                    : 'bg-white text-stone-900 shadow-xs'
                  : tab.highlight
                  ? 'text-emerald-800 hover:bg-emerald-50'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC CARDS (8 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block">Total Donors</span>
          <span className="text-xl font-bold font-mono-code text-stone-900">{totalDonors}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block">Verified NGOs</span>
          <span className="text-xl font-bold font-mono-code text-emerald-700">{verifiedNgos}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block">Pending NGOs</span>
          <span className="text-xl font-bold font-mono-code text-amber-700">{pendingNgos}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block">Active Donations</span>
          <span className="text-xl font-bold font-mono-code text-stone-900">{activeDonationsCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block">Available Batches</span>
          <span className="text-xl font-bold font-mono-code text-emerald-800">{availableBatchesCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block">Pending Pickups</span>
          <span className="text-xl font-bold font-mono-code text-blue-700">{pendingPickupsCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block">Pending Allocs</span>
          <span className="text-xl font-bold font-mono-code text-indigo-700">{pendingAllocationsCount}</span>
        </div>
        <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-xs">
          <span className="text-[11px] font-medium text-stone-300 block">Delivered</span>
          <span className="text-xl font-bold font-mono-code text-emerald-400">{completedDeliveriesCount}</span>
        </div>
      </div>

      {/* SUBTAB: ALLOCATION ENGINE (CRITICAL RESEARCH UI - Section 21, 22) */}
      {activeTab === 'allocation-engine' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-900 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 font-mono-code">
                    ASCA Sequential Engine
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Adaptive Shortfall Credit Allocation Execution
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Priority formula: <code className="font-mono text-emerald-300 font-bold">Priority(i) = 0.5 × d̂(i) + 0.5 × Ŝ(i)</code>.
                  Select an available physical batch and run the fairness optimization.
                </p>
              </div>

              {/* Action */}
              <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 text-right space-y-3">
                <div>
                  <span className="text-xs text-stone-300 block">Selected Batch for Distribution</span>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="mt-1 px-3 py-1.5 rounded-lg bg-stone-900 text-white border border-stone-700 text-xs font-bold font-mono-code"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.id} — {b.category} ({b.totalWeightKg} kg, {b.status})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  id="btn-execute-asca-allocation"
                  onClick={handleRunBatchAllocation}
                  disabled={!currentBatch || currentBatch.status !== 'available'}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    currentBatch?.status === 'available'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-md font-extrabold'
                      : 'bg-stone-700 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>
                    {currentBatch?.status === 'available'
                      ? `Execute ASCA on ${currentBatch.id}`
                      : 'Batch Already Allocated'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {allocationSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold">{allocationSuccessMsg}</span>
              </div>
              <button
                onClick={() => setAllocationSuccessMsg(null)}
                className="text-xs text-stone-500 hover:text-stone-800 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* ASCA Priority Evaluation Table (Section 21) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Candidate NGOs Priority Scores (Round Evaluation)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Sum-normalized demand and historical shortfall metrics computed for verified non-profits.
                </p>
              </div>
              <div className="text-xs text-stone-400 font-mono-code">
                Weights: α = 0.5 (Demand) | β = 0.5 (Shortfall)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-mono text-[11px] uppercase">
                    <th className="py-3 px-2">Rank</th>
                    <th className="py-3 px-2">NGO Partner</th>
                    <th className="py-3 px-2">Beneficiary</th>
                    <th className="py-3 px-2 text-right">Current Demand d(i)</th>
                    <th className="py-3 px-2 text-right">Shortfall S(i)</th>
                    <th className="py-3 px-2 text-right">Norm Demand d̂(i)</th>
                    <th className="py-3 px-2 text-right">Norm Shortfall Ŝ(i)</th>
                    <th className="py-3 px-2 text-right text-emerald-700 font-bold">ASCA Priority</th>
                    <th className="py-3 px-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {ascaCandidates.map((cand, idx) => (
                    <tr key={cand.ngoId + cand.requirementId} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-2 font-mono-code font-bold text-stone-900">
                        #{cand.rank}
                      </td>
                      <td className="py-3 px-2">
                        <span className="font-semibold text-stone-900 block">{cand.ngoName}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{cand.ngoId} • {cand.item}</span>
                      </td>
                      <td className="py-3 px-2 text-stone-600">
                        {cand.allocatedQuantity} units allocated
                      </td>
                      <td className="py-3 px-2 text-right font-mono-code font-medium text-stone-900">
                        {cand.currentDemand} units
                      </td>
                      <td className="py-3 px-2 text-right font-mono-code font-semibold text-amber-800">
                        {cand.historicalShortfall} units
                      </td>
                      <td className="py-3 px-2 text-right font-mono-code text-stone-600">
                        {cand.normalizedDemand.toFixed(4)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono-code text-stone-600">
                        {cand.normalizedShortfall.toFixed(4)}
                      </td>
                      <td className="py-3 px-2 text-right font-mono-code font-extrabold text-emerald-700 text-sm">
                        {cand.ascaPriority.toFixed(4)}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Eligible
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Quick Batching */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="font-bold text-stone-900 text-base">Active Donation Batches</h3>
                <button
                  onClick={() => setActiveTab('batches')}
                  className="text-xs text-emerald-700 font-semibold hover:underline"
                >
                  Manage Batches
                </button>
              </div>
              <div className="space-y-3">
                {batches.slice(0, 3).map(b => (
                  <div key={b.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-150 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm font-mono-code">{b.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-medium">
                          {b.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">
                        {b.itemCount} items • {b.totalWeightKg} kg • Condition: {b.conditionVerified ? 'Checked' : 'Pending'}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold capitalize ${
                      b.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* NGO Approvals Needed */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="font-bold text-stone-900 text-base">NGOs Awaiting Vetting</h3>
                <button
                  onClick={() => setActiveTab('ngos')}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  View All ({pendingNgos})
                </button>
              </div>
              <div className="space-y-3">
                {ngos.filter(n => n.status === 'pending').slice(0, 3).map(n => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 text-sm block">{n.name}</span>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {n.beneficiaryType} • Cert: {n.registrationCertNo}
                      </p>
                    </div>
                    <button
                      onClick={() => verifyNgo(n.id, 'verified')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs"
                    >
                      Verify
                    </button>
                  </div>
                ))}
                {pendingNgos === 0 && (
                  <p className="text-xs text-stone-400 text-center py-4">All non-profit applicants are vetted.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: NGOS (Section 18) */}
      {activeTab === 'ngos' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Registered Non-Profit Organizations</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Vetted grassroots organizations with verified community registration records.
              </p>
            </div>
            <span className="text-xs font-semibold text-stone-500">
              Total: {ngos.length} NGOs
            </span>
          </div>

          <div className="divide-y divide-stone-150">
            {ngos.map(ngo => (
              <div key={ngo.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm sm:text-base">{ngo.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono">
                      {ngo.id}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold uppercase ${
                      ngo.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                      ngo.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ngo.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Contact: {ngo.contactPerson} ({ngo.email}) • {ngo.address}
                  </p>
                  <div className="text-[11px] text-stone-400 mt-1 flex flex-wrap gap-3">
                    <span>Beneficiaries: <strong>{ngo.beneficiaryType}</strong></span>
                    <span>Demand: <strong>{ngo.currentDemand} kg</strong></span>
                    <span>Historical Shortfall: <strong className="text-amber-800">{ngo.historicalShortfall} kg</strong></span>
                    <span>Allocated: <strong>{ngo.cumulativeAllocated} kg</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {ngo.status === 'pending' && (
                    <>
                      <button
                        onClick={() => verifyNgo(ngo.id, 'verified')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => verifyNgo(ngo.id, 'rejected')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-200 text-stone-700 hover:bg-stone-300"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {ngo.status === 'verified' && (
                    <button
                      onClick={() => verifyNgo(ngo.id, 'suspended')}
                      className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      Suspend
                    </button>
                  )}
                  {ngo.status === 'suspended' && (
                    <button
                      onClick={() => verifyNgo(ngo.id, 'verified')}
                      className="px-2.5 py-1 text-xs text-emerald-700 hover:bg-emerald-50 rounded-lg"
                    >
                      Re-activate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: DONATIONS (Section 19) */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Donation Intake & Quality Review</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Review submitted items, condition usability, and assign scheduled pickup runs.
              </p>
            </div>
            <span className="text-xs text-stone-500 font-mono-code">
              {donations.length} total entries
            </span>
          </div>

          <div className="divide-y divide-stone-150">
            {donations.map(don => (
              <div key={don.id} className="py-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 font-mono-code">{don.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 font-medium">
                      {don.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                      don.condition === 'Usable' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Condition: {don.condition}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 capitalize">
                      {don.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    {don.donorName} ({don.donorEmail}) • {don.quantity} items ({don.approximateWeightKg} kg)
                  </p>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Address: {don.pickupAddress} • Pref Date: {don.preferredPickupDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {don.status === 'submitted' && (
                    <>
                      <button
                        onClick={() => reviewDonation(don.id, 'approved', 'Verified good condition.')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewDonation(don.id, 'rejected', 'Condition unsuitable for reuse.')}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-200 text-stone-700 hover:bg-stone-300"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {don.status === 'approved' && (
                    <button
                      onClick={() => schedulePickup(don.id, '2026-09-12', '10:00 - 13:00')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Schedule Pickup</span>
                    </button>
                  )}

                  {don.pickupToken && (
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 uppercase font-mono block">Token</span>
                      <span className="text-xs font-bold font-mono-code text-stone-900">{don.pickupToken}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: BATCHES (Section 20) */}
      {activeTab === 'batches' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Donation Batches (Physical Grouping)</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Collected donations are consolidated into category batches ready for fair distribution.
                </p>
              </div>

              {/* Create Batch Trigger */}
              <button
                onClick={() => {
                  createBatch({
                    category: 'Books',
                    itemCount: 40,
                    totalWeightKg: 18.0,
                    donationIds: ['DON-2026-1042']
                  });
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Consolidate New Batch</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {batches.map(batch => (
                <div key={batch.id} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/60 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold font-mono-code text-stone-900">{batch.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
                      batch.status === 'available' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                    }`}>
                      {batch.status}
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1">
                    <p>Category: <strong className="text-stone-900">{batch.category}</strong></p>
                    <p>Total Items: <strong className="text-stone-900">{batch.itemCount} units</strong></p>
                    <p>Weight: <strong className="text-stone-900">{batch.totalWeightKg} kg</strong></p>
                    <p>Condition Check: <strong className="text-emerald-700">Passed</strong></p>
                  </div>

                  <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-mono">
                      {batch.donationIds.length} donations included
                    </span>
                    {batch.status === 'available' && (
                      <button
                        onClick={() => {
                          setSelectedBatchId(batch.id);
                          setActiveTab('allocation-engine');
                        }}
                        className="text-xs font-bold text-emerald-800 hover:underline"
                      >
                        Allocate via ASCA →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: LOGISTICS (Section 23) */}
      {activeTab === 'logistics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Doorstep Logistics & Collection Runs</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Cluster neighboring donor addresses into optimized vehicle routes (Section 23).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {collectionRuns.map(run => (
                <div key={run.id} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-700" />
                      <span className="font-bold text-stone-900 font-mono-code">{run.id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-medium">
                        Driver: {run.driverName}
                      </span>
                    </div>
                    <span className="text-xs font-bold font-mono-code text-stone-700 bg-white px-2.5 py-1 rounded border border-stone-200">
                      Target: {run.scheduledDate}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600">
                    Vehicle: {run.vehiclePlate} • {run.donationsCount} stops scheduled in this run.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-stone-500">Pickups: {run.donationIds.join(', ')}</span>
                    <span className="font-semibold text-emerald-700 capitalize">{run.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: AUDIT TRAIL (Section 24) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-stone-900">Immutable System Audit Log</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Every NGO verification, batch grouping, ASCA priority calculation, and physical delivery recorded.
              </p>
            </div>
            <span className="text-xs text-stone-400 font-mono-code">
              {auditLogs.length} events recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-mono text-[11px] uppercase">
                  <th className="py-2.5 px-2">Timestamp</th>
                  <th className="py-2.5 px-2">Action</th>
                  <th className="py-2.5 px-2">Entity</th>
                  <th className="py-2.5 px-2">User / Actor</th>
                  <th className="py-2.5 px-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-stone-50">
                    <td className="py-3 px-2 font-mono text-stone-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-2 font-bold text-stone-900 font-mono">
                      {log.action}
                    </td>
                    <td className="py-3 px-2 text-stone-700">
                      {log.entityType} ({log.entityId})
                    </td>
                    <td className="py-3 px-2 text-stone-600">
                      {log.performedBy}
                    </td>
                    <td className="py-3 px-2 text-stone-600 max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
