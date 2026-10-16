/**
 * ASCA Platform - Core Mathematical and Reverse Logistics Algorithms
 * 
 * Formal implementations of the core MCA project algorithms:
 * 1. Donation Eligibility & Validation Algorithm
 * 2. Material Classification Algorithm (Reuse vs. Recycling vs. Review)
 * 3. Collection Progress & Reverse Logistics Algorithm
 * 4. Circular Material Diversion & Reuse/Recycling Impact Algorithm
 * 5. Adaptive Shortfall Credit Allocation (ASCA) Core Priority Algorithm
 */

// ============================================================================
// 1. DONATION ELIGIBILITY ALGORITHM
// ============================================================================

export interface EligibilityInput {
  category: 'Clothes' | 'Books' | 'School Supplies' | 'Other Useful Items';
  quantity: number;
  approximateWeightKg: number;
  condition: 'Usable' | 'Needs Sorting' | 'Not Suitable';
  cityDistanceKm: number;
  minDispatchWeightKg?: number;
  minDispatchQuantity?: number;
  maxServiceDistanceKm?: number;
}

export interface EligibilityResult {
  isValid: boolean;
  isEligible: boolean;
  status: 'Eligible for Doorstep Pickup' | 'Eligible for Hub Drop-off' | 'Ineligible for Redistribution';
  unitWeightRatio: number;
  steps: string[];
  reason: string;
  errorMessage?: string;
  recommendation: string;
}

