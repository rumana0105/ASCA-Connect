# ASCA (Smart Reverse Logistics System for Urban Clothes and School Books Redistribution and Recycling)

**Adaptive Shortfall Credit Allocation (ASCA)** is a comprehensive, reverse logistics platform and MCA academic project designed for fair, sequential redistribution and recycling of urban surplus household items (specifically clean clothes, school books, and educational supplies).

Traditional one-shot donation distribution mechanisms rely on memoryless allocation (e.g. First-Come-First-Served / FIFO or Greedy Demand), which inevitably favors large metropolitan shelters while smaller grassroots learning centers repeatedly suffer from chronic resource starvation. ASCA solves this by introducing **historical shortfall credit**, remembering unmet community deficits across distribution rounds and ensuring provable, long-term fairness.

---

## 🎯 MCA Project Objectives

1. **Smart Urban Reverse Logistics:** Digitize doorstep collection, condition grading, consolidation runs, and delivery tracking for clothes and school books.
2. **Circular Supply Chain Routing:** Classify materials for direct community redistribution, repair/mending workshops, industrial fiber/paper recycling, or sanitary quarantine.
3. **Algorithm & Pseudocode Implementation:** Formally specify and execute the platform's core algorithms directly in the browser with live calculations, input validation, and step-by-step mathematical derivations.
4. **Anti-Starvation Fairness Guarantee:** Implement the Adaptive Shortfall Credit Allocation (ASCA) priority model and measure equity using Jain's Fairness Index ($JFI \ge 0.90$).

---

## 🧮 Algorithms & Working Calculations (Mentor Evaluation Suite)

The platform includes a dedicated **Algorithm & Pseudocode Workbench** accessible via `/algorithms` and linked directly in the navigation bar. For each algorithm, the application provides:
- Algorithm Name & Logistics Context
- Formal Pseudocode in readable, syntax-styled panels
- Mathematical Formulas
- Interactive Input Fields with boundary and error validation
- One-Click Viva Demonstration Presets
- Step-by-Step Calculation Trace
- Final Output Badge & Evaluation Explanation

---

### Algorithm A: Donation Eligibility & Validation Algorithm
* **Purpose:** Validates donor submissions, evaluates condition dignity, checks reverse logistics dispatch thresholds, and decides between automated doorstep truck collection versus community hub drop-off.
* **Validation Rules:**
  - $\text{Quantity} > 0$, $\text{Estimated Weight} > 0\text{ kg}$, $\text{Distance} \ge 0\text{ km}$.
  - Average density ratio check: $R = \frac{\text{Weight}}{\text{Quantity}}$ ($0.02 \le R \le 20.0\text{ kg/item}$).
  - Condition check: Items marked `Not Suitable` (severely stained, hazardous, or unhygienic) are rejected to protect recipient dignity and warehouse sanitation.
  - Doorstep Collection Rule: $(\text{Weight} \ge 5.0\text{ kg} \text{ OR } \text{Quantity} \ge 15\text{ items}) \text{ AND } \text{Distance} \le 30.0\text{ km}$.
  - Hub Drop-off Rule: Below vehicle threshold or outside direct van radius.

```text
ALGORITHM DonationEligibilityValidation(Donation D, SystemParams P)
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
    IF (D.quantity <= 0 OR D.approximateWeightKg <= 0 OR D.cityDistanceKm < 0) THEN
        RETURN (isEligible <- FALSE, channel <- 'Ineligible', reason <- 'Invalid quantitative inputs')
    END IF

    IF (D.condition == 'Not Suitable') THEN
        RETURN (isEligible <- FALSE, channel <- 'Ineligible', 
                reason <- 'Hazardous, bio-contaminated, or unhygienic items cannot be safely redistributed')
    END IF

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
END
```

---

### Algorithm B: Donation Classification Algorithm (Reuse vs. Recycling vs. Review)
* **Purpose:** Inspects material types and wear degrees for clothes and school books to route them into appropriate circular economy channels.
* **Core Rule:** *"Do not assume that every damaged item is recyclable."*
* **Decision Paths:**
  - **Bio-Safety Predicate:** If an item is contaminated (wet, mildew, toxic oil/chemical stains), it is routed to **Responsible Rejection / Sanitary Quarantine**.
  - **Clothes Stream:**
    - Usable / Good condition $\rightarrow$ **Direct Community Redistribution** (Shelters & centers).
    - Repairable (loose buttons / small seam tears) $\rightarrow$ **Self-Help Group Mending Workshops**.
    - Severely damaged 100% cotton / wool / polyester $\rightarrow$ **Industrial Fibre Reclamation Mill** (acoustic insulation, recycled yarn).
    - Mixed / unknown synthetic blends $\rightarrow$ **Manual Quality Review**.
  - **School Books Stream:**
    - Usable current syllabus textbooks $\rightarrow$ **Direct Educational Reuse** (Rural schools & learning centers).
    - Usable outdated curriculum $\rightarrow$ **Community Reading Rooms & Reference Libraries**.
    - Loose spines / detached binding $\rightarrow$ **Spiral Binding & Book Restoration Workshop**.
    - Severely damaged / torn / defaced $\rightarrow$ **Paper De-inking & Pulp Recycling** (New student notebooks).

