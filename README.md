# Adaptive Shortfall Credit Allocation (ASCA)

**Fair Sequential Donation Distribution Among Nonprofit Organizations**  
*An MCA Research Project*

---

## 🎯 Executive Summary
Traditional charitable donation and surplus-item allocation platforms operate **memorylessly**: each donation round is treated as an isolated event. Consequently, high-capacity metropolitan organizations receive donations repeatedly, while smaller grassroots organizations suffer from **chronic starvation** because their single-round demands appear smaller or less prominent.

The **Adaptive Shortfall Credit Allocation (ASCA)** system introduces **sequential historical memory** into donation matching:
1. When an NGO receives fewer items than requested in Round $t$, the unmet deficit is converted into **Shortfall Credit** $S_i$.
2. In Round $t+1$, ASCA prioritizes organizations by evaluating both current demand and accumulated shortfall credit.
3. Starvation penalties automatically escalate priority if an NGO has been bypassed across consecutive rounds.

---

## 🔑 Demo Access Credentials

The platform runs in **Demo Authentication Mode** for instant presentation and review without external database setup.

| Role | Username / Identifier | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Donor** | `rumana.donor` | `Rumana@123` | `/donor/dashboard` — List donations, track pickup tokens & impact |
| **NGO Partner** | `richa.ngo` | `Richa@123` | `/ngo/dashboard` — Post community needs, view shortfall credits |
| **Administrator** | `asca.admin` | `ASCA@2026` | `/admin/dashboard` — Run batches, execute ASCA allocation engine |

---

## 🧭 Application Navigation & Routing

The application strictly enforces human-centered public onboarding:
- **`/` (Public Landing Page)**: Begins with the public mission, the human story connecting unused home items with verified grassroots needs, the interactive starvation demonstration, and role selection cards.
- **`/donor/login`**: Dedicated authentication screen with demo credential autofill for donors.
- **`/ngo/login`**: Dedicated authentication screen for grassroots organizations.
- **`/admin/login`**: Administrative portal login for system supervisors.
- **`/research-lab`**: Interactive research laboratory allowing real-time adjustment of ASCA $\alpha$ and $\beta$ weighting parameters, starvation counters, and Monte Carlo round simulations.
- **Protected Routes**: Direct attempts to access `/donor/dashboard`, `/ngo/dashboard`, or `/admin/dashboard` without valid authentication display access guards redirecting to the corresponding login screen.

---

## 🔬 The ASCA Mathematical Model

The allocation priority $P_i$ for organization $i$ in category $c$ at round $t$ is calculated as:

$$P_i(t) = \alpha \cdot \frac{D_i(t)}{\max_j D_j(t)} + \beta \cdot \frac{S_i(t)}{\max_j S_j(t)} + \gamma \cdot \min\left(1, \frac{\text{RoundsStarved}_i(t)}{3}\right)$$

Where:
- $D_i(t)$ is the current round demand.
- $S_i(t) = \sum_{\tau=1}^{t-1} \max(0, D_i(\tau) - A_i(\tau))$ is the accumulated historical unmet deficit.
- $\alpha, \beta$ are balancing parameters (default: $\alpha = 0.5$, $\beta = 0.5$).
- $\gamma$ is the starvation mitigation weight (default: $\gamma = 0.2$).

---

## 📦 Future MongoDB Integration

The data structures and service layer are decoupled and ready for MongoDB:
- **TypeScript Model Blueprints**: Defined in `src/models/index.ts`.
- **Database Guide & Mongoose Schemas**: Detailed in [`docs/DATABASE_SETUP.md`](docs/DATABASE_SETUP.md).

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build
```
