/**
 * DATA MODELS & SCHEMA SPECIFICATIONS (FUTURE MONGODB BLUEPRINT)
 * 
 * This file specifies the object schemas and TypeScript definitions
 * that mirror the planned MongoDB collections:
 *  - users
 *  - ngos
 *  - donations
 *  - requirements
 *  - donationBatches
 *  - allocations
 *  - shortfallHistory
 *  - pickupRequests
 *  - deliveryRecords
 *  - auditLogs
 * 
 * When migrating to an active MongoDB instance (see docs/DATABASE_SETUP.md),
 * these definitions map directly to Mongoose models.
 */

export interface IUserModel {
  _id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'donor' | 'ngo' | 'admin';
  organizationName?: string;
  ngoId?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface INGOModel {
  _id?: string;
  name: string;
  registrationNumber: string;
  category: 'Education' | 'Shelter & Clothing' | 'Child Welfare' | 'Elder Care' | 'Community Development';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  beneficiaryCount: number;
  beneficiaryType: string;
  status: 'pending' | 'verified' | 'rejected' | 'suspended';
  verifiedAt?: string;
  cumulativeDemand: number;
  cumulativeAllocated: number;
  historicalShortfall: number;
  currentDemand: number;
  tier: 'High Capacity' | 'Medium Capacity' | 'Grassroots / Small';
}

export interface IDonationModel {
  _id?: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  category: 'Clothes' | 'Books' | 'School Supplies' | 'Other Useful Items';
  quantity: number;
  approximateWeightKg: number;
  condition: 'Usable' | 'Needs Sorting' | 'Not Suitable';
  description: string;
  photos: string[];
  pickupAddress: string;
  preferredPickupDate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'pickup_scheduled' | 'collected' | 'available' | 'allocated' | 'delivered' | 'rejected';
  batchId?: string;
  collectionRunId?: string;
  createdAt: string;
}

export interface INGORequirementModel {
  _id?: string;
  ngoId: string;
  ngoName: string;
  item: string;
  category: 'Clothes' | 'Books' | 'School Supplies' | 'Other Useful Items';
  quantity: number;
  weightKg: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  requiredBy: string;
  beneficiaryType: string;
  description: string;
  status: 'active' | 'partially_fulfilled' | 'fulfilled' | 'closed';
  fulfilledQuantity: number;
  allocatedBatchIds: string[];
  createdAt: string;
}

export interface IDonationBatchModel {
  _id?: string;
  batchCode: string;
  category: 'Clothes' | 'Books' | 'School Supplies' | 'Other Useful Items';
  itemCount: number;
  totalWeightKg: number;
  sourceDonationIds: string[];
  status: 'assembling' | 'available' | 'allocated' | 'dispatched';
  createdAt: string;
}

export interface IAllocationRecordModel {
  _id?: string;
  batchId: string;
  batchCategory: string;
  batchTotalQuantity: number;
  algorithm: 'ASCA' | 'FIFO' | 'Proportional' | 'Greedy';
  alpha: number;
  beta: number;
  allocations: {
    ngoId: string;
    ngoName: string;
    requirementId: string;
    allocatedQuantity: number;
    currentDemand: number;
    historicalShortfall: number;
    priorityScore: number;
    normalizedDemand: number;
    normalizedShortfall: number;
    unmetDeficitRemaining: number;
  }[];
  createdAt: string;
}

export interface IShortfallHistoryModel {
  _id?: string;
  ngoId: string;
  roundNumber: number;
  demandSubmitted: number;
  quantityAllocated: number;
  periodShortfall: number;
  accumulatedShortfall: number;
  timestamp: string;
}