```text
ALGORITHM MaterialClassification(MaterialItem M)
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
            RETURN (classification <- 'Material Recycling', destination <- 'Fibre Reclamation Mill', isRecyclable <- TRUE)
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
            RETURN (classification <- 'Repair & Upcycle', destination <- 'Spiral Binding Clinic', isRecyclable <- FALSE)
        ELSE IF (M.condition == 'Heavily Damaged') THEN
            RETURN (classification <- 'Material Recycling', destination <- 'Paper Pulping Mill (Recycled Notebooks)', isRecyclable <- TRUE)
        END IF
    END IF
END
```

---

### Algorithm C: Collection Progress & Logistics Capacity Algorithm
* **Purpose:** Dynamically calculates collection fulfillment against batch targets, remaining deficits or surpluses, and vehicle capacity utilization.
* **Validation:** Explicitly prevents division by zero ($\text{Target} \le 0$) and rejects negative values.
* **Mathematical Formulas:**
  $$\text{Collection Progress (\%)} = \left(\frac{\text{Collected Quantity}}{\text{Collection Target}}\right) \times 100$$
  $$\text{Remaining Quantity} = \max(0, \text{Collection Target} - \text{Collected Quantity})$$
  $$\text{Surplus Quantity} = \max(0, \text{Collected Quantity} - \text{Collection Target})$$
  $$\text{Vehicle Payload Utilization (\%)} = \left(\frac{\text{Collected Quantity}}{\text{Vehicle Capacity}}\right) \times 100$$

* **Working Example (Mentor Specification):**
  - **Inputs:** Collected Quantity $= 65\text{ kg}$, Collection Target $= 100\text{ kg}$, Vehicle Capacity $= 150\text{ kg}$
  - **Progress Calculation:** $(\frac{65}{100}) \times 100 = 65\%$
  - **Remaining Deficit:** $100 - 65 = 35\text{ kg}$
  - **Vehicle Utilization:** $(\frac{65}{150}) \times 100 = 43.33\%$
  - **Output:** Status: `In Progress`, Progress: `65%`, Remaining: `35 kg`.

```text
ALGORITHM CollectionProgress(CollectedQty Q_c, TargetQty Q_t, VehicleCap V_cap)
INPUT:
    Q_c   : Float (>= 0.0)
    Q_t   : Float (> 0.0)
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

    progressPercentage <- (Q_c / Q_t) * 100.0
    remainingQuantity  <- MAX(0.0, Q_t - Q_c)
    surplusQuantity    <- MAX(0.0, Q_c - Q_t)

    IF (Q_c == 0.0) THEN
        status <- 'Zero Progress'
    ELSE IF (Q_c >= Q_t) THEN
        status <- (surplusQuantity > 0.0) ? 'Target Exceeded' : 'Target Achieved'
    ELSE
        status <- 'In Progress'
    END IF

    RETURN (progressPercentage, remainingQuantity, surplusQuantity, status)
END
```

---

### Algorithm D: Circular Material Diversion & Reuse/Recycling Impact Algorithm
* **Purpose:** Computes verified material mass balance and urban landfill diversion rates across processed batches without fabricating environmental metrics.
* **Validation:** Enforces the law of conservation of mass ($Q_{\text{reused}} + Q_{\text{recycled}} \le Q_{\text{total}}$) and prevents division by zero ($Q_{\text{total}} > 0$).
* **Mathematical Formulas:**
  $$\text{Reuse Rate (\%)} = \left(\frac{Q_{\text{reused}}}{Q_{\text{total}}}\right) \times 100$$
  $$\text{Recycling Rate (\%)} = \left(\frac{Q_{\text{recycled}}}{Q_{\text{total}}}\right) \times 100$$
  $$\text{Net Landfill Diversion Rate (\%)} = \left(\frac{Q_{\text{reused}} + Q_{\text{recycled}}}{Q_{\text{total}}}\right) \times 100$$
  $$\text{Residual Loss Rate (\%)} = \left(\frac{Q_{\text{residue}}}{Q_{\text{total}}}\right) \times 100$$

