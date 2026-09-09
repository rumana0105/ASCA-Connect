import { calculateAscaPriorities, AscaCandidate } from '../utils/asca';
import { DonationBatch, AllocationRecord } from '../types';

/**
 * Allocation Service
 * 
 * Executes the Adaptive Shortfall Credit Allocation (ASCA) logic on batches
 * and generates verifiable allocation records.
 */
export const allocationService = {
  executeAscaAllocation(
    batch: DonationBatch,
    candidates: AscaCandidate[],
    alpha: number = 0.5,
    beta: number = 0.5,
    roundNumber: number = 1
  ): AllocationRecord {
    const result = calculateAscaPriorities(candidates, batch.totalQuantity, alpha, beta);
    const recordId = `ALC-${Date.now().toString().slice(-6)}`;
    const deliveryId = `ASCA-DL-${Date.now().toString().slice(-5)}`;

    return {
      id: recordId,
      batchId: batch.id,
      category: batch.category,
      totalBatchQuantity: batch.totalQuantity,
      totalBatchWeightKg: batch.totalWeightKg,
      allocatedAt: new Date().toISOString(),
      roundNumber,
      deliveryId,
      explanations: result.explanations
    };
  }
};
