import {
  NGORequirement,
  NGO,
  AllocationExplanation,
  PolicyMetricResult,
  AllocationPolicy,
  SimulationConfig
} from '../types';

/**
 * Normalizes an array of numbers using sum-normalization.
 * If all values are 0, returns equal distributions or zeros.
 */
export function normalizeValues(values: number[]): number[] {
  const sum = values.reduce((acc, v) => acc + Math.max(0, v), 0);
  if (sum === 0) {
    const nonZeroCount = values.length;
    return values.map(() => (nonZeroCount > 0 ? 1 / nonZeroCount : 0));
  }
  return values.map(v => Math.max(0, v) / sum);
}

/**
 * Calculates Jain's Fairness Index:
 * JFI = (Σxᵢ)² / (n × Σxᵢ²)
 * where xᵢ is the satisfaction ratio (allocated / demanded) of organization i.
 */
export function calculateJainsFairnessIndex(satisfactions: number[]): number {
  const n = satisfactions.length;
  if (n === 0) return 0;
  
  const sum = satisfactions.reduce((acc, x) => acc + x, 0);
  const sumSquares = satisfactions.reduce((acc, x) => acc + x * x, 0);
  
  if (sumSquares === 0) return 0;
  
  const jfi = (sum * sum) / (n * sumSquares);
  return Math.min(1, Math.max(0, Number(jfi.toFixed(4))));
}

export interface AscaCandidate {
  ngoId: string;
  ngoName: string;
  requirementId: string;
  item: string;
  currentDemand: number;
  historicalShortfall: number;
}

export interface AscaAllocationResult {
  explanations: AllocationExplanation[];
  totalAllocated: number;
  remainingBatchQuantity: number;
}

/**
 * Executes Adaptive Shortfall Credit Allocation (ASCA) for an incoming batch
 * Priority(i) = alpha * normalized_demand(i) + beta * normalized_shortfall(i)
 * alpha = 0.5, beta = 0.5
 */
export function calculateAscaPriorities(
  candidates: AscaCandidate[],
  availableQuantity: number,
  alpha = 0.5,
  beta = 0.5
): AscaAllocationResult {
  if (candidates.length === 0 || availableQuantity <= 0) {
    return { explanations: [], totalAllocated: 0, remainingBatchQuantity: availableQuantity };
  }

  const demands = candidates.map(c => c.currentDemand);
  const shortfalls = candidates.map(c => c.historicalShortfall);

  const normDemands = normalizeValues(demands);
  const normShortfalls = normalizeValues(shortfalls);

  // Compute Priority(i) for each candidate
  const scored = candidates.map((candidate, idx) => {
    const normD = normDemands[idx];
    const normS = normShortfalls[idx];
    const priority = Number((alpha * normD + beta * normS).toFixed(4));
    return {
      ...candidate,
      normalizedDemand: Number(normD.toFixed(4)),
      normalizedShortfall: Number(normS.toFixed(4)),
      ascaPriority: priority,
      alpha,
      beta
    };
  });

  // Rank candidate NGOs descending by ASCA priority score
  scored.sort((a, b) => b.ascaPriority - a.ascaPriority);

  let remaining = availableQuantity;
  let totalAllocated = 0;

  const explanations: AllocationExplanation[] = scored.map((c, rankIdx) => {
    // Allocate up to current demand, constrained by remaining available quantity
    // Weighted share or waterfilling prioritized by rank
    const desired = c.currentDemand;
    let allocated = 0;

    if (remaining > 0) {
      allocated = Math.min(remaining, desired);
      remaining -= allocated;
      totalAllocated += allocated;
    }

    // Weight ratio conversion (approx 1 unit = 0.35kg - 1.2kg depending on category)
    const weightKg = Number((allocated * 0.45).toFixed(1));

    // Construct human-readable explanation of priority
    let humanExplanation = '';
    if (c.historicalShortfall > 0 && c.normalizedShortfall > 0.15) {
      humanExplanation = `Ranked #${rankIdx + 1} with high ASCA score (${c.ascaPriority}) due to accumulated historical shortfall (${c.historicalShortfall} units) alongside active demand (${c.currentDemand} units).`;
    } else if (c.currentDemand > 0 && c.normalizedDemand > 0.25) {
      humanExplanation = `Ranked #${rankIdx + 1} driven primarily by urgent current community requirement (${c.currentDemand} units) with priority weight of ${c.ascaPriority}.`;
    } else {
      humanExplanation = `Ranked #${rankIdx + 1} with balanced demand (${c.currentDemand} units) and baseline historical credit (${c.historicalShortfall} units).`;
    }

    return {
      ngoId: c.ngoId,
      ngoName: c.ngoName,
      requirementId: c.requirementId,
      item: c.item,
      currentDemand: c.currentDemand,
      normalizedDemand: c.normalizedDemand,
      historicalShortfall: c.historicalShortfall,
      normalizedShortfall: c.normalizedShortfall,
      ascaPriority: c.ascaPriority,
      alpha: c.alpha,
      beta: c.beta,
      rank: rankIdx + 1,
      allocatedQuantity: allocated,
      allocatedWeightKg: weightKg,
      humanExplanation
    };
  });

  return {
    explanations,
    totalAllocated,
    remainingBatchQuantity: remaining
  };
}

