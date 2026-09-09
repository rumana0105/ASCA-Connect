import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  NGO,
  NGOStatus,
  Donation,
  DonationStatus,
  DonationCategory,
  NGORequirement,
  DonationBatch,
  CollectionRun,
  AllocationRecord,
  DeliveryRecord,
  DeliveryStatus,
  AuditLog
} from '../types';
import {
  SEED_USERS,
  SEED_NGOS,
  SEED_DONATIONS,
  SEED_BATCHES,
  SEED_COLLECTION_RUNS,
  SEED_REQUIREMENTS,
  SEED_ALLOCATIONS,
  SEED_DELIVERIES,
  SEED_AUDIT_LOGS
} from '../data/seedData';
import { calculateAscaPriorities } from '../utils/asca';
import { verifyDemoCredentials } from '../config/demoAuth';

interface NotificationState {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole;
  ngos: NGO[];
  donations: Donation[];
  requirements: NGORequirement[];
  batches: DonationBatch[];
  collectionRuns: CollectionRun[];
  allocations: AllocationRecord[];
  deliveries: DeliveryRecord[];
  auditLogs: AuditLog[];
  notification: NotificationState | null;

  // Actions
  switchRole: (role: UserRole) => void;
  login: (role: UserRole, username: string, password: string) => { success: boolean; error?: string };
  register: (userData: { name: string; email: string; role: UserRole; orgName?: string; phone?: string; beneficiaryType?: string }) => boolean;
  logout: () => void;
  showNotification: (type: NotificationState['type'], message: string) => void;
  clearNotification: () => void;

  // Donor operations
  createDonation: (donationData: {
    category: DonationCategory;
    quantity: number;
    approximateWeightKg: number;
    condition: 'Usable' | 'Needs Sorting' | 'Not Suitable';
    description: string;
    photos: string[];
    pickupAddress: string;
    preferredPickupDate: string;
  }) => string;

  // NGO operations
  postRequirement: (reqData: {
    item: string;
    category: DonationCategory;
    quantity: number;
    weightKg: number;
    urgency: 'Low' | 'Medium' | 'High' | 'Critical';
    requiredBy: string;
    beneficiaryType: NGO['beneficiaryType'];
    description: string;
  }) => string;

