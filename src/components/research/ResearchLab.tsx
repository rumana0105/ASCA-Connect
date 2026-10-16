import React, { useState, useMemo } from 'react';
import { runSequentialSimulation, runBetaSensitivityAnalysis } from '../../utils/asca';
import { 
  PolicyMetricResult, 
  AllocationPolicy, 
  SimulationConfig,
  SensitivityExperimentResult
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
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  StepForward,
  FastForward,
  Cpu,
  History,
  ShieldCheck,
  Eye,
  Layers,
  Check
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
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const ResearchLab: React.FC<{ onNavigate?: (path: string) => void; onNavigateHome?: () => void }> = ({ onNavigate }) => {
  // Simulation Configuration Controls
  const [numNgos, setNumNgos] = useState<number>(20);
  const [numRounds, setNumRounds] = useState<number>(50);
  const [supplyDemandRatio, setSupplyDemandRatio] = useState<number>(0.65);
  const [alphaWeight, setAlphaWeight] = useState<number>(0.50);
  const [betaWeight, setBetaWeight] = useState<number>(0.50);
  const [seed, setSeed] = useState<number>(42);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Active Tab within Research Lab
  const [labTab, setLabTab] = useState<'benchmarks' | 'stepper' | 'sensitivity' | 'trajectories' | 'tiers' | 'theory'>('benchmarks');

  // Multi-Round Policy Simulation Results
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

  // Round Stepper Interactive State
  const [stepperCompletedRounds, setStepperCompletedRounds] = useState<number>(50);
  const [stepperActiveRound, setStepperActiveRound] = useState<number>(1);
  const [stepperPolicy, setStepperPolicy] = useState<AllocationPolicy>('ASCA');
  const [selectedInspectorNgoId, setSelectedInspectorNgoId] = useState<string>('SIM-NGO-1');

  // Sensitivity Analysis State
  const [isRunningSensitivity, setIsRunningSensitivity] = useState<boolean>(false);
  const [sensitivityResult, setSensitivityResult] = useState<SensitivityExperimentResult>(() => {
    return runBetaSensitivityAnalysis({
      ngoCount: 20,
      roundCount: 50,
      supplyDemandRatio: 0.65,
      seed: 42,
      alpha: 0.50,
      beta: 0.50
    });
  });

  // Re-run simulation with currently selected seed and controls
  const handleRunSimulation = (keepSeed = true) => {
    setIsSimulating(true);
    setTimeout(() => {
      const activeSeed = keepSeed ? seed : Math.floor(Math.random() * 10000);
      if (!keepSeed) setSeed(activeSeed);

      const simConfig: SimulationConfig = {
        ngoCount: numNgos,
        roundCount: numRounds,
        supplyDemandRatio,
        seed: activeSeed,
        alpha: alphaWeight,
        beta: betaWeight
      };

      const res = runSequentialSimulation(simConfig);
      setSimulationResults(res);
      setStepperCompletedRounds(numRounds);
      setStepperActiveRound(1);

      // Auto update sensitivity runner on demand
      const sens = runBetaSensitivityAnalysis(simConfig);
      setSensitivityResult(sens);

      setIsSimulating(false);
    }, 120);
  };

  // Stepper handlers
  const handleStepOneRound = () => {
    if (stepperActiveRound < numRounds) {
      const nextRound = stepperActiveRound + 1;
      setStepperActiveRound(nextRound);
      if (nextRound > stepperCompletedRounds) {
        setStepperCompletedRounds(nextRound);
      }
    }
  };

  const handleRunAllRounds = () => {
    setStepperCompletedRounds(numRounds);
    setStepperActiveRound(numRounds);
  };

  const handlePrevRound = () => {
    if (stepperActiveRound > 1) {
      setStepperActiveRound(stepperActiveRound - 1);
    }
  };

  const handleNextRound = () => {
    if (stepperActiveRound < stepperCompletedRounds) {
      setStepperActiveRound(stepperActiveRound + 1);
    }
  };

  const handleResetStepper = () => {
    setStepperActiveRound(1);
  };

  const fifo = simulationResults['FIFO'];
  const greedy = simulationResults['Greedy Demand'];
  const proportional = simulationResults['Proportional'];
  const asca = simulationResults['ASCA'];

  // Current active trace for the stepper
  const activePolicyResult = simulationResults[stepperPolicy];
  const activeRoundTrace = activePolicyResult?.roundTraces?.[stepperActiveRound - 1] || activePolicyResult?.roundTraces?.[0];

  // Prepare chart data for comparative policy metrics
  const comparisonBarData = [
    {
      policy: 'FIFO',
      fullName: 'FIFO (First-Come)',
      jainsFairness: +(fifo.jainsFairnessIndex * 100).toFixed(1),
      worstOffSatisfaction: +fifo.worstOffSatisfaction.toFixed(1),
      globalMeanSatisfaction: +fifo.globalMeanSatisfaction.toFixed(1),
      peakShortfall: fifo.peakShortfallDeficit,
      zeroRounds: fifo.starvationMetrics.zeroAllocationNgoRounds,
      maxStreak: fifo.starvationMetrics.maxConsecutiveZeroStreak
    },
    {
      policy: 'Greedy Demand',
      fullName: 'Greedy Demand',
      jainsFairness: +(greedy.jainsFairnessIndex * 100).toFixed(1),
      worstOffSatisfaction: +greedy.worstOffSatisfaction.toFixed(1),
      globalMeanSatisfaction: +greedy.globalMeanSatisfaction.toFixed(1),
      peakShortfall: greedy.peakShortfallDeficit,
      zeroRounds: greedy.starvationMetrics.zeroAllocationNgoRounds,
      maxStreak: greedy.starvationMetrics.maxConsecutiveZeroStreak
    },
    {
      policy: 'Proportional',
      fullName: 'Proportional (Memoryless)',
      jainsFairness: +(proportional.jainsFairnessIndex * 100).toFixed(1),
      worstOffSatisfaction: +proportional.worstOffSatisfaction.toFixed(1),
      globalMeanSatisfaction: +proportional.globalMeanSatisfaction.toFixed(1),
      peakShortfall: proportional.peakShortfallDeficit,
      zeroRounds: proportional.starvationMetrics.zeroAllocationNgoRounds,
      maxStreak: proportional.starvationMetrics.maxConsecutiveZeroStreak
    },
    {
      policy: 'ASCA',
      fullName: 'ASCA (Adaptive Credit)',
      jainsFairness: +(asca.jainsFairnessIndex * 100).toFixed(1),
      worstOffSatisfaction: +asca.worstOffSatisfaction.toFixed(1),
      globalMeanSatisfaction: +asca.globalMeanSatisfaction.toFixed(1),
      peakShortfall: asca.peakShortfallDeficit,
      zeroRounds: asca.starvationMetrics.zeroAllocationNgoRounds,
      maxStreak: asca.starvationMetrics.maxConsecutiveZeroStreak
    }
  ];

  // Prepare trajectory data across rounds
  const roundTrajectoryData = useMemo(() => {
    const roundsToShow = Math.min(30, numRounds);
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

  // NGO Shortfall History for Inspector
  const ngoInspectorHistory = useMemo(() => {
    if (!activePolicyResult?.roundTraces) return [];
    return activePolicyResult.roundTraces.slice(0, stepperCompletedRounds).map(trace => {
      const step = trace.ngoSteps.find(s => s.ngoId === selectedInspectorNgoId);
      return {
        round: `R${trace.roundNumber}`,
        roundNum: trace.roundNumber,
        demand: step?.currentDemand || 0,
        openingShortfall: step?.openingShortfall || 0,
        allocated: step?.allocated || 0,
        closingShortfall: step?.closingShortfall || 0,
        satisfactionPct: step?.satisfactionPct || 0,
        priorityScore: step?.priorityScore || 0,
        rank: step?.rank || 0
      };
    });
  }, [activePolicyResult, selectedInspectorNgoId, stepperCompletedRounds]);

  const activeStepForSelectedNgo = activeRoundTrace?.ngoSteps.find(s => s.ngoId === selectedInspectorNgoId);

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
              Empirical evaluation of temporal fairness, starvation mitigation, and shortfall bounded growth across sequential donation distribution rounds under constrained supply.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-stone-800 p-1.5 rounded-2xl border border-stone-700 shrink-0">
            <button
              onClick={() => setLabTab('benchmarks')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                labTab === 'benchmarks' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Comparative Benchmarks
            </button>
            <button
              onClick={() => setLabTab('stepper')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                labTab === 'stepper' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Round Stepper</span>
            </button>
            <button
              onClick={() => setLabTab('sensitivity')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                labTab === 'sensitivity' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Sensitivity (β)</span>
            </button>
            <button
              onClick={() => setLabTab('trajectories')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                labTab === 'trajectories' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Trajectories
            </button>
            <button
              onClick={() => setLabTab('tiers')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                labTab === 'tiers' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Tier Parity
            </button>
            <button
              onClick={() => setLabTab('theory')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                labTab === 'theory' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
              }`}
            >
              Formulation
            </button>
          </div>
        </div>
      </div>

      {/* SIMULATION CONTROL PANEL */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-700" />
              <span>Simulation Parameters & Seed Controls</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Identical reproducible environment: same seed generates identical demand profiles across FIFO, Greedy, Proportional, and ASCA.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRunSimulation(true)}
              disabled={isSimulating}
              className="px-4 py-2.5 rounded-xl font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isSimulating ? 'Simulating...' : 'Run Simulation (Same Seed)'}</span>
            </button>
            <button
              onClick={() => handleRunSimulation(false)}
              disabled={isSimulating}
              title="Generate fresh pseudo-random seed"
              className="px-3 py-2.5 rounded-xl font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Seed</span>
            </button>
          </div>
        </div>

        {/* 4 Parameter Sliders + Seed */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <span className="text-stone-700">Supply / Demand Ratio</span>
              <span className="text-amber-800 font-mono-code">{(supplyDemandRatio * 100).toFixed(0)}% (Scarcity)</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.85"
              step="0.05"
              value={supplyDemandRatio}
              onChange={(e) => setSupplyDemandRatio(Number(e.target.value))}
              className="w-full accent-amber-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono">
              <span>30% Scarcity</span>
              <span>85% Supply</span>
            </div>
          </div>

          {/* ASCA Shortfall Weight */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-700">Shortfall Weight β (α = {(1 - betaWeight).toFixed(2)})</span>
              <span className="text-emerald-700 font-mono-code">β = {betaWeight.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="1.00"
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
              <span>0.00 (Memoryless)</span>
              <span>1.00 (Pure Shortfall)</span>
            </div>
          </div>

          {/* Reproducible Seed */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-stone-700">PRNG Seed (Deterministic)</span>
              <span className="text-stone-900 font-mono-code">Seed #{seed}</span>
            </div>
            <input
              type="number"
              min="1"
              max="99999"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value))}
              className="w-full px-2.5 py-1 text-xs border border-stone-300 rounded-lg font-mono"
            />
            <div className="text-[10px] text-stone-400 font-mono">
              Preserves identical demands across all 4 policies
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: COMPARATIVE BENCHMARKS & STARVATION METRICS */}
      {labTab === 'benchmarks' && (
        <div className="space-y-8">
          {/* 4 Research KPI Cards for ASCA */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">Jain's Fairness Index</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                  Scale [0, 1]
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
                  Starvation Mitigation
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
                  Bounded Growth
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
              <div>
                <h4 className="text-base font-bold text-stone-900">Jain's Fairness Index (%)</h4>
                <p className="text-xs text-stone-500 mt-0.5">Higher is fairer; 1.0 (100%) represents absolute equity.</p>
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
              <div>
                <h4 className="text-base font-bold text-stone-900">Worst-Off NGO Satisfaction (%)</h4>
                <p className="text-xs text-stone-500 mt-0.5">Minimum fulfillment received by any partner (Starvation mitigation index).</p>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="policy" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 70]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="worstOffSatisfaction" name="Worst-Off Satisfaction (%)" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* STARVATION METRICS COMPARISON (Phase 4 Requirement) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <span>Starvation & Zero-Allocation Metrics Audit</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Distinguishing temporary single-round zero allocation from chronic multi-round deprivation across N={numNgos} NGOs and T={numRounds} rounds.
                </p>
              </div>
              <div className="text-xs font-semibold px-3 py-1 bg-stone-100 text-stone-700 rounded-lg border border-stone-200">
                Window: Entire Sequential Horizon (T={numRounds})
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Total Zero-Allocation Events</span>
                <div className="text-2xl font-extrabold text-stone-900 font-mono-code">
                  {asca.starvationMetrics.zeroAllocationNgoRounds} <span className="text-xs text-stone-500 font-sans font-normal">NGO-rounds</span>
                </div>
                <p className="text-[10px] text-stone-400">
                  vs {fifo.starvationMetrics.zeroAllocationNgoRounds} (FIFO) | {greedy.starvationMetrics.zeroAllocationNgoRounds} (Greedy)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Rounds With &ge;1 Starved NGO</span>
                <div className="text-2xl font-extrabold text-stone-900 font-mono-code">
                  {asca.starvationMetrics.roundsWithZeroAllocation} <span className="text-xs text-stone-500 font-sans font-normal">of {numRounds}</span>
                </div>
                <p className="text-[10px] text-stone-400">
                  vs {greedy.starvationMetrics.roundsWithZeroAllocation} (Greedy) | {proportional.starvationMetrics.roundsWithZeroAllocation} (Proportional)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Repeated Zero Experience (&ge;2 rounds)</span>
                <div className="text-2xl font-extrabold text-emerald-800 font-mono-code">
                  {asca.starvationMetrics.ngosWithRepeatedZero} <span className="text-xs text-stone-500 font-sans font-normal">NGOs</span>
                </div>
                <p className="text-[10px] text-stone-400">
                  vs {fifo.starvationMetrics.ngosWithRepeatedZero} (FIFO) | {greedy.starvationMetrics.ngosWithRepeatedZero} (Greedy)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="text-[11px] font-bold text-stone-500 uppercase">Longest Consecutive Zero Streak</span>
                <div className="text-2xl font-extrabold text-emerald-800 font-mono-code">
                  {asca.starvationMetrics.maxConsecutiveZeroStreak} <span className="text-xs text-stone-500 font-sans font-normal">rounds</span>
                </div>
                <p className="text-[10px] text-stone-400">
                  vs {fifo.starvationMetrics.maxConsecutiveZeroStreak} rds (FIFO) | {greedy.starvationMetrics.maxConsecutiveZeroStreak} rds (Greedy)
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong>Scientific Clarification on Starvation Mitigation:</strong> Under extreme supply scarcity (e.g. S/D &lt; 0.50), no allocation policy can mathematically guarantee zero zero-allocation events in every discrete round. However, ASCA implements a <strong>bounded-shortfall starvation mitigation mechanism</strong>: by granting shortfall credit $S_i(t-1)$, any unfulfilled NGO rapidly rises in the priority queue, guaranteeing that zero streaks are bounded (maximum {asca.starvationMetrics.maxConsecutiveZeroStreak} round(s) vs {greedy.starvationMetrics.maxConsecutiveZeroStreak} in Greedy).
              </div>
            </div>
          </div>

          {/* Reference Comprehensive Benchmark Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div>
              <h4 className="text-base font-bold text-stone-900">
                Comprehensive Empirical Benchmark Policy Evaluation (N={numNgos}, T={numRounds}, S/D={(supplyDemandRatio*100).toFixed(0)}%, Seed: {seed})
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Evaluated under identical demand and supply vectors generated from reproducible PRNG.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 font-mono uppercase text-[11px]">
                    <th className="py-3 px-3">Policy & Formula</th>
                    <th className="py-3 px-3">Memory Mechanism</th>
                    <th className="py-3 px-3 text-right">Jain's Fairness</th>
                    <th className="py-3 px-3 text-right">Worst-Off Sat.</th>
                    <th className="py-3 px-3 text-right">Global Mean</th>
                    <th className="py-3 px-3 text-right">Peak Shortfall</th>
                    <th className="py-3 px-3 text-right">Supply Util.</th>
                    <th className="py-3 px-3 text-right">Zero NGO-Rounds</th>
                    <th className="py-3 px-3 text-right">Max Zero Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  <tr className="hover:bg-stone-50">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-stone-900">FIFO</div>
                      <div className="text-[10px] text-stone-400 font-mono">Order: index i = 0, 1...</div>
                    </td>
                    <td className="py-3.5 px-3 text-stone-500 font-mono">None (Independent)</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{fifo.jainsFairnessIndex.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-red-600 font-bold">
                      {fifo.worstOffSatisfaction.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{fifo.globalMeanSatisfaction.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{fifo.peakShortfallDeficit.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{fifo.resourceUtilization.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-red-600 font-bold">{fifo.starvationMetrics.zeroAllocationNgoRounds}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-red-600">{fifo.starvationMetrics.maxConsecutiveZeroStreak} rds</td>
                  </tr>

                  <tr className="hover:bg-stone-50">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-stone-900">Greedy Demand</div>
                      <div className="text-[10px] text-stone-400 font-mono">Sort by d_i(t) desc</div>
                    </td>
                    <td className="py-3.5 px-3 text-stone-500 font-mono">None (Instantaneous)</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{greedy.jainsFairnessIndex.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-red-600 font-bold">
                      {greedy.worstOffSatisfaction.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{greedy.globalMeanSatisfaction.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{greedy.peakShortfallDeficit.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{greedy.resourceUtilization.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-red-600 font-bold">{greedy.starvationMetrics.zeroAllocationNgoRounds}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-red-600">{greedy.starvationMetrics.maxConsecutiveZeroStreak} rds</td>
                  </tr>

                  <tr className="hover:bg-stone-50">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-stone-900">Proportional</div>
                      <div className="text-[10px] text-stone-400 font-mono">Share: (d_i / Σ d_j) · S</div>
                    </td>
                    <td className="py-3.5 px-3 text-stone-500 font-mono">None (Round Share)</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.jainsFairnessIndex.toFixed(3)}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code text-amber-700">
                      {proportional.worstOffSatisfaction.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.globalMeanSatisfaction.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.peakShortfallDeficit.toLocaleString()}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.resourceUtilization.toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.starvationMetrics.zeroAllocationNgoRounds}</td>
                    <td className="py-3.5 px-3 text-right font-mono-code">{proportional.starvationMetrics.maxConsecutiveZeroStreak} rds</td>
                  </tr>

                  <tr className="bg-emerald-50/70 hover:bg-emerald-50 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>ASCA (Adaptive Credit)</div>
                        <div className="text-[10px] text-emerald-700 font-mono font-normal">α·norm(d) + β·norm(S)</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-emerald-800 font-mono font-bold">Closing = Opening + d - a</td>
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
                      {asca.peakShortfallDeficit.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code font-bold text-emerald-800">
                      {asca.resourceUtilization.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code font-bold text-emerald-800">
                      {asca.starvationMetrics.zeroAllocationNgoRounds}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono-code font-bold text-emerald-800">
                      {asca.starvationMetrics.maxConsecutiveZeroStreak} rds
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROUND-BY-ROUND EXECUTION STEPPER & SHORTFALL MEMORY TRACE (Phases 3 & 5) */}
      {labTab === 'stepper' && (
        <div className="space-y-6">
          {/* Stepper Toolbar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-700" />
                  <span>Sequential Round-by-Round Execution Trace</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Step forward through allocation rounds, inspect demand/shortfall vectors, and verify mathematical recurrence conservation.
                </p>
              </div>

              {/* Policy selector for stepper */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Active Policy:</span>
                <select
                  value={stepperPolicy}
                  onChange={(e) => setStepperPolicy(e.target.value as AllocationPolicy)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 border border-stone-300 text-stone-800 focus:outline-emerald-600 cursor-pointer"
                >
                  <option value="ASCA">ASCA (Adaptive Credit)</option>
                  <option value="FIFO">FIFO (First-Come)</option>
                  <option value="Greedy Demand">Greedy Demand</option>
                  <option value="Proportional">Proportional</option>
                </select>
              </div>
            </div>

            {/* Controls Bar: Run 1, Run All, Next, Prev, Reset */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <button
                  id="btn-step-prev"
                  onClick={handlePrevRound}
                  disabled={stepperActiveRound <= 1}
                  className="p-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                  title="Previous Round"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="px-4 py-2 bg-white rounded-xl border border-stone-300 font-mono text-xs font-bold text-stone-800">
                  Round <span className="text-emerald-700 text-sm">{stepperActiveRound}</span> of {numRounds}
                </div>

                <button
                  id="btn-step-next"
                  onClick={handleNextRound}
                  disabled={stepperActiveRound >= stepperCompletedRounds}
                  className="p-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
                  title="Next Round"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-step-one"
                  onClick={handleStepOneRound}
                  disabled={stepperActiveRound >= numRounds}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40"
                >
                  <StepForward className="w-3.5 h-3.5" />
                  <span>Run One Round</span>
                </button>

                <button
                  id="btn-run-all"
                  onClick={handleRunAllRounds}
                  disabled={stepperActiveRound >= numRounds}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-900 text-white flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40"
                >
                  <FastForward className="w-3.5 h-3.5" />
                  <span>Run All Rounds</span>
                </button>

                <button
                  id="btn-reset-stepper"
                  onClick={handleResetStepper}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Stepper</span>
                </button>
              </div>
            </div>

            {/* Round Summary KPI Ribbon */}
            {activeRoundTrace && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-semibold text-stone-500">Available Round Supply</span>
                  <div className="text-xl font-bold font-mono-code text-stone-900 mt-1">
                    {activeRoundTrace.availableSupply.toLocaleString()} units
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-semibold text-stone-500">Total Round Demand</span>
                  <div className="text-xl font-bold font-mono-code text-amber-800 mt-1">
                    {activeRoundTrace.totalRoundDemand.toLocaleString()} units
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-semibold text-stone-500">Total Allocated Supply</span>
                  <div className="text-xl font-bold font-mono-code text-emerald-800 mt-1">
                    {activeRoundTrace.totalRoundAllocated.toLocaleString()} units
                  </div>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="text-[11px] font-semibold text-stone-500">Supply Utilization Rate</span>
                  <div className="text-xl font-bold font-mono-code text-emerald-800 mt-1">
                    {activeRoundTrace.supplyUtilizationPct}%
                  </div>
                </div>
              </div>
            )}

            {/* SHORTFALL MEMORY CONSERVATION PROOF (Phase 5 Requirement) */}
            {activeRoundTrace && (
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                      Mathematical Shortfall Memory Recurrence Audit (Round {stepperActiveRound})
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white font-mono text-[11px] font-bold">
                    Identity Verified (0 Deviation)
                  </span>
                </div>
                <div className="font-mono text-xs text-emerald-900 bg-white p-3 rounded-xl border border-emerald-200 overflow-x-auto">
                  Σ OpeningShortfall ({activeRoundTrace.openingAggregateShortfall}) + Σ NewDemand ({activeRoundTrace.totalRoundDemand}) - Σ Allocation ({activeRoundTrace.totalRoundAllocated}) = Σ ClosingShortfall ({activeRoundTrace.closingAggregateShortfall})
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Conservation Property Holds: No shortfall debt is created or destroyed arbitrarily. Closing shortfall from Round {stepperActiveRound} transitions deterministically as Opening shortfall for Round {stepperActiveRound + 1}.
                </p>
              </div>
            )}

            {/* Round Step Table */}
            {activeRoundTrace && (
              <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-mono text-[11px] border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-3">NGO Profile</th>
                      <th className="py-3 px-3">Tier</th>
                      <th className="py-3 px-3 text-right">Current Demand d_i(t)</th>
                      <th className="py-3 px-3 text-right">Opening Shortfall S_i(t-1)</th>
                      {stepperPolicy === 'ASCA' && (
                        <>
                          <th className="py-3 px-3 text-right">norm(d)</th>
                          <th className="py-3 px-3 text-right">norm(S)</th>
                          <th className="py-3 px-3 text-right">Priority Score</th>
                        </>
                      )}
                      <th className="py-3 px-3 text-center">Rank</th>
                      <th className="py-3 px-3 text-right">Allocation a_i(t)</th>
                      <th className="py-3 px-3 text-right">Remaining Demand</th>
                      <th className="py-3 px-3 text-right font-bold text-stone-900">Closing Shortfall</th>
                      <th className="py-3 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {activeRoundTrace.ngoSteps.map((step) => {
                      const isSelected = step.ngoId === selectedInspectorNgoId;
                      return (
                        <tr 
                          key={step.ngoId} 
                          onClick={() => setSelectedInspectorNgoId(step.ngoId)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-emerald-50/80 font-medium' : 'hover:bg-stone-50'
                          }`}
                        >
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-stone-900">{step.ngoName}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{step.ngoId}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              step.tier === 'High Capacity' ? 'bg-purple-100 text-purple-800' :
                              step.tier === 'Medium Capacity' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {step.tier}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono-code">{step.currentDemand}</td>
                          <td className="py-2.5 px-3 text-right font-mono-code text-stone-600">{step.openingShortfall}</td>
                          {stepperPolicy === 'ASCA' && (
                            <>
                              <td className="py-2.5 px-3 text-right font-mono-code text-stone-500">{step.normDemand}</td>
                              <td className="py-2.5 px-3 text-right font-mono-code text-stone-500">{step.normShortfall}</td>
                              <td className="py-2.5 px-3 text-right font-mono-code font-bold text-emerald-800">{step.priorityScore}</td>
                            </>
                          )}
                          <td className="py-2.5 px-3 text-center font-mono-code">#{step.rank}</td>
                          <td className="py-2.5 px-3 text-right font-mono-code font-bold text-emerald-700">{step.allocated}</td>
                          <td className="py-2.5 px-3 text-right font-mono-code text-stone-500">{step.remainingDemand}</td>
                          <td className="py-2.5 px-3 text-right font-mono-code font-bold text-stone-900">{step.closingShortfall}</td>
                          <td className="py-2.5 px-3 text-center">
                            {step.allocated === 0 ? (
                              <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                                Zero Allocation
                              </span>
                            ) : step.allocated >= step.currentDemand ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                100% Fulfilled
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                Partial ({step.satisfactionPct}%)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* INDIVIDUAL NGO SHORTFALL HISTORY INSPECTOR (Phase 3 Requirement) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-700" />
                  <span>NGO Longitudinal Shortfall History Inspector</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Inspect accumulated shortfall debt, allocation responses, and recurrence calculations across rounds for any organization.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-600">Select NGO:</span>
                <select
                  value={selectedInspectorNgoId}
                  onChange={(e) => setSelectedInspectorNgoId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-stone-100 border border-stone-300 text-stone-800 focus:outline-emerald-600 cursor-pointer"
                >
                  {activeRoundTrace?.ngoSteps.map(s => (
                    <option key={s.ngoId} value={s.ngoId}>
                      {s.ngoName} ({s.tier})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* NGO Calculation Breakdown for Current Stepper Round */}
            {activeStepForSelectedNgo && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-stone-900">
                    Step-by-Step Mathematical Derivation for {activeStepForSelectedNgo.ngoName} (Round {stepperActiveRound})
                  </span>
                  <span className="text-stone-500 font-mono">
                    Tier: {activeStepForSelectedNgo.tier} | Rank: #{activeStepForSelectedNgo.rank}
                  </span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-400">1. Priority Score Calculation</div>
                    <div className="text-stone-800 mt-1">
                      P = ({alphaWeight} · {activeStepForSelectedNgo.normDemand}) + ({betaWeight} · {activeStepForSelectedNgo.normShortfall})
                    </div>
                    <div className="font-bold text-emerald-800 mt-0.5">= {activeStepForSelectedNgo.priorityScore}</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-400">2. Allocation Constraints</div>
                    <div className="text-stone-800 mt-1">
                      min(Demand: {activeStepForSelectedNgo.currentDemand}, Supply Quota)
                    </div>
                    <div className="font-bold text-emerald-800 mt-0.5">= {activeStepForSelectedNgo.allocated} units allocated</div>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <div className="text-[10px] text-stone-400">3. Shortfall Recurrence Check</div>
                    <div className="text-stone-800 mt-1">
                      {activeStepForSelectedNgo.openingShortfall} (Open) + {activeStepForSelectedNgo.currentDemand} (d) - {activeStepForSelectedNgo.allocated} (a)
                    </div>
                    <div className="font-bold text-emerald-800 mt-0.5">= {activeStepForSelectedNgo.closingShortfall} (Close)</div>
                  </div>
                </div>
              </div>
            )}

            {/* Shortfall and Allocation Trajectory Chart for Selected NGO */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-stone-700">
                Shortfall Deficit vs. Allocation History for {activeStepForSelectedNgo?.ngoName || selectedInspectorNgoId}
              </span>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ngoInspectorHistory} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="round" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="closingShortfall" name="Closing Shortfall Debt" stroke="#ea580c" fill="#ffedd5" strokeWidth={2} />
                    <Area type="monotone" dataKey="demand" name="Demanded Units" stroke="#64748b" fill="#f1f5f9" strokeWidth={1.5} />
                    <Area type="monotone" dataKey="allocated" name="Allocated Units" stroke="#059669" fill="#d1fae5" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SENSITIVITY ANALYSIS (Phase 6 Requirement) */}
      {labTab === 'sensitivity' && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-700" />
                  <span>Beta (β) Shortfall Weight Sensitivity Experiment Runner</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Evaluate system trade-offs across 11 discrete β values in [0.0, 1.0] while strictly holding population, seed ({seed}), and demands constant.
                </p>
              </div>

              <button
                id="btn-run-sensitivity"
                onClick={() => {
                  setIsRunningSensitivity(true);
                  setTimeout(() => {
                    const res = runBetaSensitivityAnalysis({
                      ngoCount: numNgos,
                      roundCount: numRounds,
                      supplyDemandRatio,
                      seed,
                      alpha: alphaWeight,
                      beta: betaWeight
                    });
                    setSensitivityResult(res);
                    setIsRunningSensitivity(false);
                  }, 150);
                }}
                disabled={isRunningSensitivity}
                className="px-4 py-2.5 rounded-xl font-bold bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isRunningSensitivity ? 'Evaluating β Spectrum...' : 'Run β Sensitivity Analysis'}</span>
              </button>
            </div>

            {/* Empirical Summary Banner */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed">
              <strong>Empirical Findings:</strong> {sensitivityResult.summaryNotes}
            </div>

            {/* Sensitivity Trend Charts */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Fairness & Worst-off vs Beta */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-stone-900">Jain's Fairness & Worst-Off Satisfaction vs. β</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensitivityResult.points} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                      <XAxis dataKey="beta" label={{ value: 'Shortfall Weight (β)', position: 'insideBottom', offset: -5, fontSize: 10 }} tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="jainsFairnessIndex" name="Jain's Fairness Index" stroke="#047857" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="worstOffSatisfaction" name="Worst-Off Sat. (%)" stroke="#0284c7" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Peak Shortfall & Zero Allocations vs Beta */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <h4 className="text-sm font-bold text-stone-900">Peak Shortfall Deficit & Zero-Allocation NGO-Rounds vs. β</h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sensitivityResult.points} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                      <XAxis dataKey="beta" label={{ value: 'Shortfall Weight (β)', position: 'insideBottom', offset: -5, fontSize: 10 }} tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Line type="monotone" dataKey="peakShortfallDeficit" name="Peak Shortfall Deficit (units)" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="zeroAllocationNgoRounds" name="Zero-Allocation NGO-Rounds" stroke="#d97706" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sensitivity Results Table */}
            <div className="overflow-x-auto border border-stone-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-mono text-[11px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-3">β Weight</th>
                    <th className="py-3 px-3">α Weight</th>
                    <th className="py-3 px-3 text-right">Jain's Fairness</th>
                    <th className="py-3 px-3 text-right">Worst-Off Sat.</th>
                    <th className="py-3 px-3 text-right">Global Mean</th>
                    <th className="py-3 px-3 text-right">Peak Shortfall</th>
                    <th className="py-3 px-3 text-right">Zero NGO-Rounds</th>
                    <th className="py-3 px-3 text-right">Max Streak</th>
                    <th className="py-3 px-3 text-center">Regime Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {sensitivityResult.points.map((pt) => {
                    const isOptimal = pt.beta === sensitivityResult.bestFairnessBeta;
                    return (
                      <tr key={pt.beta} className={isOptimal ? 'bg-emerald-50/80 font-bold' : 'hover:bg-stone-50'}>
                        <td className="py-2.5 px-3 font-mono-code text-stone-900">β = {pt.beta.toFixed(2)}</td>
                        <td className="py-2.5 px-3 font-mono-code text-stone-500">α = {pt.alpha.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-right font-mono-code text-emerald-800">{pt.jainsFairnessIndex.toFixed(3)}</td>
                        <td className="py-2.5 px-3 text-right font-mono-code">{pt.worstOffSatisfaction.toFixed(1)}%</td>
                        <td className="py-2.5 px-3 text-right font-mono-code">{pt.globalMeanSatisfaction.toFixed(1)}%</td>
                        <td className="py-2.5 px-3 text-right font-mono-code">{pt.peakShortfallDeficit}</td>
                        <td className="py-2.5 px-3 text-right font-mono-code">{pt.zeroAllocationNgoRounds}</td>
                        <td className="py-2.5 px-3 text-right font-mono-code">{pt.maxConsecutiveZeroStreak} rds</td>
                        <td className="py-2.5 px-3 text-center text-[10px]">
                          {pt.beta === 0 ? (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">Memoryless (Greedy Vulnerability)</span>
                          ) : pt.beta >= 0.8 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Shortfall Dominant (High Backlog Bias)</span>
                          ) : isOptimal ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold">Optimal Multi-Objective Balance</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700">Balanced Adaptive Regime</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SEQUENTIAL TRAJECTORIES */}
      {labTab === 'trajectories' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div>
              <h4 className="text-lg font-bold text-stone-900">
                Peak Shortfall Deficit Trajectory Across Sequential Rounds (t = 1 to {Math.min(30, numRounds)})
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                Observe how memoryless policies allow unfulfilled deficits to compound monotonically, while ASCA triggers corrective priority.
              </p>
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

      {/* TAB 5: TIER PARITY ANALYSIS */}
      {labTab === 'tiers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
          <div>
            <h4 className="text-lg font-bold text-stone-900">
              Satisfaction Rate by NGO Capacity Tier (%)
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Verifying equity between large metropolitan facilities and grassroots learning centres under identical constrained supply.
            </p>
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

      {/* TAB 6: MATHEMATICAL FORMULATION */}
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
                Where α + β = 1.0 (Default: α = 0.50, β = 0.50). Sum-normalization ensures active demand and accumulated historical shortfall exert balanced relative pressure on [0, 1].
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
                S(i, t) = S(i, t-1) + d(i, t) - a(i, t)
              </p>
              <p className="text-stone-500 text-[11px] font-sans">
                Since allocation a(i,t) &le; d(i,t), S(i, t) &ge; S(i, t-1) &ge; 0. Shortfall memory is strictly non-negative and conserved across consecutive rounds.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs space-y-3">
              <h5 className="font-bold text-stone-900 text-sm font-sans">4. Jain's Fairness Index Metric:</h5>
              <p className="text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                J(x) = (Σ x_i)² / (n · Σ x_i²)
              </p>
              <p className="text-stone-500 text-[11px] font-sans">
                Evaluated over cumulative satisfaction ratios x_i = Σ a_i(t) / Σ d_i(t). Guarded against division by zero.
              </p>
            </div>

            {/* Direct Link to Algorithm Workbench */}
            <div className="p-6 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mt-4">
              <div className="space-y-1 text-left">
                <h5 className="font-bold text-sm text-stone-50 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-300" />
                  <span>Looking for Algorithm Pseudocode & Working Calculations?</span>
                </h5>
                <p className="text-xs text-emerald-200">
                  Access the Algorithm & Pseudocode Workbench with executable calculations for eligibility, classification, collection progress, diversion, and ASCA priority.
                </p>
              </div>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('/algorithms')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-emerald-950 hover:bg-emerald-50 transition-all shrink-0 cursor-pointer shadow-xs"
                >
                  Open Algorithm Workbench
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