/**
 * Multi-Round Policy Simulator comparing FIFO, Greedy Demand, Proportional, and ASCA
 */
export function runSequentialSimulation(config: SimulationConfig): Record<AllocationPolicy, PolicyMetricResult> {
  const { ngoCount = 20, roundCount = 50, supplyDemandRatio = 0.65, seed = 42, alpha = 0.5, beta = 0.5 } = config;

  // Simple pseudo-random generator with seed for reproducible research runs
  let currentSeed = seed;
  function random(): number {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  }

  // Define NGO profiles with varying baseline capacity (large vs grassroots)
  interface SimNGO {
    id: string;
    name: string;
    tier: 'High Capacity' | 'Medium Capacity' | 'Grassroots / Small';
    baseDemand: number;
    variance: number;
  }

  const ngos: SimNGO[] = [];
  for (let i = 0; i < ngoCount; i++) {
    let tier: SimNGO['tier'] = 'Grassroots / Small';
    let baseDemand = 30 + Math.floor(random() * 25);
    let variance = 10;

    if (i < 4) {
      tier = 'High Capacity';
      baseDemand = 120 + Math.floor(random() * 60);
      variance = 30;
    } else if (i < 10) {
      tier = 'Medium Capacity';
      baseDemand = 60 + Math.floor(random() * 30);
      variance = 15;
    }

    ngos.push({
      id: `SIM-NGO-${i + 1}`,
      name: `Organization ${String.fromCharCode(65 + (i % 26))}${i >= 26 ? Math.floor(i / 26) : ''}`,
      tier,
      baseDemand,
      variance
    });
  }

  // Generate identical demand profiles for each round across all policies
  const roundDemands: number[][] = [];
  const roundSupplies: number[] = [];

  for (let r = 0; r < roundCount; r++) {
    const demandsForRound: number[] = [];
    let totalRoundDemand = 0;

    for (let i = 0; i < ngoCount; i++) {
      const ngo = ngos[i];
      const delta = (random() * 2 - 1) * ngo.variance;
      const demand = Math.max(10, Math.round(ngo.baseDemand + delta));
      demandsForRound.push(demand);
      totalRoundDemand += demand;
    }

    roundDemands.push(demandsForRound);
    // Supply constrained by supplyDemandRatio (e.g. 65% of demand)
    const supply = Math.round(totalRoundDemand * supplyDemandRatio);
    roundSupplies.push(supply);
  }

  // Simulation execution for a specific policy
  function simulatePolicy(policy: AllocationPolicy): PolicyMetricResult {
    const cumulativeDemanded = new Array(ngoCount).fill(0);
    const cumulativeAllocated = new Array(ngoCount).fill(0);
    const shortfallHistory: { round: number; avgShortfall: number; maxShortfall: number }[] = [];

    let totalGlobalSupply = 0;
    let totalGlobalAllocated = 0;

    for (let r = 0; r < roundCount; r++) {
      const demands = roundDemands[r];
      const supply = roundSupplies[r];
      totalGlobalSupply += supply;

      // Update cumulative demand
      for (let i = 0; i < ngoCount; i++) {
        cumulativeDemanded[i] += demands[i];
      }

      // Calculate current historical shortfall S(i) = max(0, D(i) - A(i))
      const currentShortfalls = cumulativeDemanded.map((D, i) => Math.max(0, D - cumulativeAllocated[i]));

      let roundAllocations = new Array(ngoCount).fill(0);
      let remSupply = supply;

      if (policy === 'FIFO') {
        // First come first served in arbitrary order
        for (let i = 0; i < ngoCount; i++) {
          if (remSupply <= 0) break;
          const toAlloc = Math.min(demands[i], remSupply);
          roundAllocations[i] = toAlloc;
          remSupply -= toAlloc;
        }
      } else if (policy === 'Greedy Demand') {
        // Fulfill highest current demand first
        const indices = Array.from({ length: ngoCount }, (_, i) => i);
        indices.sort((a, b) => demands[b] - demands[a]);

        for (const idx of indices) {
          if (remSupply <= 0) break;
          const toAlloc = Math.min(demands[idx], remSupply);
          roundAllocations[idx] = toAlloc;
          remSupply -= toAlloc;
        }
      } else if (policy === 'Proportional') {
        // Proportional to current demand
        const totalRoundDemand = demands.reduce((a, b) => a + b, 0);
        if (totalRoundDemand > 0) {
          for (let i = 0; i < ngoCount; i++) {
            const share = (demands[i] / totalRoundDemand) * supply;
            const toAlloc = Math.min(demands[i], Math.floor(share));
            roundAllocations[i] = toAlloc;
            remSupply -= toAlloc;
          }
          // Distribute any remainder
          for (let i = 0; i < ngoCount && remSupply > 0; i++) {
            if (roundAllocations[i] < demands[i]) {
              roundAllocations[i] += 1;
              remSupply -= 1;
            }
          }
        }
      } else if (policy === 'ASCA') {
        // ASCA: Priority(i) = alpha * norm_d + beta * norm_S
        const normDemands = normalizeValues(demands);
        const normShortfalls = normalizeValues(currentShortfalls);

        const priorities = demands.map((_, i) => {
          return alpha * normDemands[i] + beta * normShortfalls[i];
        });

        // Rank by priority descending
        const indices = Array.from({ length: ngoCount }, (_, i) => i);
        indices.sort((a, b) => priorities[b] - priorities[a]);

        for (const idx of indices) {
          if (remSupply <= 0) break;
          const toAlloc = Math.min(demands[idx], remSupply);
          roundAllocations[idx] = toAlloc;
          remSupply -= toAlloc;
        }
      }

      // Update cumulative allocated
      for (let i = 0; i < ngoCount; i++) {
        cumulativeAllocated[i] += roundAllocations[i];
        totalGlobalAllocated += roundAllocations[i];
      }

      // Record shortfall metrics for this round
      const newShortfalls = cumulativeDemanded.map((D, i) => Math.max(0, D - cumulativeAllocated[i]));
      const avgShortfall = newShortfalls.reduce((a, b) => a + b, 0) / ngoCount;
      const maxShortfall = Math.max(...newShortfalls);

      shortfallHistory.push({
        round: r + 1,
        avgShortfall: Number(avgShortfall.toFixed(1)),
        maxShortfall
      });
    }

    // Compute final outcome metrics
    const satisfactionRatios = cumulativeDemanded.map((D, i) => {
      if (D === 0) return 1;
      return Math.min(1, cumulativeAllocated[i] / D);
    });

    const jfi = calculateJainsFairnessIndex(satisfactionRatios);
    const worstOff = Math.min(...satisfactionRatios) * 100;
    const globalMean = (satisfactionRatios.reduce((a, b) => a + b, 0) / ngoCount) * 100;
    const peakShortfall = Math.max(...cumulativeDemanded.map((D, i) => Math.max(0, D - cumulativeAllocated[i])));
    const utilization = totalGlobalSupply > 0 ? (totalGlobalAllocated / totalGlobalSupply) * 100 : 0;

    // Group satisfaction by NGO capacity tier
    const tierGroups: Record<string, number[]> = {
      'High Capacity': [],
      'Medium Capacity': [],
      'Grassroots / Small': []
    };

    ngos.forEach((ngo, idx) => {
      tierGroups[ngo.tier].push(satisfactionRatios[idx]);
    });

    const tierDistribution = Object.keys(tierGroups).map(tier => {
      const arr = tierGroups[tier];
      const avg = arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length) * 100 : 0;
      return {
        tier,
        satisfactionRate: Number(avg.toFixed(1))
      };
    });

    return {
      policy,
      jainsFairnessIndex: jfi,
      worstOffSatisfaction: Number(worstOff.toFixed(1)),
      globalMeanSatisfaction: Number(globalMean.toFixed(1)),
      peakShortfallDeficit: peakShortfall,
      resourceUtilization: Number(utilization.toFixed(1)),
      roundsCompleted: roundCount,
      shortfallOverRounds: shortfallHistory,
      tierDistribution
    };
  }

  return {
    'FIFO': simulatePolicy('FIFO'),
    'Greedy Demand': simulatePolicy('Greedy Demand'),
    'Proportional': simulatePolicy('Proportional'),
    'ASCA': simulatePolicy('ASCA')
  };
}