export function evaluateDonationEligibility(input: EligibilityInput): EligibilityResult {
  const steps: string[] = [];
  const minWeight = input.minDispatchWeightKg ?? 5.0;
  const minQty = input.minDispatchQuantity ?? 15;
  const maxDist = input.maxServiceDistanceKm ?? 30.0;

  // Step 1: Input Validation
  steps.push(`Step 1: Input Validation - Checking input positivity and ranges.`);
  if (isNaN(input.quantity) || input.quantity <= 0) {
    return {
      isValid: false,
      isEligible: false,
      status: 'Ineligible for Redistribution',
      unitWeightRatio: 0,
      steps: [...steps, `Error: Quantity must be a positive integer greater than zero (received ${input.quantity}).`],
      reason: 'Validation failed: Invalid quantity entered.',
      errorMessage: 'Quantity must be a positive number greater than 0.',
      recommendation: 'Please enter a valid quantity of items.'
    };
  }

  if (isNaN(input.approximateWeightKg) || input.approximateWeightKg <= 0) {
    return {
      isValid: false,
      isEligible: false,
      status: 'Ineligible for Redistribution',
      unitWeightRatio: 0,
      steps: [...steps, `Error: Estimated weight must be greater than 0 kg (received ${input.approximateWeightKg} kg).`],
      reason: 'Validation failed: Invalid weight entered.',
      errorMessage: 'Estimated weight must be a positive number greater than 0 kg.',
      recommendation: 'Please enter a realistic estimated weight in kilograms.'
    };
  }

  if (isNaN(input.cityDistanceKm) || input.cityDistanceKm < 0) {
    return {
      isValid: false,
      isEligible: false,
      status: 'Ineligible for Redistribution',
      unitWeightRatio: 0,
      steps: [...steps, `Error: Distance cannot be negative (received ${input.cityDistanceKm} km).`],
      reason: 'Validation failed: Negative distance entered.',
      errorMessage: 'Distance must be zero or a positive number.',
      recommendation: 'Please enter a valid distance in kilometers.'
    };
  }

  // Step 2: Physical Density / Sanity Ratio Check
  const ratio = Number((input.approximateWeightKg / input.quantity).toFixed(3));
  steps.push(`Step 2: Density Ratio Check - Calculated Average Unit Weight = ${input.approximateWeightKg} kg / ${input.quantity} items = ${ratio} kg/item.`);
  if (ratio < 0.02 || ratio > 20.0) {
    steps.push(`Notice: Average weight (${ratio} kg/item) is unusually outside typical household clothing/book standards (0.02 - 20.0 kg/item).`);
  }

  // Step 3: Condition Evaluation
  steps.push(`Step 3: Condition Assessment - Inspected item condition: "${input.condition}".`);
  if (input.condition === 'Not Suitable') {
    steps.push(`Rule Triggered: Condition is marked as "Not Suitable" (severely stained, hazardous, or unhygienic).`);
    steps.push(`Decision: Rejection from reverse logistics network to maintain community dignity and warehouse hygiene standards.`);
    return {
      isValid: true,
      isEligible: false,
      status: 'Ineligible for Redistribution',
      unitWeightRatio: ratio,
      steps,
      reason: 'Items flagged as "Not Suitable" cannot be safely redistributed or sorted in urban community batches.',
      recommendation: 'Items in hazardous or non-usable condition must be disposed of via municipal wet/dry sanitation or designated textile scrap points.'
    };
  }

  // Step 4: Reverse Logistics Routing (Doorstep Vehicle Dispatch vs. Community Hub Drop-off)
  steps.push(`Step 4: Logistics Threshold Check - Doorstep dispatch criteria: Weight >= ${minWeight} kg OR Quantity >= ${minQty} items, within ${maxDist} km service radius.`);
  
  const meetsVehicleThreshold = (input.approximateWeightKg >= minWeight || input.quantity >= minQty);
  const isWithinServiceRadius = input.cityDistanceKm <= maxDist;

  if (meetsVehicleThreshold && isWithinServiceRadius) {
    steps.push(`Evaluation: Weight (${input.approximateWeightKg} kg >= ${minWeight} kg) or Quantity (${input.quantity} >= ${minQty}) meets vehicle threshold AND distance (${input.cityDistanceKm} km <= ${maxDist} km) is within service zone.`);
    steps.push(`Decision: APPROVED for Doorstep Reverse Logistics Collection (Collection Run Route).`);
    return {
      isValid: true,
      isEligible: true,
      status: 'Eligible for Doorstep Pickup',
      unitWeightRatio: ratio,
      steps,
      reason: `Meets reverse logistics bulk threshold (${input.approximateWeightKg} kg, ${input.quantity} items) within the ${input.cityDistanceKm} km service boundary.`,
      recommendation: 'Schedule doorstep pickup to receive a digital pickup verification token (e.g. ASCA-PK-XXXX).'
    };
  } else if (!isWithinServiceRadius) {
    steps.push(`Evaluation: Distance (${input.cityDistanceKm} km) exceeds maximum urban van dispatch radius (${maxDist} km).`);
    steps.push(`Decision: APPROVED for Community Hub Drop-off or Consolidated Partner Drop-point.`);
    return {
      isValid: true,
      isEligible: true,
      status: 'Eligible for Hub Drop-off',
      unitWeightRatio: ratio,
      steps,
      reason: `Location (${input.cityDistanceKm} km) is outside direct van dispatch radius (${maxDist} km), but items are in usable/sortable condition.`,
      recommendation: 'Please bring your donation to the nearest ASCA partner drop-off hub.'
    };
  } else {
    steps.push(`Evaluation: Quantity (${input.quantity} items) and Weight (${input.approximateWeightKg} kg) are below the vehicle dispatch threshold (${minWeight} kg / ${minQty} items).`);
    steps.push(`Decision: APPROVED for Community Hub Drop-off (Small household batch).`);
    return {
      isValid: true,
      isEligible: true,
      status: 'Eligible for Hub Drop-off',
      unitWeightRatio: ratio,
      steps,
      reason: `Items are in good condition (${input.condition}), but the parcel is below the minimum vehicle threshold for automated truck dispatch.`,
      recommendation: 'Drop off at your local neighborhood collection bin or combine with additional household items.'
    };
  }
}

// ============================================================================
// 2. DONATION CLASSIFICATION ALGORITHM (Reuse vs. Recycling vs. Review)
// ============================================================================

export type MaterialCategory = 'Clothes' | 'Books';

export interface ClassificationInput {
  materialCategory: MaterialCategory;
  subType: string;
  condition: 'Good / Usable' | 'Minor Wear / Clean' | 'Repairable / Light Defects' | 'Heavily Damaged / Torn' | 'Hazardous / Wet / Contaminated';
  isCurriculumCurrent?: boolean; // relevant for books
  isContaminated: boolean;
}