* **Working Example:**
  - **Inputs:** Total Mass $= 1000\text{ kg}$, Reused $= 620\text{ kg}$, Recycled $= 330\text{ kg}$, Residue $= 50\text{ kg}$
  - **Reuse Rate:** $(\frac{620}{1000}) \times 100 = 62.0\%$
  - **Recycling Rate:** $(\frac{330}{1000}) \times 100 = 33.0\%$
  - **Net Diversion Rate:** $(\frac{620 + 330}{1000}) \times 100 = 95.0\%$
  - **Residue Rate:** $(\frac{50}{1000}) \times 100 = 5.0\%$

```text
ALGORITHM CircularMaterialImpact(TotalMass Q_total, ReusedMass Q_reuse, RecycledMass Q_recycle, ResidueMass Q_residue)
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
    IF (Q_total <= 0.0) THEN
        THROW Error("Total processed quantity must be greater than zero")
    END IF

    IF (Q_reuse + Q_recycle > Q_total) THEN
        THROW Error("Reused and recycled sum cannot exceed total mass")
    END IF

    actualResidue    <- (Q_residue >= 0.0) ? Q_residue : (Q_total - (Q_reuse + Q_recycle))
    reuseRate        <- (Q_reuse / Q_total) * 100.0
    recyclingRate    <- (Q_recycle / Q_total) * 100.0
    diversionRate    <- ((Q_reuse + Q_recycle) / Q_total) * 100.0
    residualLossRate <- (actualResidue / Q_total) * 100.0

    RETURN (reuseRate, recyclingRate, diversionRate, residualLossRate)
END
```

---

