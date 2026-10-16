export type UserRole = 'donor' | 'ngo' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  organizationName?: string;
  ngoId?: string;
  avatar?: string;
  createdAt: string;
}

export type NGOStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export type BeneficiaryType = 
  | 'Shelter' 
  | 'Learning Centre' 
  | 'Community Centre' 
  | 'Children Home' 
  | 'Senior Care' 
  | 'Disaster Relief' 
  | 'Rural School';

export interface NGO {
  id: string;
  name: string;
  registrationNumber: string;
  category: 'Education' | 'Shelter & Clothing' | 'Child Welfare' | 'Elder Care' | 'Community Development';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  beneficiaryCount: number;
  beneficiaryType: BeneficiaryType;
  status: NGOStatus;
  verifiedAt?: string;
  cumulativeDemand: number;     // D(i) in kg or units
  cumulativeAllocated: number;  // A(i)
  historicalShortfall: number;  // S(i) = max(0, D(i) - A(i))
  currentDemand: number;        // d(i,t)
  currentAscaPriority?: number;
  tier: 'High Capacity' | 'Medium Capacity' | 'Grassroots / Small';
}

export type DonationCategory = 'Clothes' | 'Books' | 'School Supplies' | 'Other Useful Items';

export type DonationCondition = 'Usable' | 'Needs Sorting' | 'Not Suitable';

export type DonationStatus = 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'pickup_scheduled' 
  | 'collected' 
  | 'available' 
  | 'allocated' 
  | 'delivered'
  | 'rejected';

export interface Donation {
  id: string; // e.g. DON-2026-1042
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  category: DonationCategory;
  quantity: number; // units/items
  approximateWeightKg: number;
  condition: DonationCondition;
  description: string;
  photos: string[];
  pickupAddress: string;
  preferredPickupDate: string;
  status: DonationStatus;
  pickupToken?: string; // e.g. ASCA-PK-48291
  collectionRunId?: string;
  batchId?: string; // e.g. BATCH-1042
  allocationId?: string;
  deliveryId?: string;
  createdAt: string;
  approvedAt?: string;
  collectedAt?: string;
  allocatedAt?: string;
  deliveredAt?: string;
}

export type PickupStatus = 'scheduled' | 'out_for_pickup' | 'picked_up' | 'completed';

export interface PickupTokenRecord {
  token: string; // ASCA-PK-48291
  donationId: string;
  donorName: string;
  pickupAddress: string;
  scheduledDate: string;
  estimatedWeightKg: number;
  category: DonationCategory;
  collectionRunId?: string;
  status: PickupStatus;
}