export interface ClassificationResult {
  classification: 'Direct Educational / Community Reuse' | 'Repair & Upcycling Workshop' | 'Material Recycling (Fibre / Pulp)' | 'Manual Specialized Review' | 'Responsible Rejection / Quarantine';
  downstreamDestination: string;
  isRecyclable: boolean;
  canReuse: boolean;
  steps: string[];
  reason: string;
}

export function classifyDonatedMaterial(input: ClassificationInput): ClassificationResult {
  const steps: string[] = [];

  // Step 1: Contamination and Hazard Check
  steps.push(`Step 1: Bio-Safety & Contamination Evaluation.`);
  if (input.isContaminated || input.condition === 'Hazardous / Wet / Contaminated') {
    steps.push(`Contamination Flag: True. Detected wet, mouldy, chemical, or bio-hazard contamination.`);
    steps.push(`Critical Rule: Contaminated materials degrade mechanical recycling pulpers and violate shelter health regulations. "Not all damaged items can be recycled."`);
    steps.push(`Decision: Route to Responsible Rejection / Sanitary Quarantine.`);
    return {
      classification: 'Responsible Rejection / Quarantine',
      downstreamDestination: 'Municipal Safe Waste Processing / Isolated Quarantine',
      isRecyclable: false,
      canReuse: false,
      steps,
      reason: 'Contamination (mildew, moisture, hazardous chemicals) renders material unsafe for community reuse and damages recycling machinery.'
    };
  }

  // Step 2: Branch by Material Category
  if (input.materialCategory === 'Clothes') {
    steps.push(`Step 2: Apparel Sorting - Sub-type: "${input.subType}", Condition: "${input.condition}".`);

    if (input.condition === 'Good / Usable' || input.condition === 'Minor Wear / Clean') {
      steps.push(`Condition Assessment: Garment is wearable, structurally sound, and clean.`);
      steps.push(`Decision: Route to Direct Community Reuse.`);
      return {
        classification: 'Direct Educational / Community Reuse',
        downstreamDestination: 'Verified Partner Shelters & Rural Community Centers (ASCA Batch Allocation)',
        isRecyclable: false,
        canReuse: true,
        steps,
        reason: 'Clean, wearable clothing meets dignity standards and is directly dispatched to shelters and rural centers.'
      };
    }

    if (input.condition === 'Repairable / Light Defects') {
      steps.push(`Condition Assessment: Minor issues (missing buttons, small seam tears) with intact main fabric.`);
      steps.push(`Decision: Route to Upcycling & Repair Workshop.`);
      return {
        classification: 'Repair & Upcycling Workshop',
        downstreamDestination: 'Community Women’s Self-Help Groups & Mending Centres',
        isRecyclable: false,
        canReuse: true,
        steps,
        reason: 'Garments can be restored to full utility through minor mending, providing training opportunities for self-help groups.'
      };
    }

    if (input.condition === 'Heavily Damaged / Torn') {
      steps.push(`Condition Assessment: Unwearable, torn, or severely abraded fabric with no bio-contamination.`);
      
      const naturalOrPoly = input.subType.toLowerCase().includes('cotton') || 
                            input.subType.toLowerCase().includes('wool') || 
                            input.subType.toLowerCase().includes('polyester');

      if (naturalOrPoly) {
        steps.push(`Fibre Suitability: "${input.subType}" consists of reclaimable textile fibres.`);
        steps.push(`Decision: Route to Industrial Fibre Recycling.`);
        return {
          classification: 'Material Recycling (Fibre / Pulp)',
          downstreamDestination: 'Textile Fibre Reclamation Mill (Acoustic Insulation, Recycled Yarn, Industrial Wipes)',
          isRecyclable: true,
          canReuse: false,
          steps,
          reason: 'Severe wear prevents reuse, but uncontaminated fibres can be mechanically shredded into recycled yarn or insulation.'
        };
      } else {
        steps.push(`Fibre Suitability: Complex composite or unknown synthetic blend.`);
        steps.push(`Decision: Route to Manual Specialized Review.`);
        return {
          classification: 'Manual Specialized Review',
          downstreamDestination: 'Central Sorting Depot - Material Tag Inspection Desk',
          isRecyclable: false,
          canReuse: false,
          steps,
          reason: 'Blended or unknown non-standard materials require optical sorting and burn/composition tests before fibre processing.'
        };
      }
    }
  }

  // Material Category == 'Books'
  steps.push(`Step 2: School Books & Paper Sorting - Sub-type: "${input.subType}", Condition: "${input.condition}".`);

  if (input.condition === 'Good / Usable' || input.condition === 'Minor Wear / Clean') {
    if (input.isCurriculumCurrent !== false) {
      steps.push(`Curriculum Check: Current syllabus aligned textbook / active educational reader.`);
      steps.push(`Decision: Route to Direct Educational Reuse.`);
      return {
        classification: 'Direct Educational / Community Reuse',
        downstreamDestination: 'Under-resourced Rural Schools & Grassroots Learning Centres',
        isRecyclable: false,
        canReuse: true,
        steps,
        reason: 'Current syllabus school books and educational readers in good condition are prioritized for direct student rehoming.'
      };
    } else {
      steps.push(`Curriculum Check: Outdated syllabus textbook, but clean and readable.`);
      steps.push(`Decision: Route to Community Reading Room / Reference Library.`);
      return {
        classification: 'Direct Educational / Community Reuse',
        downstreamDestination: 'Public Community Reading Rooms & Archival Learning Corners',
        isRecyclable: false,
        canReuse: true,
        steps,
        reason: 'Outdated curriculum cannot be used as primary classroom textbooks, but clean books serve as general reference and self-study material.'
      };
    }
  }

  if (input.condition === 'Repairable / Light Defects') {
    steps.push(`Condition Assessment: Loose spine or detached binding, but readable pages.`);
    steps.push(`Decision: Route to Bookbinding & Restoration Clinic.`);
    return {
      classification: 'Repair & Upcycling Workshop',
      downstreamDestination: 'ASCA Student Book-binding Workshop & Spiral Binding Unit',
      isRecyclable: false,
      canReuse: true,
      steps,
      reason: 'Physical defects are restricted to binding. Re-stitching or spiral rebinding restores the textbook to school readiness.'
    };
  }

  if (input.condition === 'Heavily Damaged / Torn') {
    steps.push(`Condition Assessment: Missing pages, heavily defaced, or outdated syllabus beyond restoration.`);
    steps.push(`Fibre Quality: Dry, clean cellulose paper free of heavy plastic lamination.`);
    steps.push(`Decision: Route to Paper De-inking & Pulp Recycling.`);
    return {
      classification: 'Material Recycling (Fibre / Pulp)',
      downstreamDestination: 'Paper Recycling Mill (De-inked Pulp -> Recycled Notebook Production)',
      isRecyclable: true,
      canReuse: false,
      steps,
      reason: 'Severely damaged paper is repulped and converted into brand-new recycled student notebooks and cardboard boxes.'
    };
  }

  // Fallback
  return {
    classification: 'Manual Specialized Review',
    downstreamDestination: 'Central Warehouse Manual Review Desk',
    isRecyclable: false,
    canReuse: false,
    steps: [...steps, 'Item characteristics require hands-on evaluation by depot supervisor.'],
    reason: 'Edge-case item requiring human manual classification.'
  };
}

