import React, { useState, useMemo } from 'react';
import { runSequentialSimulation } from '../../utils/asca';
import { 
  PolicyMetricResult, 
  AllocationPolicy, 
  SimulationConfig 
} from '../../types';
import { 
  FlaskConical, 
  Play, 
  Scale, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sliders, 
  BarChart3, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';

export const ResearchLab: React.FC = () => {
  // Simulation Controls
  const [numNgos, setNumNgos] = useState<number>(20);
  const [numRounds, setNumRounds] = useState<number>(50);
  const [supplyDemandRatio, setSupplyDemandRatio] = useState<number>(0.65);
  const [alphaWeight, setAlphaWeight] = useState<number>(0.50);
  const [betaWeight, setBetaWeight] = useState<number>(0.50);
  const [seed, setSeed] = useState<number>(42);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Active Tab within Research Lab
  const [labTab, setLabTab] = useState<'benchmarks' | 'rounds' | 'tiers' | 'theory'>('benchmarks');

  // Simulation execution results
  const [simulationResults, setSimulationResults] = useState<Record<AllocationPolicy, PolicyMetricResult>>(() => {
    return runSequentialSimulation({
      ngoCount: 20,
      roundCount: 50,
      supplyDemandRatio: 0.65,
      seed: 42,
      alpha: 0.50,
      beta: 0.50
    });
  });

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const freshSeed = Math.floor(Math.random() * 10000);
      setSeed(freshSeed);
      const res = runSequentialSimulation({
        ngoCount: numNgos,
        roundCount: numRounds,
        supplyDemandRatio,
        seed: freshSeed,
        alpha: alphaWeight,
        beta: betaWeight
      });
      setSimulationResults(res);
      setIsSimulating(false);
    }, 150);
  };

  const fifo = simulationResults['FIFO'];
  const greedy = simulationResults['Greedy Demand'];
  const proportional = simulationResults['Proportional'];
  const asca = simulationResults['ASCA'];

  // Prepare chart data for Jain's Fairness Index & Worst-Off Satisfaction
  const comparisonBarData = [
    {
      policy: 'FIFO',
      fullName: 'FIFO (First-Come)',
      jainsFairness: +(fifo.jainsFairnessIndex * 100).toFixed(1),
      worstOffSatisfaction: +fifo.worstOffSatisfaction.toFixed(1),
      globalMeanSatisfaction: +fifo.globalMeanSatisfaction.toFixed(1),
      peakShortfall: fifo.peakShortfallDeficit
    },
    {
      policy: 'Greedy Demand',
      fullName: 'Greedy Demand',
      jainsFairness: +(greedy.jainsFairnessIndex * 100).toFixed(1),
      worstOffSatisfaction: +greedy.worstOffSatisfaction.toFixed(1),
      globalMeanSatisfaction: +greedy.globalMeanSatisfaction.toFixed(1),
      peakShortfall: greedy.peakShortfallDeficit
    },
    {
      policy: 'Proportional',
      fullName: 'Proportional (Memoryless)',
      jainsFairness: +(proportional.jainsFairnessIndex * 100).toFixed(1),
      worstOffSatisfaction: +proportional.worstOffSatisfaction.toFixed(1),
      globalMeanSatisfaction: +proportional.globalMeanSatisfaction.toFixed(1),
      peakShortfall: proportional.peakShortfallDeficit
    },
    {
      policy: 'ASCA',
      fullName: 'ASCA (Our Contribution)',
      jainsFairness: +(asca.jainsFairnessIndex * 100).toFixed(1),
      worstOffSatisfaction: +asca.worstOffSatisfaction.toFixed(1),
      globalMeanSatisfaction: +asca.globalMeanSatisfaction.toFixed(1),
      peakShortfall: asca.peakShortfallDeficit
    }
  ];

  // Prepare round-by-round trajectory chart data (capped to first 25 rounds for clean visual rhythm)
  const roundTrajectoryData = useMemo(() => {
    const roundsToShow = Math.min(25, numRounds);
    const data = [];
    for (let r = 0; r < roundsToShow; r++) {
      const fSnap = fifo.shortfallOverRounds[r];
      const gSnap = greedy.shortfallOverRounds[r];
      const pSnap = proportional.shortfallOverRounds[r];
      const aSnap = asca.shortfallOverRounds[r];

      data.push({
        round: `R${r + 1}`,
        FIFO: fSnap ? fSnap.maxShortfall : 0,
        Greedy: gSnap ? gSnap.maxShortfall : 0,
        Proportional: pSnap ? pSnap.maxShortfall : 0,
        ASCA: aSnap ? aSnap.maxShortfall : 0
      });
    }
    return data;
  }, [fifo, greedy, proportional, asca, numRounds]);

  // Tier distribution comparison
  const tierComparisonData = [
    {
      tier: 'High Capacity',
      FIFO: fifo.tierDistribution.find(t => t.tier === 'High Capacity')?.satisfactionRate || 0,
      Greedy: greedy.tierDistribution.find(t => t.tier === 'High Capacity')?.satisfactionRate || 0,
      Proportional: proportional.tierDistribution.find(t => t.tier === 'High Capacity')?.satisfactionRate || 0,
      ASCA: asca.tierDistribution.find(t => t.tier === 'High Capacity')?.satisfactionRate || 0
    },
    {
      tier: 'Medium Capacity',
      FIFO: fifo.tierDistribution.find(t => t.tier === 'Medium Capacity')?.satisfactionRate || 0,
      Greedy: greedy.tierDistribution.find(t => t.tier === 'Medium Capacity')?.satisfactionRate || 0,
      Proportional: proportional.tierDistribution.find(t => t.tier === 'Medium Capacity')?.satisfactionRate || 0,
      ASCA: asca.tierDistribution.find(t => t.tier === 'Medium Capacity')?.satisfactionRate || 0
    },
    {
      tier: 'Grassroots / Small',
      FIFO: fifo.tierDistribution.find(t => t.tier === 'Grassroots / Small')?.satisfactionRate || 0,
      Greedy: greedy.tierDistribution.find(t => t.tier === 'Grassroots / Small')?.satisfactionRate || 0,
      Proportional: proportional.tierDistribution.find(t => t.tier === 'Grassroots / Small')?.satisfactionRate || 0,
      ASCA: asca.tierDistribution.find(t => t.tier === 'Grassroots / Small')?.satisfactionRate || 0
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Research Header */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-800">
              <FlaskConical className="w-4 h-4 text-emerald-400" />
              <span>MCA Research Evaluation Environment</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-50">
              Adaptive Shortfall Credit Allocation (ASCA) Lab
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Empirical evaluation of temporal fairness, starvation elimination, and shortfall bounded growth across sequential donation distribution rounds under constrained supply.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-stone-800 p-1.5 rounded-2xl border border-stone-700 shrink-0">
            <button
              onClick={() => setLabTab('benchmarks')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                labTab === 'benchmarks' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Comparative Benchmarks
            </button>
            <button
              onClick={() => setLabTab('rounds')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                labTab === 'rounds' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Sequential Trajectories
            </button>
            <button
              onClick={() => setLabTab('tiers')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                labTab === 'tiers' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Tier Parity Analysis
            </button>
            <button
              onClick={() => setLabTab('theory')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                labTab === 'theory' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Mathematical Formulation
            </button>
          </div>
        </div>
      </div>

      {/* SIMULATION CONTROL PANEL (Section 16) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <span>Simulation Parameters & Controls</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Adjust constrained supply parameters, round durations, and priority weights (Seed: {seed}).
            </p>
          </div>

          <button
            id="btn-run-simulation"
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-xl font-bold bg-emerald-750 hover:bg-emerald-850 text-white shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer bg-emerald-800 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isSimulating ? 'Simulating Rounds...' : 'Run Sequential Simulation'}</span>
          </button>
        </div>

        {/* 4 Parameter Sliders */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Num NGOs */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-700">Verified NGOs (N)</span>
              <span className="text-emerald-700 font-mono-code">{numNgos} Organizations</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              step="5"
              value={numNgos}
              onChange={(e) => setNumNgos(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>10 NGOs</span>
              <span>40 NGOs</span>
            </div>
          </div>

          {/* Num Rounds */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-700">Sequential Rounds (T)</span>
              <span className="text-emerald-700 font-mono-code">{numRounds} Rounds</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={numRounds}
              onChange={(e) => setNumRounds(Number(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>10 Rounds</span>
              <span>100 Rounds</span>
            </div>
          </div>

          {/* Supply/Demand Ratio */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-700">Supply / Demand Ratio (S/D)</span>
              <span className="text-amber-800 font-mono-code">{(supplyDemandRatio * 100).toFixed(0)}% (Scarcity)</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.80"
              step="0.05"
              value={supplyDemandRatio}
              onChange={(e) => setSupplyDemandRatio(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>30% Scarcity</span>
              <span>80% Supply</span>
            </div>
          </div>

          {/* ASCA Shortfall Weight */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-700">Shortfall Weight β (Demand α={alphaWeight.toFixed(2)})</span>
              <span className="text-emerald-700 font-mono-code">β = {betaWeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="0.90"
              step="0.05"
              value={betaWeight}
              onChange={(e) => {
                const b = Number(e.target.value);
                setBetaWeight(b);
                setAlphaWeight(Number((1 - b).toFixed(2)));
              }}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>0.10 (Low Memory)</span>
              <span>0.90 (High Credit)</span>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: COMPARATIVE BENCHMARKS (Sections 12, 13, 14, 33, 34) */}
      {labTab === 'benchmarks' && (
        <div className="space-y-8">
          {/* 4 Research KPI Cards for ASCA */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">Jain's Fairness Index</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Target &gt; 0.95
                </span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-700 font-mono-code mt-2">
                {asca.jainsFairnessIndex.toFixed(3)}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                vs {proportional.jainsFairnessIndex.toFixed(3)} (Proportional)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">Worst-Off NGO Sat.</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Anti-Starvation
                </span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-700 font-mono-code mt-2">
                {asca.worstOffSatisfaction.toFixed(1)}%
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                vs {fifo.worstOffSatisfaction.toFixed(1)}% (FIFO)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">Peak Shortfall Deficit</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                  Bounded
                </span>
              </div>
              <div className="text-3xl font-extrabold text-stone-900 font-mono-code mt-2">
                {asca.peakShortfallDeficit.toLocaleString()} units
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                vs {fifo.peakShortfallDeficit.toLocaleString()} units (FIFO)
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">Global Mean Sat.</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  High Efficiency
                </span>
              </div>
              <div className="text-3xl font-extrabold text-emerald-700 font-mono-code mt-2">
                {asca.globalMeanSatisfaction.toFixed(1)}%
              </div>
              <p className="text-[11px] text-stone-400 mt-1">
                {asca.resourceUtilization.toFixed(1)}% supply utilization
              </p>
            </div>
          </div>

          {/* Comparative Bar Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Jain's Fairness Index Chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-stone-900">Jain's Fairness Index (%)</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Higher is fairer; 1.0 (100%) represents absolute equity.</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="policy" tick={{ fontSize: 11 }} />
                    <YAxis domain={[40, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="jainsFairness" name="Jain's Index (%)" fill="#047857" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Worst-Off Satisfaction Rate Chart */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-stone-900">Worst-Off NGO Satisfaction (%)</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Minimum fulfillment received by any partner (anti-starvation guarantee).</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="policy" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 60]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="worstOffSatisfaction" name="Worst-Off Satisfaction (%)" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Reference Benchmark Table (Section 34) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-stone-900">
                  Comprehensive Benchmark Policy Evaluation (N={numNgos}, T={numRounds})
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Direct empirical comparison across sequential allocation policies under identical supply profiles.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-mono uppercase text-[11px]">
                    <th className="py-3 px-3">Policy Name</th>
                    <th className="py-3 px-3">Shortfall Memory</th>
                    <th className="py-3 px-3 text-right">Jain's Fairness Index</th>
                    <th className="py-3 px-3 text-right">Worst-Off NGO Sat.</th>
                    <th className="py-3 px-3 text-right">Global Mean Sat.</th>
                    <th className="py-3 px-3 text-right">Peak Shortfall Deficit</th>
                    <th className="py-3 px-3 text-center">Research Finding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  <tr className="hover:bg-stone-50">
                    <td className="py-3.5 px-3 font-bold text-stone-900">FIFO (First-Come, First-Served)</td>
                    <td className="py-3.5 px-3 text-stone-500 font-mono">None (Independent)</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{fifo.jainsFairnessIndex.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-red-600 font-bold">
                      {fifo.worstOffSatisfaction.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{fifo.globalMeanSatisfaction.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{fifo.peakShortfallDeficit.toLocaleString()} units</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-semibold">
                        Arbitrary Starvation
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50">
                    <td className="py-3.5 px-3 font-bold text-stone-900">Greedy Demand (Largest First)</td>
                    <td className="py-3.5 px-3 text-stone-500 font-mono">None (Current Demand Only)</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{greedy.jainsFairnessIndex.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-red-600 font-bold">
                      {greedy.worstOffSatisfaction.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{greedy.globalMeanSatisfaction.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{greedy.peakShortfallDeficit.toLocaleString()} units</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-semibold">
                        Severe Starvation
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-stone-50">
                    <td className="py-3.5 px-3 font-bold text-stone-900">Proportional Allocation</td>
                    <td className="py-3.5 px-3 text-stone-500 font-mono">None (Round Static Share)</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.jainsFairnessIndex.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-amber-700">
                      {proportional.worstOffSatisfaction.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.globalMeanSatisfaction.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.peakShortfallDeficit.toLocaleString()} units</td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-semibold">
                        Moderate Parity
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/70 hover:bg-emerald-50 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>ASCA (Adaptive Shortfall Credit)</span>
                    </td>
                    <td className="py-3.5 px-3 text-emerald-800 font-mono font-bold">Sequential Shortfall Memory</td>
                    <td className="py-3.5 px-3 text-right font-mono-code font-extrabold text-emerald-800 text-sm">
                      {asca.jainsFairnessIndex.toFixed(3)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code font-extrabold text-emerald-800 text-sm">
                      {asca.worstOffSatisfaction.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code font-bold text-emerald-800">
                      {asca.globalMeanSatisfaction.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code font-bold text-emerald-800">
                      {asca.peakShortfallDeficit.toLocaleString()} units
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        Dominant Pareto Frontier
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEQUENTIAL TRAJECTORIES */}
      {labTab === 'rounds' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-bold text-stone-900">
                  Peak Shortfall Deficit Trajectory Across Sequential Rounds (t = 1 to {Math.min(25, numRounds)})
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Observe how memoryless policies allow unfulfilled deficits to compound monotonically, while ASCA triggers corrective priority.
                </p>
              </div>
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roundTrajectoryData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                  <XAxis dataKey="round" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} label={{ value: 'Peak Shortfall (Units)', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="FIFO" stroke="#dc2626" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Greedy" stroke="#ea580c" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Proportional" stroke="#ca8a04" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="ASCA" stroke="#059669" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 leading-relaxed">
              <strong>Key Research Finding:</strong> In Greedy and FIFO mechanisms, small grassroots organizations suffer from monotonic deficit explosion because larger shelters continually consume constrained batches. In ASCA, shortfall credit exerts upward priority pressure, guaranteeing an upper bound on unfulfilled deficits.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIER PARITY ANALYSIS */}
      {labTab === 'tiers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-stone-900">
                Satisfaction Rate by NGO Capacity Tier (%)
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Verifying equity between large metropolitan facilities and grassroots learning centres.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tierComparisonData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="tier" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="FIFO" fill="#dc2626" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Greedy" fill="#ea580c" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Proportional" fill="#ca8a04" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ASCA" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB 4: MATHEMATICAL FORMULATION */}
      {labTab === 'theory' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-8 max-w-4xl mx-auto">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Formal MCA Research Formulation
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Adaptive Shortfall Credit Allocation Formulation
            </h3>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              Traditional donation systems solve allocation as independent one-shot bin-packing or greedy matching problems, ignoring temporal starvation.
            </p>
          </div>

          <div className="space-y-6 text-sm text-stone-800 leading-relaxed">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs space-y-3">
              <h5 className="font-bold text-stone-900 text-sm font-sans">1. Priority Score Function:</h5>
              <p className="text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                Priority(i, t) = α · d̂(i, t) + β · Ŝ(i, t-1)
              </p>
              <p className="text-stone-500 text-[11px] font-sans">
                Where α + β = 1.0 (Default: α = 0.50, β = 0.50).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs space-y-3">
              <h5 className="font-bold text-stone-900 text-sm font-sans">2. Sum-Normalization Terms:</h5>
              <p className="text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                d̂(i, t) = d(i, t) / Σ d(j, t)
                <br />
                Ŝ(i, t-1) = S(i, t-1) / Σ S(j, t-1)
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs space-y-3">
              <h5 className="font-bold text-stone-900 text-sm font-sans">3. Historical Shortfall Update Rule:</h5>
              <p className="text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                S(i, t) = S(i, t-1) + max(0, d(i, t) - a(i, t))
              </p>
              <p className="text-stone-500 text-[11px] font-sans">
                When an organization receives less than its demanded units in round t, the unmet quantity accumulates into credit for round t+1.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs space-y-3">
              <h5 className="font-bold text-stone-900 text-sm font-sans">4. Jain's Fairness Index Metric:</h5>
              <p className="text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                J(x) = (Σ x_i)² / (n · Σ x_i²)
              </p>
              <p className="text-stone-500 text-[11px] font-sans">
                Evaluated over satisfaction ratios x_i = A(i) / D(i).
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