export interface CollectionRun {
  id: string; // e.g. CR-021
  scheduledDate: string;
  assignedAgent: string;
  donationIds: string[];
  totalWeightKg: number;
  totalDonationsCount: number;
  cityArea: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export type BatchStatus = 'forming' | 'available' | 'allocating' | 'allocated' | 'delivered';

export interface DonationBatch {
  id: string; // e.g. BATCH-1042
  category: DonationCategory;
  totalQuantity: number;
  totalWeightKg: number;
  sourceDonationIds: string[];
  status: BatchStatus;
  createdAt: string;
  allocatedAt?: string;
}

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface NGORequirement {
  id: string;
  ngoId: string;
  ngoName: string;
  item: string;
  category: DonationCategory;
  quantity: number;
  weightKg: number;
  urgency: UrgencyLevel;
  requiredBy: string;
  beneficiaryType: BeneficiaryType;
  description: string;
  status: 'active' | 'partially_fulfilled' | 'fulfilled';
  fulfilledQuantity: number;
  fulfilledWeightKg: number;
  createdAt: string;
}

export interface AllocationExplanation {
  ngoId: string;
  ngoName: string;
  requirementId: string;
  item: string;
  currentDemand: number;       // d(i,t)
  normalizedDemand: number;    // normalized d
  historicalShortfall: number; // S(i)
  normalizedShortfall: number; // normalized S
  ascaPriority: number;        // alpha * norm_d + beta * norm_S
  alpha: number;               // 0.5
  beta: number;                // 0.5
  rank: number;
  allocatedQuantity: number;
  allocatedWeightKg: number;
  humanExplanation: string;
}

export interface AllocationRecord {
  id: string;
  batchId: string;
  category: DonationCategory;
  totalBatchQuantity: number;
  totalBatchWeightKg: number;
  allocatedAt: string;
  roundNumber: number;
  deliveryId: string;
  explanations: AllocationExplanation[];
}

export type DeliveryStatus = 'allocated' | 'delivery_scheduled' | 'out_for_delivery' | 'delivered';

export interface DeliveryRecord {
  id: string; // e.g. ASCA-DL-19384
  allocationId: string;
  batchId: string;
  ngoId: string;
  ngoName: string;
  beneficiaryType: BeneficiaryType;
  category: DonationCategory;
  quantity: number;
  weightKg: number;
  status: DeliveryStatus;
  deliveryAddress: string;
  estimatedDeliveryDate: string;
  deliveredAt?: string;
  timeline: {
    status: DeliveryStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: 'NGO' | 'Donation' | 'Pickup' | 'Batch' | 'Allocation' | 'Delivery' | 'System';
  entityId: string;
  details: string;
}

export interface StarvationMetrics {
  zeroAllocationNgoRounds: number;     // total count of (ngo, round) where allocated == 0
  roundsWithZeroAllocation: number;    // number of rounds where at least one NGO got 0
  ngosWithRepeatedZero: number;        // count of NGOs that experienced >= 2 consecutive 0-allocation rounds
  maxConsecutiveZeroStreak: number;    // maximum consecutive zero-allocation rounds for any NGO
  worstOffStreakNgo: string;           // identifier of NGO experiencing longest zero streak
}

export interface RoundNgoStep {
  ngoId: string;
  ngoName: string;
  tier: string;
  currentDemand: number;
  openingShortfall: number;
  normDemand: number;
  normShortfall: number;
  priorityScore: number;
  rank: number;
  allocated: number;
  remainingDemand: number;
  closingShortfall: number;
  satisfactionPct: number;
  isZeroAllocation: boolean;
  consecutiveZeroStreak: number;
}

export interface RoundExecutionTrace {
  roundNumber: number;
  availableSupply: number;
  totalRoundDemand: number;
  totalRoundAllocated: number;
  supplyUtilizationPct: number;
  openingAggregateShortfall: number;
  closingAggregateShortfall: number;
  shortfallConservationHolds: boolean; // Opening + Demand - Allocated == Closing
  ngoSteps: RoundNgoStep[];
}

export type AllocationPolicy = 'FIFO' | 'Greedy Demand' | 'Proportional' | 'ASCA';

export interface PolicyMetricResult {
  policy: AllocationPolicy;
  jainsFairnessIndex: number;
  worstOffSatisfaction: number; // percentage
  globalMeanSatisfaction: number; // percentage
  peakShortfallDeficit: number; // max shortfall in units/kg
  resourceUtilization: number; // percentage
  roundsCompleted: number;
  starvationMetrics: StarvationMetrics;
  shortfallOverRounds: { round: number; avgShortfall: number; maxShortfall: number }[];
  tierDistribution: { tier: string; satisfactionRate: number }[];
  roundTraces: RoundExecutionTrace[];
}

export interface SimulationConfig {
  ngoCount: number;
  roundCount: number;
  supplyDemandRatio: number; // e.g. 0.65
  seed: number;
  alpha: number; // 0.5
  beta: number;  // 0.5
}

export interface SensitivityPoint {
  beta: number;
  alpha: number;
  jainsFairnessIndex: number;
  worstOffSatisfaction: number;
  globalMeanSatisfaction: number;
  peakShortfallDeficit: number;
  resourceUtilization: number;
  zeroAllocationNgoRounds: number;
  maxConsecutiveZeroStreak: number;
}

export interface SensitivityExperimentResult {
  points: SensitivityPoint[];
  bestFairnessBeta: number;
  bestWorstOffBeta: number;
  config: SimulationConfig;
  summaryNotes: string;
}