// ============================================================================
// 3. COLLECTION PROGRESS ALGORITHM
// ============================================================================

export interface CollectionProgressInput {
  collectedQuantity: number;
  targetQuantity: number;
  vehicleCapacity?: number;
  unit?: string;
}

export interface CollectionProgressResult {
  isValid: boolean;
  collectedQuantity: number;
  targetQuantity: number;
  progressPercentage: number;
  remainingQuantity: number;
  surplusQuantity: number;
  capacityUtilization?: number;
  status: 'Target Achieved' | 'In Progress' | 'Target Exceeded' | 'Zero Progress';
  steps: string[];
  explanation: string;
  errorMessage?: string;
}

export function calculateCollectionProgress(input: CollectionProgressInput): CollectionProgressResult {
  const steps: string[] = [];
  const unit = input.unit || 'kg';

  // Step 1: Input Validation
  steps.push(`Step 1: Input Validation - Validating numerical inputs.`);
  if (isNaN(input.collectedQuantity) || input.collectedQuantity < 0) {
    return {
      isValid: false,
      collectedQuantity: 0,
      targetQuantity: 0,
      progressPercentage: 0,
      remainingQuantity: 0,
      surplusQuantity: 0,
      status: 'Zero Progress',
      steps: [...steps, `Error: Collected quantity cannot be negative or NaN (received ${input.collectedQuantity}).`],
      explanation: 'Validation failed: Invalid collected quantity.',
      errorMessage: 'Collected quantity must be a non-negative number (>= 0).'
    };
  }

  if (isNaN(input.targetQuantity) || input.targetQuantity <= 0) {
    return {
      isValid: false,
      collectedQuantity: input.collectedQuantity,
      targetQuantity: 0,
      progressPercentage: 0,
      remainingQuantity: 0,
      surplusQuantity: 0,
      status: 'Zero Progress',
      steps: [...steps, `Error: Target quantity must be strictly greater than 0 (received ${input.targetQuantity}). Cannot divide by zero.`],
      explanation: 'Validation failed: Collection target must be greater than zero.',
      errorMessage: 'Collection target must be greater than 0 to prevent division by zero.'
    };
  }

  const collected = input.collectedQuantity;
  const target = input.targetQuantity;

  // Step 2: Progress Percentage Calculation
  // Formula: Progress = (Collected / Target) * 100
  const progress = Number(((collected / target) * 100).toFixed(2));
  steps.push(`Step 2: Progress Formula - (${collected} ${unit} / ${target} ${unit}) × 100 = ${progress}%.`);

  // Step 3: Remaining / Surplus Calculation
  // Formula: Remaining = max(0, Target - Collected)
  const remaining = Number((Math.max(0, target - collected)).toFixed(2));
  const surplus = Number((Math.max(0, collected - target)).toFixed(2));
  steps.push(`Step 3: Remaining Calculation - max(0, ${target} - ${collected}) = ${remaining} ${unit}.`);
  if (surplus > 0) {
    steps.push(`Notice: Surplus Collection - Collected exceeds target by ${surplus} ${unit}.`);
  }

  // Step 4: Vehicle Capacity Check (if provided)
  let capacityUtil: number | undefined;
  if (input.vehicleCapacity && input.vehicleCapacity > 0) {
    capacityUtil = Number(((collected / input.vehicleCapacity) * 100).toFixed(2));
    steps.push(`Step 4: Vehicle Capacity Check - (${collected} ${unit} / ${input.vehicleCapacity} ${unit}) = ${capacityUtil}% payload filled.`);
  }

  // Step 5: Status Determination
  let status: CollectionProgressResult['status'] = 'In Progress';
  let explanation = '';

  if (collected === 0) {
    status = 'Zero Progress';
    explanation = `No materials have been collected yet against the target of ${target} ${unit} (0% complete).`;
  } else if (collected >= target) {
    if (surplus > 0) {
      status = 'Target Exceeded';
      explanation = `Collection target successfully exceeded by ${surplus} ${unit} (${progress}% achieved, 0 ${unit} remaining).`;
    } else {
      status = 'Target Achieved';
      explanation = `Collection target of ${target} ${unit} has been exactly 100% fulfilled. Ready for batch creation.`;
    }
  } else {
    status = 'In Progress';
    explanation = `Collection run is currently at ${progress}%. A total of ${remaining} ${unit} is still required to meet the target quota.`;
  }

  return {
    isValid: true,
    collectedQuantity: collected,
    targetQuantity: target,
    progressPercentage: progress,
    remainingQuantity: remaining,
    surplusQuantity: surplus,
    capacityUtilization: capacityUtil,
    status,
    steps,
    explanation
  };
}

