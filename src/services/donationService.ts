import { Donation, DonationCategory, DonationCondition } from '../types';

/**
 * Donation Service
 * 
 * Provides client operations for donors to submit items, track pickups,
 * and view allocation status. Pre-wired for future `/api/donations` endpoints.
 */
export const donationService = {
  createDonationPayload(data: {
    donorId: string;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    category: DonationCategory;
    quantity: number;
    approximateWeightKg: number;
    condition: DonationCondition;
    description: string;
    photos: string[];
    pickupAddress: string;
    preferredPickupDate: string;
  }): Donation {
    const id = `DON-${Date.now().toString().slice(-6)}`;
    const pickupToken = `PKP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    return {
      id,
      donorId: data.donorId,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      donorPhone: data.donorPhone,
      category: data.category,
      quantity: data.quantity,
      approximateWeightKg: data.approximateWeightKg,
      condition: data.condition,
      description: data.description,
      photos: data.photos,
      pickupAddress: data.pickupAddress,
      preferredPickupDate: data.preferredPickupDate,
      pickupToken,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };
  }
};