  // Admin operations
  verifyNgo: (ngoId: string, status: NGOStatus) => void;
  approveDonation: (donationId: string) => void;
  rejectDonation: (donationId: string, reason?: string) => void;
  schedulePickup: (donationId: string, preferredDate?: string) => string;
  createCollectionRun: (data: { scheduledDate: string; assignedAgent: string; donationIds: string[]; cityArea: string }) => string;
  createBatch: (category: DonationCategory, sourceDonationIds: string[]) => string;
  runAscaAllocation: (batchId: string, alpha?: number, beta?: number) => AllocationRecord | null;
  updateDeliveryStatus: (deliveryId: string, nextStatus: DeliveryStatus, note?: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'asca_current_user',
  NGOS: 'asca_ngos_v1',
  DONATIONS: 'asca_donations_v1',
  REQUIREMENTS: 'asca_requirements_v1',
  BATCHES: 'asca_batches_v1',
  COLLECTION_RUNS: 'asca_runs_v1',
  ALLOCATIONS: 'asca_allocations_v1',
  DELIVERIES: 'asca_deliveries_v1',
  AUDIT_LOGS: 'asca_audit_logs_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user / role state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null; // default to guest/public experience
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'guest';
  });

  // Domain states
  const [ngos, setNgos] = useState<NGO[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NGOS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_NGOS;
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DONATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_DONATIONS;
  });

  const [requirements, setRequirements] = useState<NGORequirement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REQUIREMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_REQUIREMENTS;
  });

  const [batches, setBatches] = useState<DonationBatch[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BATCHES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_BATCHES;
  });

  const [collectionRuns, setCollectionRuns] = useState<CollectionRun[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COLLECTION_RUNS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_COLLECTION_RUNS;
  });

  const [allocations, setAllocations] = useState<AllocationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALLOCATIONS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_ALLOCATIONS;
  });

  const [deliveries, setDeliveries] = useState<DeliveryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DELIVERIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_DELIVERIES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SEED_AUDIT_LOGS;
  });

  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Sync states to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      setCurrentRole(currentUser.role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setCurrentRole('guest');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NGOS, JSON.stringify(ngos));
  }, [ngos]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BATCHES, JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COLLECTION_RUNS, JSON.stringify(collectionRuns));
  }, [collectionRuns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALLOCATIONS, JSON.stringify(allocations));
  }, [allocations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELIVERIES, JSON.stringify(deliveries));
  }, [deliveries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  const showNotification = (type: NotificationState['type'], message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const clearNotification = () => setNotification(null);

  // Helper to log audit entries
  const logAudit = (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser ? currentUser.name : 'System',
      actorRole: currentUser ? currentUser.role : 'admin',
      action,
      entityType,
      entityId,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth operations
  const switchRole = (role: UserRole) => {
    if (role === 'guest') {
      setCurrentUser(null);
      setCurrentRole('guest');
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      sessionStorage.removeItem('asca_auth_session');
      showNotification('info', 'Switched to Public Experience.');
      return;
    }

    const defaultForRole = SEED_USERS.find(u => u.role === role);
    if (defaultForRole) {
      setCurrentUser(defaultForRole);
      setCurrentRole(role);
      showNotification('success', `Active user switched to ${defaultForRole.name} (${role.toUpperCase()}).`);
    }
  };

  const login = (role: UserRole, username: string, password: string): { success: boolean; error?: string } => {
    const result = verifyDemoCredentials(role, username, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      setCurrentRole(role);
      showNotification('success', `Welcome back, ${result.user.name}!`);
      return { success: true };
    }
    return { success: false, error: result.error || 'Invalid username or password.' };
  };

  const register = (userData: {
    name: string;
    email: string;
    role: UserRole;
    orgName?: string;
    phone?: string;
    beneficiaryType?: string;
  }): boolean => {
    if (userData.role === 'admin') {
      showNotification('error', 'Admin registration is restricted. Please request internal access.');
      return false;
    }

    const newUserId = `user-${Date.now()}`;
    let ngoId: string | undefined;

    if (userData.role === 'ngo') {
      ngoId = `ngo-${Date.now().toString().slice(-4)}`;
      const newNgo: NGO = {
        id: ngoId,
        name: userData.orgName || `${userData.name}'s Organization`,
        registrationNumber: `REG-${Date.now().toString().slice(-6)}`,
        category: 'Community Development',
        contactPerson: userData.name,
        email: userData.email,
        phone: userData.phone || '+1 (555) 000-0000',
        address: 'Registered Location',
        city: 'Metropolitan Area',
        beneficiaryCount: 50,
        beneficiaryType: (userData.beneficiaryType as any) || 'Community Centre',
        status: 'pending', // Pending admin verification
        cumulativeDemand: 0,
        cumulativeAllocated: 0,
        historicalShortfall: 0,
        currentDemand: 0,
        tier: 'Grassroots / Small'
      };
      setNgos(prev => [newNgo, ...prev]);
      logAudit('NGO_REGISTRATION', 'NGO', ngoId, `New organization registered: ${newNgo.name} (Pending verification).`);
    }

    const newUser: User = {
      id: newUserId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      organizationName: userData.orgName,
      phone: userData.phone,
      ngoId,
      createdAt: new Date().toISOString()
    };

    setCurrentUser(newUser);
    setCurrentRole(userData.role);
    showNotification('success', `Account created successfully. Welcome to ASCA, ${newUser.name}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    sessionStorage.removeItem('asca_auth_session');
    showNotification('info', 'You have been signed out.');
  };

  // Donor Actions
  const createDonation = (data: {
    category: DonationCategory;
    quantity: number;
    approximateWeightKg: number;
    condition: 'Usable' | 'Needs Sorting' | 'Not Suitable';
    description: string;
    photos: string[];
    pickupAddress: string;
    preferredPickupDate: string;
  }): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const donationId = `DON-2026-${randomNum}`;

    const newDonation: Donation = {
      id: donationId,
      donorId: currentUser ? currentUser.id : 'user-donor-anon',
      donorName: currentUser ? currentUser.name : 'Community Donor',
      donorEmail: currentUser ? currentUser.email : 'donor@example.com',
      donorPhone: currentUser?.phone || '+1 (555) 234-5678',
      category: data.category,
      quantity: data.quantity,
      approximateWeightKg: data.approximateWeightKg,
      condition: data.condition,
      description: data.description,
      photos: data.photos.length > 0 ? data.photos : ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80'],
      pickupAddress: data.pickupAddress,
      preferredPickupDate: data.preferredPickupDate,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    setDonations(prev => [newDonation, ...prev]);
    logAudit(
      'DONATION_SUBMITTED',
      'Donation',
      donationId,
      `Submitted donation of ${data.quantity} ${data.category} (${data.approximateWeightKg} kg) by ${newDonation.donorName}.`
    );
    showNotification('success', `Donation ${donationId} created! An admin will review it shortly.`);
    return donationId;
  };

  // NGO Actions
  const postRequirement = (data: {
    item: string;
    category: DonationCategory;
    quantity: number;
    weightKg: number;
    urgency: 'Low' | 'Medium' | 'High' | 'Critical';
    requiredBy: string;
    beneficiaryType: NGO['beneficiaryType'];
    description: string;
  }): string => {
    const reqId = `REQ-${Date.now().toString().slice(-6)}`;
    const myNgo = ngos.find(n => n.id === currentUser?.ngoId) || ngos[0];

    const newReq: NGORequirement = {
      id: reqId,
      ngoId: myNgo.id,
      ngoName: myNgo.name,
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

    setRequirements(prev => [newReq, ...prev]);

    // Update NGO currentDemand and cumulativeDemand
    setNgos(prev =>
      prev.map(n => {
        if (n.id === myNgo.id) {
          const newCurrent = n.currentDemand + data.quantity;
          const newCumulative = n.cumulativeDemand + data.quantity;
          const newShortfall = Math.max(0, newCumulative - n.cumulativeAllocated);
          return {
            ...n,
            currentDemand: newCurrent,
            cumulativeDemand: newCumulative,
            historicalShortfall: newShortfall
          };
        }
        return n;
      })
    );

    logAudit('REQUIREMENT_POSTED', 'NGO', myNgo.id, `Posted requirement: ${data.item} (${data.quantity} units, ${data.urgency} urgency).`);
    showNotification('success', 'Requirement registered! ASCA will consider this demand in upcoming batch rounds.');
    return reqId;
  };

  // Admin Actions
  const verifyNgo = (ngoId: string, status: NGOStatus) => {
    setNgos(prev =>
      prev.map(n => (n.id === ngoId ? { ...n, status, verifiedAt: status === 'verified' ? new Date().toISOString() : n.verifiedAt } : n))
    );
    const ngo = ngos.find(n => n.id === ngoId);
    logAudit('NGO_STATUS_UPDATED', 'NGO', ngoId, `Status updated to ${status.toUpperCase()} for ${ngo?.name}.`);
    showNotification('info', `NGO status updated to ${status}.`);
  };

  const approveDonation = (donationId: string) => {
    const token = `ASCA-PK-${Math.floor(10000 + Math.random() * 90000)}`;
    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? {
              ...d,
              status: 'approved',
              pickupToken: token,
              approvedAt: new Date().toISOString()
            }
          : d
      )
    );
    logAudit('DONATION_APPROVED', 'Donation', donationId, `Approved donation condition. Generated pickup token ${token}.`);
    showNotification('success', `Donation ${donationId} approved! Generated Pickup Token: ${token}`);
  };

  const rejectDonation = (donationId: string, reason = 'Condition not suitable for immediate redistribution') => {
    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, status: 'rejected' } : d))
    );
    logAudit('DONATION_REJECTED', 'Donation', donationId, `Donation rejected: ${reason}`);
    showNotification('warning', `Donation ${donationId} rejected.`);
  };

  const schedulePickup = (donationId: string, preferredDate?: string): string => {
    const token = `ASCA-PK-${Math.floor(10000 + Math.random() * 90000)}`;
    const date = preferredDate || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0];

    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? {
              ...d,
              status: 'pickup_scheduled',
              pickupToken: d.pickupToken || token,
              preferredPickupDate: date
            }
          : d
      )
    );

    logAudit('PICKUP_SCHEDULED', 'Pickup', donationId, `Scheduled pickup on ${date}.`);
    showNotification('success', `Pickup scheduled for ${date}.`);
    return token;
  };

  const createCollectionRun = (data: {
    scheduledDate: string;
    assignedAgent: string;
    donationIds: string[];
    cityArea: string;
  }): string => {
    const runNum = collectionRuns.length + 22;
    const runId = `CR-0${runNum}`;

    let weight = 0;
    data.donationIds.forEach(id => {
      const don = donations.find(d => d.id === id);
      if (don) weight += don.approximateWeightKg;
    });

    const newRun: CollectionRun = {
      id: runId,
      scheduledDate: data.scheduledDate,
      assignedAgent: data.assignedAgent,
      donationIds: data.donationIds,
      totalWeightKg: Number(weight.toFixed(1)),
      totalDonationsCount: data.donationIds.length,
      cityArea: data.cityArea,
      status: 'Scheduled'
    };

    setCollectionRuns(prev => [newRun, ...prev]);

    // Update donations to 'collected' / 'available'
    setDonations(prev =>
      prev.map(d =>
        data.donationIds.includes(d.id)
          ? {
              ...d,
              status: 'collected',
              collectionRunId: runId,
              collectedAt: new Date().toISOString()
            }
          : d
      )
    );

    logAudit('COLLECTION_RUN_CREATED', 'Pickup', runId, `Created Collection Run with ${data.donationIds.length} items (${weight.toFixed(1)} kg).`);
    showNotification('success', `Collection Run ${runId} formed!`);
    return runId;
  };

  const createBatch = (category: DonationCategory, sourceDonationIds: string[]): string => {
    const batchNum = 1040 + batches.length + 1;
    const batchId = `BATCH-${batchNum}`;

    let totalQty = 0;
    let totalWeight = 0;

    sourceDonationIds.forEach(id => {
      const don = donations.find(d => d.id === id);
      if (don) {
        totalQty += don.quantity;
        totalWeight += don.approximateWeightKg;
      }
    });

    // Fallback if manual creation
    if (totalQty === 0) {
      totalQty = category === 'Books' ? 100 : category === 'Clothes' ? 150 : 80;
      totalWeight = Number((totalQty * 0.45).toFixed(1));
    }

    const newBatch: DonationBatch = {
      id: batchId,
      category,
      totalQuantity: totalQty,
      totalWeightKg: Number(totalWeight.toFixed(1)),
      sourceDonationIds,
      status: 'available',
      createdAt: new Date().toISOString()
    };

    setBatches(prev => [newBatch, ...prev]);

    // Update donations
    setDonations(prev =>
      prev.map(d =>
        sourceDonationIds.includes(d.id)
          ? {
              ...d,
              status: 'available',
              batchId
            }
          : d
      )
    );

    logAudit('BATCH_CREATED', 'Batch', batchId, `Assembled batch ${batchId} of ${totalQty} ${category}.`);
    showNotification('success', `Batch ${batchId} created and ready for ASCA allocation.`);
    return batchId;
  };

  // ASCA Fair Allocation Implementation
  const runAscaAllocation = (batchId: string, alpha = 0.5, beta = 0.5): AllocationRecord | null => {
    const batch = batches.find(b => b.id === batchId);
    if (!batch || batch.status !== 'available') {
      showNotification('error', 'Selected batch is not available for allocation.');
      return null;
    }

    // 1. Find verified candidate NGOs with active requirements in this category
    const activeReqs = requirements.filter(
      r => r.category === batch.category && (r.status === 'active' || r.status === 'partially_fulfilled')
    );

    // Group candidate demand per NGO
    const candidateMap = new Map<string, {
      ngoId: string;
      ngoName: string;
      requirementId: string;
      item: string;
      currentDemand: number;
      historicalShortfall: number;
    }>();

    activeReqs.forEach(req => {
      const ngo = ngos.find(n => n.id === req.ngoId && n.status === 'verified');
      if (ngo) {
        const remainingReq = req.quantity - req.fulfilledQuantity;
        if (remainingReq > 0) {
          if (!candidateMap.has(ngo.id)) {
            candidateMap.set(ngo.id, {
              ngoId: ngo.id,
              ngoName: ngo.name,
              requirementId: req.id,
              item: req.item,
              currentDemand: remainingReq,
              historicalShortfall: ngo.historicalShortfall
            });
          } else {
            const existing = candidateMap.get(ngo.id)!;
            existing.currentDemand += remainingReq;
          }
        }
      }
    });

    const candidates = Array.from(candidateMap.values());

    if (candidates.length === 0) {
      showNotification('warning', `No verified NGOs currently have active requirements for ${batch.category}.`);
      return null;
    }

    // 2. Execute authentic ASCA calculation
    const ascaResult = calculateAscaPriorities(candidates, batch.totalQuantity, alpha, beta);

    const deliveryId = `ASCA-DL-${Math.floor(10000 + Math.random() * 90000)}`;
    const roundNumber = allocations.length + 1;

    const newAllocation: AllocationRecord = {
      id: `ALLOC-2026-${String(roundNumber).padStart(3, '0')}`,
      batchId: batch.id,
      category: batch.category,
      totalBatchQuantity: batch.totalQuantity,
      totalBatchWeightKg: batch.totalWeightKg,
      allocatedAt: new Date().toISOString(),
      roundNumber,
      deliveryId,
      explanations: ascaResult.explanations
    };

    // 3. Update NGO cumulative allocation & recalculate historical shortfall
    setNgos(prev =>
      prev.map(n => {
        const exp = ascaResult.explanations.find(e => e.ngoId === n.id);
        if (exp && exp.allocatedQuantity > 0) {
          const newAllocated = n.cumulativeAllocated + exp.allocatedQuantity;
          const newDemand = Math.max(0, n.currentDemand - exp.allocatedQuantity);
          // S(i) = max(0, D(i) - A(i))
          const newShortfall = Math.max(0, n.cumulativeDemand - newAllocated);
          return {
            ...n,
            currentDemand: newDemand,
            cumulativeAllocated: newAllocated,
            historicalShortfall: newShortfall,
            currentAscaPriority: exp.ascaPriority
          };
        }
        return n;
      })
    );

    // 4. Update Requirements fulfillment
    setRequirements(prev =>
      prev.map(req => {
        const exp = ascaResult.explanations.find(e => e.requirementId === req.id);
        if (exp && exp.allocatedQuantity > 0) {
          const newFulfilled = req.fulfilledQuantity + exp.allocatedQuantity;
          const isDone = newFulfilled >= req.quantity;
          return {
            ...req,
            fulfilledQuantity: newFulfilled,
            status: isDone ? 'fulfilled' : 'partially_fulfilled'
          };
        }
        return req;
      })
    );

    // 5. Update Batch status
    setBatches(prev =>
      prev.map(b => (b.id === batchId ? { ...b, status: 'allocated', allocatedAt: new Date().toISOString() } : b))
    );

    // 6. Update constituent donations to 'allocated'
    setDonations(prev =>
      prev.map(d =>
        batch.sourceDonationIds.includes(d.id)
          ? {
              ...d,
              status: 'allocated',
              allocationId: newAllocation.id,
              deliveryId,
              allocatedAt: new Date().toISOString()
            }
          : d
      )
    );

    // 7. Create Delivery records for allocated recipients
    const topRecipient = ascaResult.explanations[0];
    if (topRecipient && topRecipient.allocatedQuantity > 0) {
      const ngo = ngos.find(n => n.id === topRecipient.ngoId);
      const newDelivery: DeliveryRecord = {
        id: deliveryId,
        allocationId: newAllocation.id,
        batchId: batch.id,
        ngoId: topRecipient.ngoId,
        ngoName: topRecipient.ngoName,
        beneficiaryType: ngo?.beneficiaryType || 'Community Centre',
        category: batch.category,
        quantity: topRecipient.allocatedQuantity,
        weightKg: topRecipient.allocatedWeightKg,
        status: 'delivery_scheduled',
        deliveryAddress: ngo?.address || 'Community Facility',
        estimatedDeliveryDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        timeline: [
          { status: 'allocated', timestamp: new Date().toISOString(), note: `Allocated through ASCA Round ${roundNumber}` },
          { status: 'delivery_scheduled', timestamp: new Date().toISOString(), note: 'Consignment prepared for dispatch' }
        ]
      };
      setDeliveries(prev => [newDelivery, ...prev]);
    }

    setAllocations(prev => [newAllocation, ...prev]);

    logAudit(
      'ASCA_ALLOCATION_EXECUTED',
      'Allocation',
      newAllocation.id,
      `Executed ASCA on ${batch.id}: ${ascaResult.totalAllocated} units distributed across ${ascaResult.explanations.length} NGOs.`
    );

    showNotification(
      'success',
      `ASCA allocation completed! ${ascaResult.totalAllocated} ${batch.category} distributed fairly.`
    );

    return newAllocation;
  };

  const updateDeliveryStatus = (deliveryId: string, nextStatus: DeliveryStatus, note = '') => {
    setDeliveries(prev =>
      prev.map(del => {
        if (del.id === deliveryId) {
          const updatedTimeline = [
            ...del.timeline,
            {
              status: nextStatus,
              timestamp: new Date().toISOString(),
              note: note || `Delivery updated to ${nextStatus.replace('_', ' ')}`
            }
          ];
          return {
            ...del,
            status: nextStatus,
            deliveredAt: nextStatus === 'delivered' ? new Date().toISOString() : del.deliveredAt,
            timeline: updatedTimeline
          };
        }
        return del;
      })
    );

    // If delivered, update associated donations to delivered
    if (nextStatus === 'delivered') {
      setDonations(prev =>
        prev.map(d =>
          d.deliveryId === deliveryId
            ? {
                ...d,
                status: 'delivered',
                deliveredAt: new Date().toISOString()
              }
            : d
        )
      );
    }

    logAudit('DELIVERY_STATUS_UPDATED', 'Delivery', deliveryId, `Updated delivery status to ${nextStatus}.`);
    showNotification('success', `Delivery ${deliveryId} is now ${nextStatus.replace('_', ' ')}.`);
  };

  const resetDemoData = () => {
    setNgos(SEED_NGOS);
    setDonations(SEED_DONATIONS);
    setRequirements(SEED_REQUIREMENTS);
    setBatches(SEED_BATCHES);
    setCollectionRuns(SEED_COLLECTION_RUNS);
    setAllocations(SEED_ALLOCATIONS);
    setDeliveries(SEED_DELIVERIES);
    setAuditLogs(SEED_AUDIT_LOGS);
    localStorage.clear();
    showNotification('info', 'Prototype database restored to research demonstration state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        ngos,
        donations,
        requirements,
        batches,
        collectionRuns,
        allocations,
        deliveries,
        auditLogs,
        notification,

        switchRole,
        login,
        register,
        logout,
        showNotification,
        clearNotification,

        createDonation,
        postRequirement,
        verifyNgo,
        approveDonation,
        rejectDonation,
        schedulePickup,
        createCollectionRun,
        createBatch,
        runAscaAllocation,
        updateDeliveryStatus,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