// ============================================================================
// 4. CIRCULAR MATERIAL DIVERSION & REUSE/RECYCLING IMPACT ALGORITHM
// ============================================================================

export interface CircularImpactInput {
  totalProcessedKg: number;
  reusedKg: number;
  recycledKg: number;
  residueKg?: number;
}

export interface CircularImpactResult {
  isValid: boolean;
  totalKg: number;
  reusedKg: number;
  recycledKg: number;
  residueKg: number;
  reuseRate: number;
  recyclingRate: number;
  diversionRate: number;
  residueRate: number;
  steps: string[];
  explanation: string;
  errorMessage?: string;
}

export function calculateCircularMaterialImpact(input: CircularImpactInput): CircularImpactResult {
  const steps: string[] = [];

  // Step 1: Input Validation
  steps.push(`Step 1: Input Validation - Checking mass balance quantities.`);
  if (isNaN(input.totalProcessedKg) || input.totalProcessedKg <= 0) {
    return {
      isValid: false,
      totalKg: 0,
      reusedKg: 0,
      recycledKg: 0,
      residueKg: 0,
      reuseRate: 0,
      recyclingRate: 0,
      diversionRate: 0,
      residueRate: 0,
      steps: [...steps, `Error: Total processed quantity must be greater than zero (received ${input.totalProcessedKg}).`],
      explanation: 'Validation failed: Total processed mass must be positive.',
      errorMessage: 'Total processed mass must be greater than 0 kg to prevent division by zero.'
    };
  }

  const reused = Math.max(0, input.reusedKg || 0);
  const recycled = Math.max(0, input.recycledKg || 0);
  const total = input.totalProcessedKg;

  if (reused + recycled > total) {
    return {
      isValid: false,
      totalKg: total,
      reusedKg: reused,
      recycledKg: recycled,
      residueKg: 0,
      reuseRate: 0,
      recyclingRate: 0,
      diversionRate: 0,
      residueRate: 0,
      steps: [...steps, `Error: Sum of Reused (${reused} kg) + Recycled (${recycled} kg) = ${reused + recycled} kg, which exceeds Total Processed (${total} kg).`],
      explanation: 'Conservation of mass violated: Reused and recycled quantities cannot exceed the total batch mass.',
      errorMessage: `Reused (${reused} kg) + Recycled (${recycled} kg) exceeds Total Processed (${total} kg).`
    };
  }

  // Derive or validate residue
  const calculatedResidue = Number((total - (reused + recycled)).toFixed(2));
  const residue = (input.residueKg !== undefined && !isNaN(input.residueKg)) 
    ? input.residueKg 
    : calculatedResidue;

  steps.push(`Step 2: Mass Balance Partition - Total = ${total} kg | Reused = ${reused} kg | Recycled = ${recycled} kg | Non-recoverable Residue = ${residue} kg.`);

  // Step 3: Compute Rates
  // Reuse Rate = (Reused / Total) * 100
  const reuseRate = Number(((reused / total) * 100).toFixed(2));
  steps.push(`Step 3: Reuse Rate Formula - (${reused} kg / ${total} kg) × 100 = ${reuseRate}%.`);

  // Recycling Rate = (Recycled / Total) * 100
  const recyclingRate = Number(((recycled / total) * 100).toFixed(2));
  steps.push(`Step 4: Recycling Rate Formula - (${recycled} kg / ${total} kg) × 100 = ${recyclingRate}%.`);

  // Landfill Diversion Rate = ((Reused + Recycled) / Total) * 100
  const diversionRate = Number((((reused + recycled) / total) * 100).toFixed(2));
  steps.push(`Step 5: Landfill Diversion Rate - ((${reused} + ${recycled}) / ${total}) × 100 = ${diversionRate}%.`);

  // Residue Rate
  const residueRate = Number(((residue / total) * 100).toFixed(2));
  steps.push(`Step 6: Residual Loss Rate - (${residue} kg / ${total} kg) × 100 = ${residueRate}%.`);

  const explanation = `Of the ${total} kg urban materials processed, ${reused} kg (${reuseRate}%) were restored for direct community redistribution, ${recycled} kg (${recyclingRate}%) were salvaged for industrial fibre/pulp recycling, achieving a net urban diversion rate of ${diversionRate}%. Unsalvageable contaminated residue was limited to ${residue} kg (${residueRate}%).`;

  return {
    isValid: true,
    totalKg: total,
    reusedKg: reused,
    recycledKg: recycled,
    residueKg: residue,
    reuseRate,
    recyclingRate,
    diversionRate,
    residueRate,
    steps,
    explanation
  };
}