### Algorithm E: Adaptive Shortfall Credit Allocation (ASCA) Core Priority Algorithm
* **Purpose:** Solves the core research challenge of the MCA project: preventing the starvation of grassroots organizations under constrained donation batch supplies.
* **Mathematical Formulas:**
  $$P_i(t) = \alpha \cdot \hat{d}_i(t) + \beta \cdot \hat{S}_i(t-1)$$
  $$\hat{d}_i(t) = \frac{d_i(t)}{\sum_{j=1}^N d_j(t)}$$
  $$\hat{S}_i(t-1) = \frac{S_i(t-1)}{\sum_{j=1}^N S_j(t-1)}$$
  $$S_i(t) = S_i(t-1) + \max(0, d_i(t) - a_i(t))$$
  $$\text{Jain's Fairness Index: } J(x) = \frac{\left(\sum x_i\right)^2}{N \cdot \sum x_i^2}, \quad x_i = \frac{a_i(t)}{d_i(t)}$$

```text
ALGORITHM AdaptiveShortfallCreditAllocation(BatchSupply B, Candidates C, Weight alpha, Weight beta)
INPUT:
    B             : Float (Available quantity in batch, B > 0)
    C[1..N]       : List of NGOs with currentDemand d_i and historicalShortfall S_i
    alpha, beta   : Weights where alpha + beta == 1.0 (Default: alpha = 0.5, beta = 0.5)

OUTPUT:
    Allocations a_i   : Units given to each NGO
    UpdatedShortfall  : New credit S_i(t) for subsequent rounds
    JainsFairness     : Equity metric J(x)

BEGIN
    totalDemand    <- SUM(C[i].currentDemand for i in 1..N)
    totalShortfall <- SUM(C[i].historicalShortfall for i in 1..N)

    FOR EACH ngo i IN C DO:
        normDemand[i]    <- C[i].currentDemand / totalDemand
        normShortfall[i] <- (totalShortfall > 0) ? (C[i].historicalShortfall / totalShortfall) : (1.0 / N)
        P[i]             <- (alpha * normDemand[i]) + (beta * normShortfall[i])
    END FOR

    RankedList <- SORT_DESCENDING(C by P[i])

    remainingSupply <- B
    FOR EACH ngo i IN RankedList DO:
        allocated[i]    <- MIN(remainingSupply, i.currentDemand)
        remainingSupply <- remainingSupply - allocated[i]
        unmet[i]        <- MAX(0, i.currentDemand - allocated[i])
        newShortfall[i] <- i.historicalShortfall + unmet[i]
        satRatio[i]     <- allocated[i] / i.currentDemand
    END FOR

    JFI <- (SUM(satRatio[i])^2) / (N * SUM(satRatio[i]^2))

    RETURN (allocated, newShortfall, JFI)
END
```

---

## 🧭 How to Access & Demonstrate During MCA Viva

### 1. Navigation Access
* **Direct URL:** `http://localhost:3000/algorithms`
* **Desktop Navbar:** Click **"Algorithm & Pseudocode"** in the main navigation.
* **Top Notification Bar:** Click **"Algorithm & Pseudocode"** in the dark header bar.
* **Landing Page:** Scroll to the **"ASCA Algorithms & Working Calculations"** showcase section.
* **Research Lab:** Click the **"Open Algorithm Workbench"** banner in the Mathematical Formulation tab.

### 2. Recommended Viva Walkthrough (5 Minutes)
1. **Introduction:** Open `/algorithms`. Explain that ASCA models both physical reverse logistics (collection, sorting, recycling) and mathematical allocation fairness.
2. **Demonstrate Collection Progress (Algorithm C):** Click the **"Mentor Spec (65 kg / 100 kg)"** preset. Click **"Execute Progress Calculation"**. Show that the calculation derives $65\%$ progress and $35\text{ kg}$ remaining. Enter `0` in Target Quota to demonstrate the zero-division error handling.
3. **Demonstrate Donation Eligibility (Algorithm A):** Select **"Doorstep Bulk"** ($30\text{ items}, 12\text{ kg}, 8\text{ km}$) $\rightarrow$ shows **Eligible for Doorstep Pickup**. Select **"Unsuitable Items"** $\rightarrow$ shows rejection due to hygiene rules.
4. **Demonstrate Material Classification (Algorithm B):** Explain that *"not every damaged item can be recycled."* Select contaminated/moldy items to show routing to **Quarantine**. Select damaged 100% cotton to show **Fibre Reclamation**. Select current textbooks to show **Classroom Rehoming**.
5. **Demonstrate Circular Material Diversion (Algorithm D):** Load the $1000\text{ kg}$ batch. Show the mass balance breakdown: $62\%$ reuse, $33\%$ recycling, and $95\%$ net landfill diversion.
6. **Demonstrate ASCA Core Anti-Starvation (Algorithm E):** Show the editable NGO demand and historical shortfall table. Point out that a small grassroots organization with high shortfall jumps ahead of large organizations, preventing starvation and achieving a high Jain's Fairness Index ($JFI \approx 0.94$).

---

## 🔐 Demo Credentials

The platform includes pre-configured credentials for demonstration without external databases:

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Donor** | `rumana.donor` | `Rumana@123` | Submit donations, generate pickup tokens, track items |
| **NGO Partner** | `richa.ngo` | `Richa@123` | Post community requirements, monitor shortfall credits |
| **Administrator** | `asca.admin` | `ASCA@2026` | Review donations, dispatch runs, create batches, run ASCA |

---

## 🗂️ Project Structure

```text
ASCA/
├── docs/
│   └── DATABASE_SETUP.md
├── public/
│   └── assets/
├── src/
│   ├── components/
│   │   ├── admin/             # Admin dashboard, batching, logistics
│   │   ├── algorithms/        # Algorithm & Pseudocode Workbench UI
│   │   │   └── AlgorithmWorkbench.tsx
│   │   ├── auth/              # Role selection & login modals
│   │   ├── common/            # Navbar, footer, notifications
│   │   ├── donor/             # Donor space, pickup tokens
│   │   ├── ngo/               # NGO dashboard, community requirements
│   │   ├── public/            # Landing page & human impact story
│   │   └── research/          # Multi-round simulation & benchmark lab
│   ├── config/                # Demo credentials & auth configuration
│   ├── context/               # Global state (AppContext) & localStorage
│   ├── data/                  # Seed datasets (donations, NGOs, batches)
│   ├── models/                # TypeScript schemas for future MongoDB
│   ├── services/              # Client services for donation/allocation
│   ├── utils/
│   │   ├── algorithms.ts      # Core mathematical implementations & validations
│   │   └── asca.ts            # ASCA allocation & sequential simulation engine
│   ├── App.tsx                # Main router with /algorithms route
│   ├── index.css              # Styling & typography
│   ├── main.tsx               # React entry point
│   └── types.ts               # Shared domain interfaces
├── index.html
├── package.json
├── README.md
├── tsconfig.json              # Configured with include ["src"] & exclude ["node_modules", "dist"]
└── vite.config.ts
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Bundler & Dev Server:** Vite 6
- **Styling:** Vanilla CSS with Tailwind CSS utilities
- **Visualizations:** Recharts (fairness trajectories, tier parity, benchmark bars)
- **Icons:** Lucide React
- **Local Persistence:** Browser localStorage with seeded demo state

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run TypeScript Type Check
```bash
npm run lint
```
*(Executes `tsc --noEmit` on `src/` to verify type safety and compilation with 0 errors.)*

### 4. Build for Production
```bash
npm run build
```

---

## 📄 Academic Project Details

* **Project Title:** Smart Reverse Logistics System for Urban Clothes and School Books Redistribution and Recycling (ASCA)
* **Degree:** Master of Computer Applications (MCA)
* **Primary Innovation:** Adaptive Shortfall Credit Allocation (ASCA) for Temporal Anti-Starvation in Sequential Non-Profit Resource Distribution.
