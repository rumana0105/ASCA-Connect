import React, { useState } from 'react';
import { 
  evaluateDonationEligibility, 
  classifyDonatedMaterial, 
  calculateCollectionProgress, 
  calculateCircularMaterialImpact, 
  executeAscaInteractiveCalculation,
  EligibilityInput,
  ClassificationInput,
  CollectionProgressInput,
  CircularImpactInput,
  AscaInteractiveInput
} from '../../utils/algorithms';
import { 
  Cpu, 
  Calculator, 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Play, 
  Scale, 
  Truck, 
  Recycle, 
  BookOpen, 
  Shirt, 
  Layers, 
  Info, 
  ShieldCheck, 
  Copy, 
  Check,
  ChevronRight
} from 'lucide-react';

export const AlgorithmWorkbench: React.FC = () => {
  // Active Algorithm Tab
  const [activeAlgo, setActiveAlgo] = useState<
    'eligibility' | 'classification' | 'collection' | 'diversion' | 'asca-core'
  >('eligibility');

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ==========================================================================
  // STATE: ALGORITHM A - DONATION ELIGIBILITY
  // ==========================================================================
  const [eligCategory, setEligCategory] = useState<'Clothes' | 'Books' | 'School Supplies' | 'Other Useful Items'>('Clothes');
  const [eligQuantity, setEligQuantity] = useState<number>(25);
  const [eligWeight, setEligWeight] = useState<number>(10.5);
  const [eligCondition, setEligCondition] = useState<'Usable' | 'Needs Sorting' | 'Not Suitable'>('Usable');
  const [eligDistance, setEligDistance] = useState<number>(12);
  const [eligResult, setEligResult] = useState(() => evaluateDonationEligibility({
    category: 'Clothes',
    quantity: 25,
    approximateWeightKg: 10.5,
    condition: 'Usable',
    cityDistanceKm: 12
  }));

  const handleRunEligibility = () => {
    const res = evaluateDonationEligibility({
      category: eligCategory,
      quantity: Number(eligQuantity),
      approximateWeightKg: Number(eligWeight),
      condition: eligCondition,
      cityDistanceKm: Number(eligDistance)
    });
    setEligResult(res);
  };

  // Preset demo scenarios for viva presentation
  const loadEligibilityPreset = (type: 'eligible-pickup' | 'hub-dropoff' | 'ineligible-damaged') => {
    if (type === 'eligible-pickup') {
      setEligCategory('Clothes');
      setEligQuantity(30);
      setEligWeight(12.0);
      setEligCondition('Usable');
      setEligDistance(8);
      setEligResult(evaluateDonationEligibility({
        category: 'Clothes',
        quantity: 30,
        approximateWeightKg: 12.0,
        condition: 'Usable',
        cityDistanceKm: 8
      }));
    } else if (type === 'hub-dropoff') {
      setEligCategory('Books');
      setEligQuantity(8);
      setEligWeight(3.2);
      setEligCondition('Usable');
      setEligDistance(6);
      setEligResult(evaluateDonationEligibility({
        category: 'Books',
        quantity: 8,
        approximateWeightKg: 3.2,
        condition: 'Usable',
        cityDistanceKm: 6
      }));
    } else {
      setEligCategory('Clothes');
      setEligQuantity(20);
      setEligWeight(8.0);
      setEligCondition('Not Suitable');
      setEligDistance(10);
      setEligResult(evaluateDonationEligibility({
        category: 'Clothes',
        quantity: 20,
        approximateWeightKg: 8.0,
        condition: 'Not Suitable',
        cityDistanceKm: 10
      }));
    }
  };

  // ==========================================================================
  // STATE: ALGORITHM B - MATERIAL CLASSIFICATION
  // ==========================================================================
  const [classMaterialCat, setClassMaterialCat] = useState<'Clothes' | 'Books'>('Clothes');
  const [classSubType, setClassSubType] = useState<string>('100% Cotton Garment');
  const [classCondition, setClassCondition] = useState<
    'Good / Usable' | 'Minor Wear / Clean' | 'Repairable / Light Defects' | 'Heavily Damaged / Torn' | 'Hazardous / Wet / Contaminated'
  >('Good / Usable');
  const [classCurriculumCurrent, setClassCurriculumCurrent] = useState<boolean>(true);
  const [classIsContaminated, setClassIsContaminated] = useState<boolean>(false);
  const [classResult, setClassResult] = useState(() => classifyDonatedMaterial({
    materialCategory: 'Clothes',
    subType: '100% Cotton Garment',
    condition: 'Good / Usable',
    isContaminated: false
  }));

  const handleRunClassification = () => {
    const res = classifyDonatedMaterial({
      materialCategory: classMaterialCat,
      subType: classSubType,
      condition: classCondition,
      isCurriculumCurrent: classCurriculumCurrent,
      isContaminated: classIsContaminated
    });
    setClassResult(res);
  };

  const loadClassificationPreset = (type: 'reuse-clothes' | 'recycle-textile' | 'reuse-books' | 'reject-contaminated') => {
    if (type === 'reuse-clothes') {
      setClassMaterialCat('Clothes');
      setClassSubType('100% Cotton T-Shirts');
      setClassCondition('Good / Usable');
      setClassIsContaminated(false);
      setClassResult(classifyDonatedMaterial({
        materialCategory: 'Clothes',
        subType: '100% Cotton T-Shirts',
        condition: 'Good / Usable',
        isContaminated: false
      }));
    } else if (type === 'recycle-textile') {
      setClassMaterialCat('Clothes');
      setClassSubType('Wool / Acrylic Knitwear');
      setClassCondition('Heavily Damaged / Torn');
      setClassIsContaminated(false);
      setClassResult(classifyDonatedMaterial({
        materialCategory: 'Clothes',
        subType: 'Wool / Acrylic Knitwear',
        condition: 'Heavily Damaged / Torn',
        isContaminated: false
      }));
    } else if (type === 'reuse-books') {
      setClassMaterialCat('Books');
      setClassSubType('Grade 8 Science & Mathematics Textbooks');
      setClassCondition('Good / Usable');
      setClassCurriculumCurrent(true);
      setClassIsContaminated(false);
      setClassResult(classifyDonatedMaterial({
        materialCategory: 'Books',
        subType: 'Grade 8 Science & Mathematics Textbooks',
        condition: 'Good / Usable',
        isCurriculumCurrent: true,
        isContaminated: false
      }));
    } else {
      setClassMaterialCat('Clothes');
      setClassSubType('Rain-soaked Bedding / Moldy Textiles');
      setClassCondition('Hazardous / Wet / Contaminated');
      setClassIsContaminated(true);
      setClassResult(classifyDonatedMaterial({
        materialCategory: 'Clothes',
        subType: 'Rain-soaked Bedding / Moldy Textiles',
        condition: 'Hazardous / Wet / Contaminated',
        isContaminated: true
      }));
    }
  };

  // ==========================================================================
  // STATE: ALGORITHM C - COLLECTION PROGRESS
  // ==========================================================================
  const [colCollected, setColCollected] = useState<number>(68.5);
  const [colTarget, setColTarget] = useState<number>(100.0);
  const [colVehicleCap, setColVehicleCap] = useState<number>(150.0);
  const [colUnit, setColUnit] = useState<string>('kg');
  const [colResult, setColResult] = useState(() => calculateCollectionProgress({
    collectedQuantity: 68.5,
    targetQuantity: 100.0,
    vehicleCapacity: 150.0,
    unit: 'kg'
  }));

  const handleRunCollection = () => {
    const res = calculateCollectionProgress({
      collectedQuantity: Number(colCollected),
      targetQuantity: Number(colTarget),
      vehicleCapacity: Number(colVehicleCap),
      unit: colUnit
    });
    setColResult(res);
  };

  const loadCollectionPreset = (type: 'mentor-example' | 'in-progress' | 'target-achieved' | 'exceeded') => {
    if (type === 'mentor-example') {
      setColCollected(65);
      setColTarget(100);
      setColVehicleCap(150);
      setColUnit('kg');
      setColResult(calculateCollectionProgress({ collectedQuantity: 65, targetQuantity: 100, vehicleCapacity: 150, unit: 'kg' }));
    } else if (type === 'in-progress') {
      setColCollected(140);
      setColTarget(250);
      setColVehicleCap(300);
      setColUnit('items');
      setColResult(calculateCollectionProgress({ collectedQuantity: 140, targetQuantity: 250, vehicleCapacity: 300, unit: 'items' }));
    } else if (type === 'target-achieved') {
      setColCollected(100);
      setColTarget(100);
      setColVehicleCap(150);
      setColUnit('kg');
      setColResult(calculateCollectionProgress({ collectedQuantity: 100, targetQuantity: 100, vehicleCapacity: 150, unit: 'kg' }));
    } else {
      setColCollected(120);
      setColTarget(100);
      setColVehicleCap(150);
      setColUnit('kg');
      setColResult(calculateCollectionProgress({ collectedQuantity: 120, targetQuantity: 100, vehicleCapacity: 150, unit: 'kg' }));
    }
  };

  // ==========================================================================
  // STATE: ALGORITHM D - CIRCULAR IMPACT & DIVERSION
  // ==========================================================================
  const [divTotal, setDivTotal] = useState<number>(1000);
  const [divReused, setDivReused] = useState<number>(620);
  const [divRecycled, setDivRecycled] = useState<number>(330);
  const [divResidue, setDivResidue] = useState<number>(50);
  const [divResult, setDivResult] = useState(() => calculateCircularMaterialImpact({
    totalProcessedKg: 1000,
    reusedKg: 620,
    recycledKg: 330,
    residueKg: 50
  }));

  const handleRunDiversion = () => {
    const res = calculateCircularMaterialImpact({
      totalProcessedKg: Number(divTotal),
      reusedKg: Number(divReused),
      recycledKg: Number(divRecycled),
      residueKg: Number(divResidue)
    });
    setDivResult(res);
  };

  const loadDiversionPreset = (type: 'balanced-depot' | 'textile-heavy' | 'books-heavy') => {
    if (type === 'balanced-depot') {
      setDivTotal(1000);
      setDivReused(620);
      setDivRecycled(330);
      setDivResidue(50);
      setDivResult(calculateCircularMaterialImpact({ totalProcessedKg: 1000, reusedKg: 620, recycledKg: 330, residueKg: 50 }));
    } else if (type === 'textile-heavy') {
      setDivTotal(500);
      setDivReused(250);
      setDivRecycled(210);
      setDivResidue(40);
      setDivResult(calculateCircularMaterialImpact({ totalProcessedKg: 500, reusedKg: 250, recycledKg: 210, residueKg: 40 }));
    } else {
      setDivTotal(800);
      setDivReused(600);
      setDivRecycled(170);
      setDivResidue(30);
      setDivResult(calculateCircularMaterialImpact({ totalProcessedKg: 800, reusedKg: 600, recycledKg: 170, residueKg: 30 }));
    }
  };

  // ==========================================================================
  // STATE: ALGORITHM E - ASCA CORE PRIORITY ENGINE
  // ==========================================================================
  const [ascaSupply, setAscaSupply] = useState<number>(120);
  const [ascaAlpha, setAscaAlpha] = useState<number>(0.50);
  const [ascaBeta, setAscaBeta] = useState<number>(0.50);
  const [ascaNgos, setAscaNgos] = useState([
    { id: 'NGO-1', name: 'Richa Children Learning Center', tier: 'Grassroots / Small' as const, currentDemand: 45, historicalShortfall: 60 },
    { id: 'NGO-2', name: 'St. Jude Youth Sanctuary', tier: 'Medium Capacity' as const, currentDemand: 70, historicalShortfall: 20 },
    { id: 'NGO-3', name: 'Apex Metropolitan Shelter', tier: 'High Capacity' as const, currentDemand: 110, historicalShortfall: 0 },
    { id: 'NGO-4', name: 'Prerana Rural Literacy Mission', tier: 'Grassroots / Small' as const, currentDemand: 35, historicalShortfall: 40 }
  ]);
  const [ascaResult, setAscaResult] = useState(() => executeAscaInteractiveCalculation({
    availableBatchSupply: 120,
    alpha: 0.50,
    beta: 0.50,
    ngos: [
      { id: 'NGO-1', name: 'Richa Children Learning Center', tier: 'Grassroots / Small', currentDemand: 45, historicalShortfall: 60 },
      { id: 'NGO-2', name: 'St. Jude Youth Sanctuary', tier: 'Medium Capacity', currentDemand: 70, historicalShortfall: 20 },
      { id: 'NGO-3', name: 'Apex Metropolitan Shelter', tier: 'High Capacity', currentDemand: 110, historicalShortfall: 0 },
      { id: 'NGO-4', name: 'Prerana Rural Literacy Mission', tier: 'Grassroots / Small', currentDemand: 35, historicalShortfall: 40 }
    ]
  }));

  const handleRunAsca = () => {
    const res = executeAscaInteractiveCalculation({
      availableBatchSupply: Number(ascaSupply),
      alpha: Number(ascaAlpha),
      beta: Number(ascaBeta),
      ngos: ascaNgos
    });
    setAscaResult(res);
  };

  const updateNgoField = (index: number, field: 'currentDemand' | 'historicalShortfall', value: number) => {
    const updated = [...ascaNgos];
    updated[index] = { ...updated[index], [field]: Math.max(0, value) };
    setAscaNgos(updated);
  };

  // ==========================================================================
  // CODE BLOCKS (SYNTAX HIGHLIGHTED PSEUDOCODE)
  // ==========================================================================
  const pseudocodeEligibility = `ALGORITHM DonationEligibilityValidation(Donation D, SystemParams P)
INPUT: 
    D.quantity             : Integer (> 0)
    D.approximateWeightKg  : Float (> 0.0)
    D.condition            : String {'Usable', 'Needs Sorting', 'Not Suitable'}
    D.cityDistanceKm       : Float (>= 0.0)
    P.minDispatchWeightKg  : Float (Default: 5.0 kg)
    P.minDispatchQuantity  : Integer (Default: 15 items)
    P.maxServiceDistanceKm : Float (Default: 30.0 km)

OUTPUT:
    isEligible             : Boolean
    channel                : String {'Doorstep Pickup', 'Hub Drop-off', 'Ineligible'}
    reason                 : String

BEGIN
    // Step 1: Input Validation
    IF (D.quantity <= 0 OR D.approximateWeightKg <= 0 OR D.cityDistanceKm < 0) THEN
        RETURN (isEligible <- FALSE, channel <- 'Ineligible', reason <- 'Invalid quantitative inputs')
    END IF

    // Step 2: Quality & Hygiene Assessment
    IF (D.condition == 'Not Suitable') THEN
        RETURN (isEligible <- FALSE, channel <- 'Ineligible', 
                reason <- 'Hazardous, bio-contaminated, or unhygienic items cannot be safely redistributed')
    END IF

    // Step 3: Reverse Logistics Routing Check
    meetsVehicleThreshold <- (D.approximateWeightKg >= P.minDispatchWeightKg OR D.quantity >= P.minDispatchQuantity)
    isWithinServiceArea   <- (D.cityDistanceKm <= P.maxServiceDistanceKm)

    IF (meetsVehicleThreshold AND isWithinServiceArea) THEN
        RETURN (isEligible <- TRUE, channel <- 'Doorstep Pickup', 
                reason <- 'Meets bulk reverse logistics thresholds for automated van dispatch')
    ELSE IF (isWithinServiceArea) THEN
        RETURN (isEligible <- TRUE, channel <- 'Hub Drop-off', 
                reason <- 'Parcel is below truck threshold; accepted at community consolidation points')
    ELSE
        RETURN (isEligible <- TRUE, channel <- 'Hub Drop-off', 
                reason <- 'Outside van dispatch radius; accepted at regional collection hub')
    END IF
END`;

  const pseudocodeClassification = `ALGORITHM MaterialClassification(MaterialItem M)
INPUT:
    M.category            : String {'Clothes', 'Books'}
    M.subType             : String (Fabric type or Paper grade)
    M.condition           : String {'Good / Usable', 'Minor Wear', 'Repairable', 'Heavily Damaged', 'Hazardous'}
    M.isCurriculumCurrent : Boolean (Applicable for books)
    M.isContaminated      : Boolean (Moisture, mildew, toxic stains)

OUTPUT:
    classification        : String {'Direct Reuse', 'Repair & Upcycle', 'Material Recycling', 'Quarantine'}
    destination           : String
    isRecyclable          : Boolean

BEGIN
    // Critical Predicate: Contaminated items cannot be mechanically recycled safely
    IF (M.isContaminated == TRUE OR M.condition == 'Hazardous') THEN
        RETURN (classification <- 'Quarantine', 
                destination <- 'Municipal Safe Waste / Sanitary Isolation',
                isRecyclable <- FALSE)
    END IF

    IF (M.category == 'Clothes') THEN
        IF (M.condition IN {'Good / Usable', 'Minor Wear'}) THEN
            RETURN (classification <- 'Direct Reuse', destination <- 'Verified Shelters & Community Centres', isRecyclable <- FALSE)
        ELSE IF (M.condition == 'Repairable') THEN
            RETURN (classification <- 'Repair & Upcycle', destination <- 'Women Self-Help Group Mending Unit', isRecyclable <- FALSE)
        ELSE IF (M.condition == 'Heavily Damaged' AND M.subType IN {'Cotton', 'Wool', 'Polyester'}) THEN
            RETURN (classification <- 'Material Recycling', destination <- 'Fibre Reclamation Mill (Shredded Yarn / Insulation)', isRecyclable <- TRUE)
        ELSE
            RETURN (classification <- 'Manual Review', destination <- 'Depot Fabric Composition Desk', isRecyclable <- FALSE)
        END IF

    ELSE IF (M.category == 'Books') THEN
        IF (M.condition IN {'Good / Usable', 'Minor Wear'}) THEN
            IF (M.isCurriculumCurrent == TRUE) THEN
                RETURN (classification <- 'Direct Reuse', destination <- 'Rural Classroom Rehoming', isRecyclable <- FALSE)
            ELSE
                RETURN (classification <- 'Direct Reuse', destination <- 'Community Reading Room / Reference Corner', isRecyclable <- FALSE)
            END IF
        ELSE IF (M.condition == 'Repairable') THEN
            RETURN (classification <- 'Repair & Upcycle', destination <- 'Spiral Binding & Book Restoration Workshop', isRecyclable <- FALSE)
        ELSE IF (M.condition == 'Heavily Damaged') THEN
            RETURN (classification <- 'Material Recycling', destination <- 'Paper Pulping Mill (De-inked Recycled Notebooks)', isRecyclable <- TRUE)
        END IF
    END IF
END`;

  const pseudocodeCollection = `ALGORITHM CollectionProgress(CollectedQty Q_c, TargetQty Q_t, VehicleCap V_cap)
INPUT:
    Q_c   : Float (>= 0.0, e.g. 65 kg)
    Q_t   : Float (> 0.0, e.g. 100 kg)
    V_cap : Float (Optional vehicle maximum capacity)

OUTPUT:
    progressPercentage : Float (%)
    remainingQuantity  : Float
    surplusQuantity    : Float
    status             : String

BEGIN
    IF (Q_c < 0.0) THEN
        THROW Error("Collected quantity cannot be negative")
    END IF

    IF (Q_t <= 0.0) THEN
        THROW Error("Collection target must be strictly positive (prevent division by zero)")
    END IF

    // 1. Calculate Collection Progress Percentage
    progressPercentage <- (Q_c / Q_t) * 100.0

    // 2. Calculate Remaining Deficit
    remainingQuantity  <- MAX(0.0, Q_t - Q_c)

    // 3. Calculate Surplus (if target exceeded)
    surplusQuantity    <- MAX(0.0, Q_c - Q_t)

    // 4. Status Evaluation
    IF (Q_c == 0.0) THEN
        status <- 'Zero Progress'
    ELSE IF (Q_c >= Q_t) THEN
        status <- (surplusQuantity > 0.0) ? 'Target Exceeded' : 'Target Achieved'
    ELSE
        status <- 'In Progress'
    END IF

    RETURN (progressPercentage, remainingQuantity, surplusQuantity, status)
END`;

  const pseudocodeDiversion = `ALGORITHM CircularMaterialImpact(TotalMass Q_total, ReusedMass Q_reuse, RecycledMass Q_recycle, ResidueMass Q_residue)
INPUT:
    Q_total   : Float (> 0.0, Total processed mass in kg)
    Q_reuse   : Float (>= 0.0, Mass diverted for direct rehoming in kg)
    Q_recycle : Float (>= 0.0, Mass sent for mechanical fibre/paper recycling in kg)
    Q_residue : Float (>= 0.0, Non-recoverable contaminated residue in kg)

OUTPUT:
    reuseRate        : Float (%)
    recyclingRate    : Float (%)
    diversionRate    : Float (%)
    residualLossRate : Float (%)

BEGIN
    // Validate Conservation of Mass
    IF (Q_total <= 0.0) THEN
        THROW Error("Total processed quantity must be greater than zero")
    END IF

    IF (Q_reuse + Q_recycle > Q_total) THEN
        THROW Error("Reused and recycled sum cannot exceed total mass")
    END IF

    // Derived residue if not provided
    actualResidue <- (Q_residue >= 0.0) ? Q_residue : (Q_total - (Q_reuse + Q_recycle))

    // Formulations
    reuseRate        <- (Q_reuse / Q_total) * 100.0
    recyclingRate    <- (Q_recycle / Q_total) * 100.0
    diversionRate    <- ((Q_reuse + Q_recycle) / Q_total) * 100.0
    residualLossRate <- (actualResidue / Q_total) * 100.0

    RETURN (reuseRate, recyclingRate, diversionRate, residualLossRate)
END`;

  const pseudocodeAsca = `ALGORITHM AdaptiveShortfallCreditAllocation(BatchSupply B, Candidates C, Weight alpha, Weight beta)
INPUT:
    B             : Float (Available quantity in batch, B > 0)
    C[1..N]       : List of NGOs with currentDemand d_i and historicalShortfall S_i
    alpha, beta   : Weights where alpha + beta == 1.0 (Default: alpha = 0.5, beta = 0.5)

OUTPUT:
    Allocations a_i   : Units given to each NGO
    UpdatedShortfall  : New credit S_i(t) for subsequent rounds
    JainsFairness     : Equity metric J(x)

BEGIN
    // Step 1: Normalization
    totalDemand    <- SUM(C[i].currentDemand for i in 1..N)
    totalShortfall <- SUM(C[i].historicalShortfall for i in 1..N)

    FOR EACH ngo i IN C DO:
        normDemand[i]    <- C[i].currentDemand / totalDemand
        normShortfall[i] <- (totalShortfall > 0) ? (C[i].historicalShortfall / totalShortfall) : (1.0 / N)

        // Step 2: Compute ASCA Priority Score
        P[i] <- (alpha * normDemand[i]) + (beta * normShortfall[i])
    END FOR

    // Step 3: Rank descending by priority score
    RankedList <- SORT_DESCENDING(C by P[i])

    // Step 4: Constrained Waterfilling Allocation
    remainingSupply <- B
    FOR EACH ngo i IN RankedList DO:
        allocated[i]    <- MIN(remainingSupply, i.currentDemand)
        remainingSupply <- remainingSupply - allocated[i]

        // Step 5: Update Historical Shortfall Memory for Round t+1
        unmet[i]        <- MAX(0, i.currentDemand - allocated[i])
        newShortfall[i] <- i.historicalShortfall + unmet[i]
        satRatio[i]     <- allocated[i] / i.currentDemand
    END FOR

    // Step 6: Compute Jain's Fairness Index
    JFI <- (SUM(satRatio[i])^2) / (N * SUM(satRatio[i]^2))

    RETURN (allocated, newShortfall, JFI)
END`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-semibold border border-emerald-800">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>MCA Academic Viva & Algorithm Evaluation Workbench</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-stone-50">
              ASCA Algorithms & Working Calculations
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Interactive demonstration of the core reverse logistics algorithms, mathematical formulas, pseudocode, validation checks, and live step-by-step calculations implemented in the ASCA platform.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-stone-800 p-1.5 rounded-2xl border border-stone-700 shrink-0">
            <div className="text-[11px] text-stone-400 font-mono px-2 py-1">
              Select Algorithm:
            </div>
          </div>
        </div>

        {/* Algorithm Tabs */}
        <div className="mt-8 pt-6 border-t border-stone-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {[
            { id: 'eligibility', label: '1. Donation Eligibility', icon: ShieldCheck, badge: 'Validation' },
            { id: 'classification', label: '2. Material Classification', icon: Recycle, badge: 'Routing' },
            { id: 'collection', label: '3. Collection Progress', icon: Truck, badge: 'Logistics' },
            { id: 'diversion', label: '4. Circular Diversion', icon: Layers, badge: 'Mass Balance' },
            { id: 'asca-core', label: '5. ASCA Fair Priority', icon: Scale, badge: 'Fairness Core' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeAlgo === tab.id;
            return (
              <button
                key={tab.id}
                id={`btn-tab-${tab.id}`}
                onClick={() => setActiveAlgo(tab.id as any)}
                className={`p-3 rounded-2xl text-left transition-all flex flex-col justify-between border cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white border-emerald-500 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-stone-800/80 text-stone-300 border-stone-700 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-stone-400'}`} />
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                    isActive ? 'bg-emerald-900 text-emerald-200' : 'bg-stone-700 text-stone-400'
                  }`}>
                    {tab.badge}
                  </span>
                </div>
                <div className="text-xs font-bold leading-tight">
                  {tab.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          TAB 1: DONATION ELIGIBILITY ALGORITHM
         ===================================================================== */}
      {activeAlgo === 'eligibility' && (
        <div className="space-y-8">
          {/* Metadata & Purpose Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase font-mono">
                  Algorithm A
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                  Donation Eligibility & Validation Algorithm
                </h2>
              </div>
              <div className="text-xs text-stone-500 font-mono">
                Component: Donor Intake & Doorstep Dispatch
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">1. Purpose:</strong>
                Validates donor submissions to ensure that items meet physical condition criteria, minimum reverse logistics bulk thresholds for vehicle dispatch, and safe urban distance boundaries before issuing a doorstep pickup token.
              </div>
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">2. Mathematical & Decision Rules:</strong>
                <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-stone-700">
                  <li>Valid inputs: Quantity &gt; 0, Weight &gt; 0, Distance &gt;= 0.</li>
                  <li>Average density ratio: R = Weight / Quantity (0.02 &lt;= R &lt;= 20 kg/item).</li>
                  <li>Condition == 'Not Suitable' =&gt; Rejection from reverse logistics.</li>
                  <li>Doorstep Collection: (Weight &gt;= 5 kg OR Qty &gt;= 15) AND Dist &lt;= 30 km.</li>
                  <li>Hub Drop-off: Below vehicle threshold or outside direct radius.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pseudocode Panel */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-300">
                  Pseudocode: DonationEligibilityValidation
                </span>
              </div>
              <button
                onClick={() => handleCopyCode('elig', pseudocodeEligibility)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-mono text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIndex === 'elig' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'elig' ? 'Copied' : 'Copy Pseudocode'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed bg-stone-950 p-4 rounded-2xl border border-stone-800">
              {pseudocodeEligibility}
            </pre>
          </div>

          {/* Working Calculation & Interactive Inputs */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Interactive Calculation Inputs</span>
                </h3>
                <span className="text-[10px] font-mono text-stone-400">Live Execution</span>
              </div>

              {/* Viva Preset Quick-Fill Buttons */}
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase font-mono block mb-2">
                  Viva Demonstration Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => loadEligibilityPreset('eligible-pickup')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    Doorstep Bulk (30 items, 12 kg)
                  </button>
                  <button
                    onClick={() => loadEligibilityPreset('hub-dropoff')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer"
                  >
                    Small Parcel (8 items, 3.2 kg)
                  </button>
                  <button
                    onClick={() => loadEligibilityPreset('ineligible-damaged')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    Unsuitable Items (Damaged)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Donation Category
                  </label>
                  <select
                    value={eligCategory}
                    onChange={(e) => setEligCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Clothes">Clothes & Apparel</option>
                    <option value="Books">School Books & Notebooks</option>
                    <option value="School Supplies">School Supplies & Stationery</option>
                    <option value="Other Useful Items">Other Useful Household Items</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Quantity (items)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={eligQuantity}
                      onChange={(e) => setEligQuantity(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Approx. Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={eligWeight}
                      onChange={(e) => setEligWeight(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Item Condition
                  </label>
                  <select
                    value={eligCondition}
                    onChange={(e) => setEligCondition(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Usable">Usable (Clean & Wearable/Readable)</option>
                    <option value="Needs Sorting">Needs Sorting (Minor Wear/Depot Grading)</option>
                    <option value="Not Suitable">Not Suitable (Heavily Stained / Unhygienic)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Distance to Consolidation Depot (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={eligDistance}
                    onChange={(e) => setEligDistance(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Urban service dispatch limit is 30 km.
                  </span>
                </div>

                <button
                  id="btn-calculate-eligibility"
                  onClick={handleRunEligibility}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Eligibility Calculation</span>
                </button>
              </div>
            </div>

            {/* Step-by-Step Execution & Output (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Step-by-Step Calculation & Final Output</span>
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold font-mono ${
                  eligResult.isEligible 
                    ? eligResult.status === 'Eligible for Doorstep Pickup'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-blue-100 text-blue-900 border border-blue-300'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}>
                  {eligResult.status}
                </span>
              </div>

              {/* Error Message banner if any */}
              {eligResult.errorMessage && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{eligResult.errorMessage}</span>
                </div>
              )}

              {/* Step list */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase font-mono">
                  Execution Trace:
                </span>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 space-y-2">
                  {eligResult.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">
                    Calculated Density Ratio
                  </span>
                  <div className="text-xl font-bold font-mono text-stone-900 mt-1">
                    {eligResult.unitWeightRatio} kg/item
                  </div>
                  <span className="text-[11px] text-stone-400 mt-0.5 block">
                    Weight ({eligWeight} kg) ÷ Quantity ({eligQuantity})
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">
                    Operational Routing Channel
                  </span>
                  <div className="text-xl font-bold text-emerald-800 mt-1">
                    {eligResult.status}
                  </div>
                  <span className="text-[11px] text-stone-400 mt-0.5 block">
                    {eligResult.isEligible ? 'Passed Reverse Logistics Gate' : 'Filtered at Quality Check'}
                  </span>
                </div>
              </div>

              {/* Result explanation */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-stone-700 space-y-1">
                <strong className="text-emerald-950 block text-xs">Evaluation Explanation:</strong>
                <p className="leading-relaxed">{eligResult.reason}</p>
                <p className="text-emerald-900 font-medium pt-1">
                  <strong>Recommendation:</strong> {eligResult.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: MATERIAL CLASSIFICATION ALGORITHM
         ===================================================================== */}
      {activeAlgo === 'classification' && (
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase font-mono">
                  Algorithm B
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                  Donation Classification Algorithm (Reuse vs. Recycling vs. Review)
                </h2>
              </div>
              <div className="text-xs text-stone-500 font-mono">
                Component: Central Sorting Depot & Circular Supply Chain
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">1. Purpose:</strong>
                Classifies incoming textiles, books, and educational materials into downstream channels (direct community reuse, repair workshops, industrial recycling, or quarantine). Enforces the critical rule: <em>"Do not assume every damaged item is recyclable"</em> (e.g. contaminated, wet, or moldy items).
              </div>
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">2. Classification Rules:</strong>
                <ul className="list-disc pl-4 space-y-1 font-mono text-[11px] text-stone-700">
                  <li>IF Contaminated == true =&gt; Quarantine / Non-Recyclable Rejection.</li>
                  <li>Usable Clothes / Books =&gt; Direct Community / School Redistribution.</li>
                  <li>Repairable Items =&gt; Women Self-Help Groups / Book-binding Clinics.</li>
                  <li>Damaged Cotton/Wool =&gt; Fibre Reclamation (Insulation / Recycled Yarn).</li>
                  <li>Damaged Books =&gt; Paper Pulping (Recycled Student Notebooks).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pseudocode Panel */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-300">
                  Pseudocode: MaterialClassification
                </span>
              </div>
              <button
                onClick={() => handleCopyCode('class', pseudocodeClassification)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-mono text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIndex === 'class' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'class' ? 'Copied' : 'Copy Pseudocode'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed bg-stone-950 p-4 rounded-2xl border border-stone-800">
              {pseudocodeClassification}
            </pre>
          </div>

          {/* Working Calculation & Interactive Inputs */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Depot Sorting Simulation Inputs</span>
                </h3>
                <span className="text-[10px] font-mono text-stone-400">Interactive</span>
              </div>

              {/* Presets */}
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase font-mono block mb-2">
                  Viva Demonstration Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => loadClassificationPreset('reuse-clothes')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    Clothes: Direct Reuse
                  </button>
                  <button
                    onClick={() => loadClassificationPreset('recycle-textile')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer"
                  >
                    Clothes: Fibre Recycling
                  </button>
                  <button
                    onClick={() => loadClassificationPreset('reuse-books')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer"
                  >
                    Books: Syllabus Textbook
                  </button>
                  <button
                    onClick={() => loadClassificationPreset('reject-contaminated')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-800 border border-red-200 hover:bg-red-100 transition-all cursor-pointer"
                  >
                    Contaminated (Not Recyclable)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Primary Stream
                  </label>
                  <select
                    value={classMaterialCat}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      setClassMaterialCat(cat);
                      setClassSubType(cat === 'Clothes' ? '100% Cotton Garment' : 'Current Curriculum Textbook');
                    }}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Clothes">Apparel & Textiles</option>
                    <option value="Books">School Books & Educational Paper</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Sub-Type / Composition Grade
                  </label>
                  {classMaterialCat === 'Clothes' ? (
                    <select
                      value={classSubType}
                      onChange={(e) => setClassSubType(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="100% Cotton Garment">100% Cotton (Wearable / High Recyclability)</option>
                      <option value="Wool / Acrylic Knitwear">Wool / Knitwear (Warmth / Fibre Reclamation)</option>
                      <option value="Polyester / Synthetic">Polyester / Synthetic (Fleece / Technical Fabric)</option>
                      <option value="Complex Mixed Blend">Complex Composite / Unknown Blend</option>
                      <option value="Rain-soaked Bedding / Moldy Textiles">Severely Soiled / Oil-Stained Textiles</option>
                    </select>
                  ) : (
                    <select
                      value={classSubType}
                      onChange={(e) => setClassSubType(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                    >
                      <option value="Grade 8 Science & Mathematics Textbooks">Current Syllabus School Textbook</option>
                      <option value="General Fiction & Children Storybooks">General Reading / Children Storybook</option>
                      <option value="Discontinued Syllabus 2012 Edition">Outdated Syllabus Curriculum Book</option>
                      <option value="Defaced / Torn Exercise Notebooks">Torn / Defaced Exercise Notebooks</option>
                      <option value="Bio-Contaminated / Mildew Book">Water-logged / Mildew-infested Book</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Inspected Condition Degree
                  </label>
                  <select
                    value={classCondition}
                    onChange={(e) => setClassCondition(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Good / Usable">Good / Usable (Ready for immediate handover)</option>
                    <option value="Minor Wear / Clean">Minor Wear / Clean (Light use, structurally intact)</option>
                    <option value="Repairable / Light Defects">Repairable (Missing buttons / loose binding)</option>
                    <option value="Heavily Damaged / Torn">Heavily Damaged / Torn (Non-wearable / shredding candidate)</option>
                    <option value="Hazardous / Wet / Contaminated">Hazardous / Wet / Mildew / Bio-hazard</option>
                  </select>
                </div>

                {classMaterialCat === 'Books' && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200">
                    <input
                      type="checkbox"
                      id="curriculum-check"
                      checked={classCurriculumCurrent}
                      onChange={(e) => setClassCurriculumCurrent(e.target.checked)}
                      className="rounded accent-emerald-700 cursor-pointer"
                    />
                    <label htmlFor="curriculum-check" className="text-xs text-stone-700 cursor-pointer">
                      Is this textbook aligned with the <strong>current academic syllabus</strong>?
                    </label>
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <input
                    type="checkbox"
                    id="contam-check"
                    checked={classIsContaminated}
                    onChange={(e) => setClassIsContaminated(e.target.checked)}
                    className="rounded accent-red-700 cursor-pointer"
                  />
                  <label htmlFor="contam-check" className="text-xs text-stone-700 cursor-pointer">
                    Contains biological, water, mold, or toxic chemical contamination?
                  </label>
                </div>

                <button
                  id="btn-calculate-classification"
                  onClick={handleRunClassification}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Classification Algorithm</span>
                </button>
              </div>
            </div>

            {/* Execution Trace & Decision Output */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Downstream Channel Output</span>
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  classResult.canReuse
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : classResult.isRecyclable
                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                    : 'bg-red-100 text-red-900 border border-red-300'
                }`}>
                  {classResult.classification}
                </span>
              </div>

              {/* Execution Steps */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase font-mono">
                  Algorithm Decision Path:
                </span>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 space-y-2">
                  {classResult.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Routing Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-stone-500">
                    Downstream Reverse Logistics Facility
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded font-bold ${classResult.canReuse ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-200 text-stone-600'}`}>
                      Reuse: {classResult.canReuse ? 'YES' : 'NO'}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold ${classResult.isRecyclable ? 'bg-blue-100 text-blue-900' : 'bg-stone-200 text-stone-600'}`}>
                      Recycle: {classResult.isRecyclable ? 'YES' : 'NO'}
                    </span>
                  </div>
                </div>
                <div className="text-base font-extrabold text-stone-900">
                  {classResult.downstreamDestination}
                </div>
              </div>

              {/* Explanation */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-stone-700 space-y-1">
                <strong className="text-emerald-950 block text-xs">Technical Explanation:</strong>
                <p className="leading-relaxed">{classResult.reason}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: COLLECTION PROGRESS ALGORITHM
         ===================================================================== */}
      {activeAlgo === 'collection' && (
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase font-mono">
                  Algorithm C
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                  Collection Progress & Logistics Capacity Algorithm
                </h2>
              </div>
              <div className="text-xs text-stone-500 font-mono">
                Component: Collection Runs (e.g. CR-021) & Vehicle Routing
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">1. Purpose:</strong>
                Dynamically computes collection fulfillment against planned batch targets, calculates remaining deficits or surpluses, checks vehicle payload utilization, and handles boundary inputs (preventing division by zero or negative loads).
              </div>
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">2. Mathematical Formulas:</strong>
                <div className="space-y-1.5 font-mono text-[11px] text-stone-800 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <p>Progress (%) = (Collected Quantity / Collection Target) × 100</p>
                  <p>Remaining Quantity = max(0, Collection Target - Collected Quantity)</p>
                  <p>Surplus Quantity = max(0, Collected Quantity - Collection Target)</p>
                  <p>Vehicle Utilization = (Collected Quantity / Vehicle Capacity) × 100</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pseudocode Panel */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-300">
                  Pseudocode: CollectionProgress
                </span>
              </div>
              <button
                onClick={() => handleCopyCode('coll', pseudocodeCollection)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-mono text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIndex === 'coll' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'coll' ? 'Copied' : 'Copy Pseudocode'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed bg-stone-950 p-4 rounded-2xl border border-stone-800">
              {pseudocodeCollection}
            </pre>
          </div>

          {/* Working Calculation & Interactive Inputs */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Collection Run Inputs</span>
                </h3>
                <span className="text-[10px] font-mono text-stone-400">Dynamic</span>
              </div>

              {/* Presets */}
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase font-mono block mb-2">
                  Viva Demonstration Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => loadCollectionPreset('mentor-example')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer font-mono"
                  >
                    Mentor Spec (65 kg / 100 kg)
                  </button>
                  <button
                    onClick={() => loadCollectionPreset('in-progress')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer font-mono"
                  >
                    Items Mode (140 / 250 items)
                  </button>
                  <button
                    onClick={() => loadCollectionPreset('target-achieved')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer font-mono"
                  >
                    100% Exact Match
                  </button>
                  <button
                    onClick={() => loadCollectionPreset('exceeded')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100 transition-all cursor-pointer font-mono"
                  >
                    Surplus (120 kg / 100 kg)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Collected Quantity
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={colCollected}
                      onChange={(e) => setColCollected(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Target Quota
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={colTarget}
                      onChange={(e) => setColTarget(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Unit of Measure
                    </label>
                    <select
                      value={colUnit}
                      onChange={(e) => setColUnit(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-mono"
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="items">Items / Units</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Vehicle Capacity (Optional)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="1"
                      value={colVehicleCap}
                      onChange={(e) => setColVehicleCap(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                    />
                  </div>
                </div>

                <button
                  id="btn-calculate-collection"
                  onClick={handleRunCollection}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Progress Calculation</span>
                </button>
              </div>
            </div>

            {/* Step-by-Step Execution & Output */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Mathematical Execution & Progress Output</span>
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {colResult.status}
                </span>
              </div>

              {/* Progress Bar Visual */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-stone-700">Collection Target Progress</span>
                  <span className="text-emerald-800">{colResult.progressPercentage}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-stone-100 border border-stone-200 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      colResult.progressPercentage >= 100 ? 'bg-emerald-600' : 'bg-emerald-700'
                    }`}
                    style={{ width: `${Math.min(100, colResult.progressPercentage)}%` }}
                  />
                </div>
              </div>

              {/* Step Trace */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase font-mono">
                  Calculation Derivation:
                </span>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 space-y-2">
                  {colResult.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Output Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">
                    Collection Progress
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-emerald-800 mt-1">
                    {colResult.progressPercentage}%
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">
                    Remaining Deficit
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-stone-900 mt-1">
                    {colResult.remainingQuantity} {colUnit}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-500 uppercase font-mono block">
                    Vehicle Utilization
                  </span>
                  <div className="text-2xl font-extrabold font-mono text-blue-800 mt-1">
                    {colResult.capacityUtilization ? `${colResult.capacityUtilization}%` : 'N/A'}
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-stone-700 space-y-1">
                <strong className="text-emerald-950 block text-xs">Logistics Interpretation:</strong>
                <p className="leading-relaxed">{colResult.explanation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: CIRCULAR DIVERSION & IMPACT ALGORITHM
         ===================================================================== */}
      {activeAlgo === 'diversion' && (
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase font-mono">
                  Algorithm D
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                  Circular Material Diversion & Reuse/Recycling Impact Algorithm
                </h2>
              </div>
              <div className="text-xs text-stone-500 font-mono">
                Component: Urban Reverse Logistics Mass Balance & Impact Reporting
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">1. Purpose:</strong>
                Performs verified mass-balance calculations across processed urban materials. Determines the precise percentage routed for direct redistribution versus industrial downcycling, avoiding fabricated or unsubstantiated environmental claims.
              </div>
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">2. Mathematical Formulas:</strong>
                <div className="space-y-1.5 font-mono text-[11px] text-stone-800 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <p>Reuse Rate (%) = (Q_reused / Q_total) × 100</p>
                  <p>Recycling Rate (%) = (Q_recycled / Q_total) × 100</p>
                  <p>Landfill Diversion Rate (%) = ((Q_reused + Q_recycled) / Q_total) × 100</p>
                  <p>Residue Loss Rate (%) = (Q_residue / Q_total) × 100</p>
                  <p className="text-stone-500">Constraint: Q_reused + Q_recycled + Q_residue == Q_total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pseudocode Panel */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-300">
                  Pseudocode: CircularMaterialImpact
                </span>
              </div>
              <button
                onClick={() => handleCopyCode('div', pseudocodeDiversion)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-mono text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIndex === 'div' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'div' ? 'Copied' : 'Copy Pseudocode'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed bg-stone-950 p-4 rounded-2xl border border-stone-800">
              {pseudocodeDiversion}
            </pre>
          </div>

          {/* Working Calculation & Interactive Inputs */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Form */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <span>Depot Batch Mass Inputs</span>
                </h3>
                <span className="text-[10px] font-mono text-stone-400">Kilograms</span>
              </div>

              {/* Presets */}
              <div>
                <label className="text-[11px] font-bold text-stone-500 uppercase font-mono block mb-2">
                  Viva Demonstration Presets:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => loadDiversionPreset('balanced-depot')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all cursor-pointer font-mono"
                  >
                    1,000 kg Balanced Run
                  </button>
                  <button
                    onClick={() => loadDiversionPreset('textile-heavy')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-all cursor-pointer font-mono"
                  >
                    500 kg Textile Focus
                  </button>
                  <button
                    onClick={() => loadDiversionPreset('books-heavy')}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all cursor-pointer font-mono"
                  >
                    800 kg School Books Drive
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Total Processed Material Mass (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={divTotal}
                    onChange={(e) => setDivTotal(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Direct Reused Mass (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={divReused}
                      onChange={(e) => setDivReused(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Recycled Mass (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={divRecycled}
                      onChange={(e) => setDivRecycled(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Unusable / Contaminated Residue (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={divResidue}
                    onChange={(e) => setDivResidue(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Calculated mass: {Math.max(0, divTotal - (divReused + divRecycled))} kg
                  </span>
                </div>

                <button
                  id="btn-calculate-diversion"
                  onClick={handleRunDiversion}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Diversion Calculation</span>
                </button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-150">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Mass Balance Breakdown & Landfill Diversion</span>
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                  Diversion: {divResult.diversionRate}%
                </span>
              </div>

              {/* Mass balance visual bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-emerald-800">Reused: {divResult.reuseRate}%</span>
                  <span className="text-blue-800">Recycled: {divResult.recyclingRate}%</span>
                  <span className="text-stone-500">Residue: {divResult.residueRate}%</span>
                </div>
                <div className="w-full h-4 rounded-full bg-stone-100 border border-stone-200 overflow-hidden flex">
                  <div className="bg-emerald-600 h-full" style={{ width: `${divResult.reuseRate}%` }} />
                  <div className="bg-blue-600 h-full" style={{ width: `${divResult.recyclingRate}%` }} />
                  <div className="bg-stone-400 h-full" style={{ width: `${divResult.residueRate}%` }} />
                </div>
              </div>

              {/* Calculation Derivation Trace */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase font-mono">
                  Mass Balance Equations:
                </span>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 space-y-2">
                  {divResult.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                  <span className="text-[10px] text-emerald-800 uppercase font-mono block">Direct Reuse</span>
                  <div className="text-xl font-bold font-mono text-emerald-900 mt-1">{divResult.reusedKg} kg</div>
                  <span className="text-[11px] text-emerald-700 font-mono">({divResult.reuseRate}%)</span>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-center">
                  <span className="text-[10px] text-blue-800 uppercase font-mono block">Recycled</span>
                  <div className="text-xl font-bold font-mono text-blue-900 mt-1">{divResult.recycledKg} kg</div>
                  <span className="text-[11px] text-blue-700 font-mono">({divResult.recyclingRate}%)</span>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-100/60 border border-emerald-300 text-center">
                  <span className="text-[10px] text-emerald-900 uppercase font-mono block font-bold">Net Diversion</span>
                  <div className="text-xl font-extrabold font-mono text-emerald-950 mt-1">{divResult.diversionRate}%</div>
                  <span className="text-[11px] text-emerald-800 font-mono">Diverted from Landfill</span>
                </div>

                <div className="p-3 rounded-2xl bg-stone-100 border border-stone-200 text-center">
                  <span className="text-[10px] text-stone-600 uppercase font-mono block">Residual Loss</span>
                  <div className="text-xl font-bold font-mono text-stone-800 mt-1">{divResult.residueKg} kg</div>
                  <span className="text-[11px] text-stone-500 font-mono">({divResult.residueRate}%)</span>
                </div>
              </div>

              {/* Explanation */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-stone-700 space-y-1">
                <strong className="text-emerald-950 block text-xs">Sustainability Interpretation:</strong>
                <p className="leading-relaxed">{divResult.explanation}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: ASCA CORE FAIR ALLOCATION ENGINE
         ===================================================================== */}
      {activeAlgo === 'asca-core' && (
        <div className="space-y-8">
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase font-mono">
                  Algorithm E - Core Project Innovation
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
                  Adaptive Shortfall Credit Allocation (ASCA) Priority & Anti-Starvation Algorithm
                </h2>
              </div>
              <div className="text-xs text-stone-500 font-mono">
                Component: ASCA Batch Matcher & Fair Redistribution
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 text-xs text-stone-600 leading-relaxed">
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">1. Purpose:</strong>
                Eliminates the chronic starvation of grassroots organizations under constrained donation batches. By combining active demand with historical accumulated shortfall credit, ASCA guarantees that organizations that received less in round <em>t-1</em> automatically rise in priority in round <em>t</em>.
              </div>
              <div>
                <strong className="text-stone-900 block mb-1 text-sm font-sans">2. Mathematical Formulation:</strong>
                <div className="space-y-1.5 font-mono text-[11px] text-stone-800 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <p>Priority Score: P_i(t) = α · d̂_i(t) + β · Ŝ_i(t-1)</p>
                  <p>Normalized Demand: d̂_i(t) = d_i(t) / Σ d_j(t)</p>
                  <p>Normalized Shortfall: Ŝ_i(t-1) = S_i(t-1) / Σ S_j(t-1)</p>
                  <p>Memory Update: S_i(t) = S_i(t-1) + max(0, d_i(t) - a_i(t))</p>
                  <p>Jain’s Fairness Index: J(x) = (Σ x_i)² / (N · Σ x_i²)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pseudocode Panel */}
          <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 border border-stone-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800 mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-stone-300">
                  Pseudocode: AdaptiveShortfallCreditAllocation
                </span>
              </div>
              <button
                onClick={() => handleCopyCode('asca', pseudocodeAsca)}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-[11px] font-mono text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedIndex === 'asca' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 'asca' ? 'Copied' : 'Copy Pseudocode'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed bg-stone-950 p-4 rounded-2xl border border-stone-800">
              {pseudocodeAsca}
            </pre>
          </div>

          {/* Working Calculation & Interactive Simulation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-150">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-700" />
                  <span>Interactive ASCA Batch Allocation Engine</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Adjust available batch supply, weights, and NGO demands/shortfalls. Run algorithm to observe priority re-ranking and waterfilling allocation.
                </p>
              </div>

              <button
                id="btn-run-asca-calculation"
                onClick={handleRunAsca}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 hover:bg-emerald-900 text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Calculate ASCA Allocations</span>
              </button>
            </div>

            {/* Sliders: Batch Supply & Weights */}
            <div className="grid sm:grid-cols-3 gap-6 p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-stone-700">Available Batch Supply (B)</span>
                  <span className="text-emerald-800 font-mono">{ascaSupply} units</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={ascaSupply}
                  onChange={(e) => setAscaSupply(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>50 units (High Scarcity)</span>
                  <span>300 units</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-stone-700">Demand Weight (α)</span>
                  <span className="text-stone-900 font-mono">α = {ascaAlpha.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={ascaAlpha}
                  onChange={(e) => {
                    const a = Number(e.target.value);
                    setAscaAlpha(a);
                    setAscaBeta(Number((1 - a).toFixed(2)));
                  }}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>0.10</span>
                  <span>0.90</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-stone-700">Shortfall Credit Weight (β)</span>
                  <span className="text-emerald-800 font-mono">β = {ascaBeta.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.90"
                  step="0.05"
                  value={ascaBeta}
                  onChange={(e) => {
                    const b = Number(e.target.value);
                    setAscaBeta(b);
                    setAscaAlpha(Number((1 - b).toFixed(2)));
                  }}
                  className="w-full accent-emerald-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
                  <span>0.10 (Low Memory)</span>
                  <span>0.90 (High Credit)</span>
                </div>
              </div>
            </div>

            {/* Candidate NGOs Table with Editable Demand & Shortfall */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">
                  Candidate Organizations (Modify Inputs to Test):
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  Total Active Demand: {ascaResult.totalDemand} units
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-mono uppercase text-[11px]">
                      <th className="py-2.5 px-3">Organization Name</th>
                      <th className="py-2.5 px-3">Tier</th>
                      <th className="py-2.5 px-3 text-center">Active Demand d(i,t)</th>
                      <th className="py-2.5 px-3 text-center">Historical Shortfall S(i,t-1)</th>
                      <th className="py-2.5 px-3 text-right">Norm. Demand d̂</th>
                      <th className="py-2.5 px-3 text-right">Norm. Shortfall Ŝ</th>
                      <th className="py-2.5 px-3 text-center">ASCA Priority P(i)</th>
                      <th className="py-2.5 px-3 text-center">Rank</th>
                      <th className="py-2.5 px-3 text-right">Allocated</th>
                      <th className="py-2.5 px-3 text-right">Updated Shortfall</th>
                      <th className="py-2.5 px-3 text-center">Satisfaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150">
                    {ascaResult.rankedNgos.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-stone-900">
                          {item.name}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.tier === 'Grassroots / Small'
                              ? 'bg-amber-100 text-amber-800'
                              : item.tier === 'Medium Capacity'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-stone-200 text-stone-700'
                          }`}>
                            {item.tier}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={item.currentDemand}
                            onChange={(e) => {
                              const origIdx = ascaNgos.findIndex(n => n.id === item.id);
                              if (origIdx !== -1) updateNgoField(origIdx, 'currentDemand', Number(e.target.value));
                            }}
                            className="w-16 text-center text-xs p-1 rounded border border-stone-300 font-mono"
                          />
                        </td>
                        <td className="py-3 px-3 text-center">
                          <input
                            type="number"
                            min="0"
                            value={item.historicalShortfall}
                            onChange={(e) => {
                              const origIdx = ascaNgos.findIndex(n => n.id === item.id);
                              if (origIdx !== -1) updateNgoField(origIdx, 'historicalShortfall', Number(e.target.value));
                            }}
                            className="w-16 text-center text-xs p-1 rounded border border-stone-300 font-mono text-emerald-800 font-bold"
                          />
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-stone-600">
                          {item.normalizedDemand.toFixed(3)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-800 font-bold">
                          {item.normalizedShortfall.toFixed(3)}
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-extrabold text-emerald-900 bg-emerald-50/60">
                          {item.priorityScore.toFixed(4)}
                        </td>
                        <td className="py-3 px-3 text-center font-bold">
                          <span className="w-6 h-6 rounded-full bg-stone-900 text-white inline-flex items-center justify-center text-[10px]">
                            #{item.rank}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                          {item.allocatedQuantity} units
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-stone-600">
                          {item.updatedShortfall} units
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            item.satisfactionRatio >= 80 
                              ? 'bg-emerald-100 text-emerald-900' 
                              : item.satisfactionRatio >= 40 
                              ? 'bg-amber-100 text-amber-900' 
                              : 'bg-red-100 text-red-900'
                          }`}>
                            {item.satisfactionRatio}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Output KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-mono block">
                  Jain’s Fairness Index (JFI)
                </span>
                <div className="text-2xl font-extrabold font-mono text-emerald-800 mt-1">
                  {ascaResult.jainsFairnessIndex.toFixed(3)}
                </div>
                <span className="text-[11px] text-stone-400 mt-0.5 block">
                  J(x) = (Σx)² / (N · Σx²)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-mono block">
                  Worst-Off Satisfaction (Anti-Starvation)
                </span>
                <div className="text-2xl font-extrabold font-mono text-emerald-800 mt-1">
                  {ascaResult.worstOffSatisfaction}%
                </div>
                <span className="text-[11px] text-stone-400 mt-0.5 block">
                  Minimum satisfaction guaranteed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-mono block">
                  Total Allocated vs Supply
                </span>
                <div className="text-2xl font-extrabold font-mono text-stone-900 mt-1">
                  {ascaResult.totalAllocated} / {ascaSupply}
                </div>
                <span className="text-[11px] text-stone-400 mt-0.5 block">
                  {ascaResult.remainingSupply} units batch surplus remaining
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-500 uppercase font-mono block">
                  Global Mean Satisfaction
                </span>
                <div className="text-2xl font-extrabold font-mono text-stone-900 mt-1">
                  {ascaResult.globalMeanSatisfaction}%
                </div>
                <span className="text-[11px] text-stone-400 mt-0.5 block">
                  Across all active partner NGOs
                </span>
              </div>
            </div>

            {/* Step Trace */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase font-mono">
                Sequential Allocation Trace:
              </span>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 font-mono text-xs text-stone-800 space-y-2">
                {ascaResult.steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Result Explanation */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-stone-700 space-y-1">
              <strong className="text-emerald-950 block text-xs">MCA Research Finding & Viva Defense:</strong>
              <p className="leading-relaxed">{ascaResult.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