// ============================================================================
// 5. ADAPTIVE SHORTFALL CREDIT ALLOCATION (ASCA) CORE PRIORITY ALGORITHM
// ============================================================================

export interface AscaInteractiveNgo {
  id: string;
  name: string;
  tier: 'High Capacity' | 'Medium Capacity' | 'Grassroots / Small';
  currentDemand: number;
  historicalShortfall: number;
}

export interface AscaInteractiveInput {
  availableBatchSupply: number;
  alpha: number;
  beta: number;
  ngos: AscaInteractiveNgo[];
}

export interface AscaRankedItem {
  id: string;
  name: string;
  tier: string;
  currentDemand: number;
  normalizedDemand: number;
  historicalShortfall: number;
  normalizedShortfall: number;
  priorityScore: number;
  rank: number;
  allocatedQuantity: number;
  updatedShortfall: number;
  satisfactionRatio: number;
}

export interface AscaInteractiveResult {
  isValid: boolean;
  steps: string[];
  rankedNgos: AscaRankedItem[];
  totalDemand: number;
  totalSupply: number;
  totalAllocated: number;
  remainingSupply: number;
  jainsFairnessIndex: number;
  worstOffSatisfaction: number;
  globalMeanSatisfaction: number;
  explanation: string;
  errorMessage?: string;
}

