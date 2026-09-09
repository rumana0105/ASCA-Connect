import { NGORequirement, DonationCategory, UrgencyLevel, BeneficiaryType } from '../types';

/**
 * NGO Service
 * 
 * Handles posting community requirements, monitoring historical shortfall credit,
 * and tracking receipts. Pre-wired for future `/api/ngos` endpoints.
 */
export const ngoService = {
  createRequirementPayload(data: {
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
  }): NGORequirement {
    const id = `REQ-${Date.now().toString().slice(-6)}`;

    return {
      id,
      ngoId: data.ngoId,
      ngoName: data.ngoName,
      item: data.item,
      category: data.category,
      quantity: data.quantity,
      weightKg: data.weightKg,
      urgency: data.urgency,
      requiredBy: data.requiredBy,
      beneficiaryType: data.beneficiaryType,
      description: data.description,
      status: 'active',
      fulfilledQuantity: 0,
      fulfilledWeightKg: 0,
      createdAt: new Date().toISOString()
    };
  }
};