export function executeAscaInteractiveCalculation(input: AscaInteractiveInput): AscaInteractiveResult {
  const steps: string[] = [];

  // Step 1: Input Validation
  steps.push(`Step 1: Input Validation - Checking supply, weights, and NGO records.`);

  if (isNaN(input.availableBatchSupply) || input.availableBatchSupply <= 0) {
    return {
      isValid: false,
      steps: [...steps, `Error: Available batch supply must be greater than zero (received ${input.availableBatchSupply}).`],
      rankedNgos: [],
      totalDemand: 0,
      totalSupply: 0,
      totalAllocated: 0,
      remainingSupply: 0,
      jainsFairnessIndex: 0,
      worstOffSatisfaction: 0,
      globalMeanSatisfaction: 0,
      explanation: 'Validation failed: Supply must be greater than zero.',
      errorMessage: 'Available batch supply must be greater than 0 units.'
    };
  }

  if (input.ngos.length === 0) {
    return {
      isValid: false,
      steps: [...steps, `Error: No recipient organizations provided for allocation.`],
      rankedNgos: [],
      totalDemand: 0,
      totalSupply: input.availableBatchSupply,
      totalAllocated: 0,
      remainingSupply: input.availableBatchSupply,
      jainsFairnessIndex: 0,
      worstOffSatisfaction: 0,
      globalMeanSatisfaction: 0,
      explanation: 'Validation failed: NGO candidate list is empty.',
      errorMessage: 'At least one NGO candidate is required.'
    };
  }

  const alpha = Number(input.alpha.toFixed(2));
  const beta = Number(input.beta.toFixed(2));
  steps.push(`Step 2: Parameter Weights - Active Demand Weight α = ${alpha}, Historical Shortfall Credit Weight β = ${beta}.`);

  // Step 2: Sum Normalization
  const totalDemand = input.ngos.reduce((acc, n) => acc + Math.max(0, n.currentDemand), 0);
  const totalShortfall = input.ngos.reduce((acc, n) => acc + Math.max(0, n.historicalShortfall), 0);

  steps.push(`Step 3: Aggregate Normalizers - Total Active Demand Σd(j) = ${totalDemand} units, Total Historical Shortfall ΣS(j) = ${totalShortfall} units.`);

  if (totalDemand === 0) {
    return {
      isValid: false,
      steps: [...steps, `Notice: Total current demand is 0 across all NGOs. No items need allocation.`],
      rankedNgos: [],
      totalDemand: 0,
      totalSupply: input.availableBatchSupply,
      totalAllocated: 0,
      remainingSupply: input.availableBatchSupply,
      jainsFairnessIndex: 1,
      worstOffSatisfaction: 100,
      globalMeanSatisfaction: 100,
      explanation: 'All organizations have zero active demand in this round.',
      errorMessage: 'Total demand across all NGOs is 0.'
    };
  }

  // Step 3: Priority Scoring
  // Priority(i) = alpha * (d_i / Σd) + beta * (S_i / ΣS)
  const scored = input.ngos.map(ngo => {
    const d = Math.max(0, ngo.currentDemand);
    const S = Math.max(0, ngo.historicalShortfall);

    const normD = totalDemand > 0 ? d / totalDemand : 0;
    const normS = totalShortfall > 0 ? S / totalShortfall : (1 / input.ngos.length);

    const score = alpha * normD + beta * normS;

    return {
      id: ngo.id,
      name: ngo.name,
      tier: ngo.tier,
      currentDemand: d,
      normalizedDemand: Number(normD.toFixed(4)),
      historicalShortfall: S,
      normalizedShortfall: Number(normS.toFixed(4)),
      priorityScore: Number(score.toFixed(4))
    };
  });

  steps.push(`Step 4: Priority Scoring - Computed P_i = ${alpha} · d̂_i + ${beta} · Ŝ_i for all ${input.ngos.length} organizations.`);

  // Step 4: Ranking
  scored.sort((a, b) => b.priorityScore - a.priorityScore);
  steps.push(`Step 5: Ranking - Sorted NGOs descending by priority score.`);

  // Step 5: Constrained Batch Allocation
  let remainingSupply = input.availableBatchSupply;
  let totalAllocated = 0;

  const rankedNgos: AscaRankedItem[] = scored.map((item, index) => {
    const rank = index + 1;
    const needed = item.currentDemand;
    let allocated = 0;

    if (remainingSupply > 0) {
      allocated = Math.min(remainingSupply, needed);
      remainingSupply -= allocated;
      totalAllocated += allocated;
    }

    const updatedShortfall = item.historicalShortfall + Math.max(0, needed - allocated);
    const satisfaction = needed > 0 ? Number(((allocated / needed) * 100).toFixed(1)) : 100;

    return {
      id: item.id,
      name: item.name,
      tier: item.tier,
      currentDemand: item.currentDemand,
      normalizedDemand: item.normalizedDemand,
      historicalShortfall: item.historicalShortfall,
      normalizedShortfall: item.normalizedShortfall,
      priorityScore: item.priorityScore,
      rank,
      allocatedQuantity: allocated,
      updatedShortfall,
      satisfactionRatio: satisfaction
    };
  });

  steps.push(`Step 6: Sequential Constrained Allocation - Distributed ${totalAllocated} of ${input.availableBatchSupply} units. Remaining batch surplus = ${remainingSupply} units.`);

  // Step 6: Fairness Computation (Jain's Fairness Index)
  // JFI = (Σ x_i)^2 / (n * Σ x_i^2)
  const xValues = rankedNgos.map(n => n.currentDemand > 0 ? n.allocatedQuantity / n.currentDemand : 1);
  const n = xValues.length;
  const sumX = xValues.reduce((a, b) => a + b, 0);
  const sumXSquare = xValues.reduce((a, b) => a + b * b, 0);

  let jfi = 1.0;
  if (sumXSquare > 0 && n > 0) {
    jfi = Number(((sumX * sumX) / (n * sumXSquare)).toFixed(4));
  }

  const satisfactions = rankedNgos.map(n => n.satisfactionRatio);
  const worstOff = Math.min(...satisfactions);
  const meanSat = Number((satisfactions.reduce((a, b) => a + b, 0) / n).toFixed(1));

  steps.push(`Step 7: Jain's Fairness Index Computation - J(x) = (${sumX.toFixed(2)})² / (${n} × ${sumXSquare.toFixed(2)}) = ${jfi.toFixed(3)}.`);
  steps.push(`Step 8: Starvation Assessment - Worst-off organization satisfaction: ${worstOff}%, Global Mean Satisfaction: ${meanSat}%.`);

  const explanation = `Under constrained batch supply (${input.availableBatchSupply} units for ${totalDemand} total demand), ASCA successfully allocated ${totalAllocated} units. By incorporating historical shortfall credit (β = ${beta}), small and historically underserved organizations received higher priority rankings, achieving an equity index (JFI) of ${jfi.toFixed(3)} with anti-starvation minimum guarantee of ${worstOff}%.`;

  return {
    isValid: true,
    steps,
    rankedNgos,
    totalDemand,
    totalSupply: input.availableBatchSupply,
    totalAllocated,
    remainingSupply,
    jainsFairnessIndex: jfi,
    worstOffSatisfaction: worstOff,
    globalMeanSatisfaction: meanSat,
    explanation
  };
}
