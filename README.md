# ASCA Connect

Adaptive Shortfall Credit Allocation (ASCA) Connect is a demo-first web application designed to address a real problem in charitable giving and surplus-item distribution: traditional one-round allocation systems often favor already well-established organizations, while smaller grassroots NGOs repeatedly receive less than they need.

This project implements a fairer, history-aware donation allocation model that remembers unmet demand across rounds and uses it to prioritize future distributions more equitably.

---

## 🎯 Project Overview

ASCA Connect is a research-oriented platform for demonstrating how sequential donation allocation can become more just, transparent, and community-centered.

The application models a donation ecosystem where:
- Donors can contribute reusable items such as clothes, books, and school supplies.
- NGOs can post their needs and receive allocations based on current demand and historical shortfall.
- Administrators can review donations, create batches, schedule collection runs, and run the ASCA allocation engine.
- Researchers can explore the allocation logic in an interactive lab and compare ASCA against simpler policies.

The platform is built as a React + TypeScript frontend with seeded demo data, local persistence, and a research-oriented allocation engine.

---

## 🧠 Problem ASCA Solves

A common challenge in charitable systems is that allocation decisions are often treated as independent events. In practice, that means:

- Large, visible organizations frequently receive repeated support.
- Smaller or newer NGOs may have urgent needs but lower immediate visibility.
- Historical unmet demand is not remembered, so previously underserved groups remain disadvantaged.

ASCA introduces the idea of shortfall credit:

- If an NGO requested items in a previous round and did not receive enough, the unmet gap is remembered.
- In future rounds, the organization receives a higher priority score based on both current demand and accumulated historical shortfall.
- This improves fairness and reduces the starvation effect that often appears in memoryless systems.

---

## ✨ Core Features

### Public-facing experience
- Human-centered landing page explaining the mission and donation flow
- Role selection for donors, NGOs, and administrators
- Research lab for experimenting with ASCA parameters and comparing allocation policies

### Donor workflow
- Submit donation details including category, quantity, condition, and pickup information
- View donation status and pickup tokens
- Track collected and allocated donations over time

### NGO workflow
- Post requirements for items needed by beneficiary communities
- View current demand, historical shortfall, and ASCA priority signals
- Track fulfillment progress and delivery records

### Admin workflow
- Verify NGO profiles
- Approve or reject donations
- Schedule collection runs
- Create donation batches
- Run the ASCA allocation engine
- Monitor deliveries and audit logs

### Research and simulation
- Compare ASCA against FIFO, greedy-demand, and proportional allocation policies
- Measure fairness using Jain’s Fairness Index
- Explore resource utilization and satisfaction metrics across simulation rounds

---

## 🔢 ASCA Allocation Logic

The platform approximates the ASCA priority score using a weighted combination of normalized current demand and normalized historical shortfall.

The core formula is:

$$P_i(t) = \alpha \cdot \frac{D_i(t)}{\max_j D_j(t)} + \beta \cdot \frac{S_i(t)}{\max_j S_j(t)}$$

Where:
- $D_i(t)$ = current round demand for NGO $i$
- $S_i(t)$ = accumulated historical shortfall for NGO $i$
- $\alpha$ and $\beta$ are weighting parameters

In the current implementation, the default values are:
- $\alpha = 0.5$
- $\beta = 0.5$

This is used to rank candidates and distribute available donation batches fairly across NGOs.

---

## 🧭 Application Flow

### 1. Landing page
Users begin on the public landing page, where they can:
- understand the mission of the platform,
- explore how shortages are handled sequentially,
- choose a role or sign in.

### 2. Donor perspective
A donor can:
- register or log in,
- create a donation listing,
- receive a pickup token,
- track collection and allocation.

### 3. NGO perspective
An NGO can:
- log in,
- submit community needs,
- watch how ASCA prioritizes them based on demand and shortfall history,
- review delivery updates.

### 4. Admin perspective
An administrator can:
- verify organizations,
- manage donation reviews,
- create collection runs,
- prepare and allocate batches,
- execute the research-grade fairness engine.

### 5. Research lab
The research section demonstrates how ASCA performs against baseline policies and how fairness changes under different assumptions.

---

## 🔐 Demo Credentials

The project is configured for instant presentation and demo use without a database setup.

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| Donor | `rumana.donor` | `Rumana@123` | Submit donations and track pickup progress |
| NGO Partner | `richa.ngo` | `Richa@123` | Post needs and view allocation outcomes |
| Administrator | `asca.admin` | `ASCA@2026` | Manage batches, donations, and allocation runs |

> The demo mode uses seeded mock data and browser local storage, making it easy to showcase the platform in a presentation or classroom setting.

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
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── donor/
│   │   ├── ngo/
│   │   ├── public/
│   │   └── research/
│   ├── config/
│   ├── context/
│   ├── data/
│   ├── models/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── .gitignore
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── vite.config.ts
└── bun.lock
```

### Key folders
- `src/components` — UI pages and role-specific dashboards
- `src/context` — global app state and persistence logic
- `src/data` — demo seed data for donors, NGOs, batches, and audit logs
- `src/utils/asca.ts` — allocation and simulation logic
- `src/types.ts` — shared TypeScript models
- `docs/DATABASE_SETUP.md` — database integration guidance for future backend expansion

---

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind-style utility CSS
- Recharts for research visualizations
- Lucide React icons
- Local browser storage for demo persistence

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

The dev server runs on port 3000 by default.

### Build for production

```bash
npm run build
```

### Type check

```bash
npm run lint
```

---

## 📦 Data Model and Persistence

The current application uses seeded demo data and browser localStorage rather than a live backend database.

### Current data flow
- Demo users, NGOs, donations, allocations, batches, runs, deliveries, and logs are stored in `src/data/seedData.ts`
- `src/context/AppContext.tsx` loads these into application state
- State updates are persisted into browser local storage

This makes the project easy to demo and easy to extend later with a MongoDB or other backend service.

---

## 📘 MongoDB Integration Roadmap

The project is structured so that future database integration can be introduced cleanly.

Planned extension points include:
- Replace localStorage-backed state with a REST API or serverless backend
- Store NGO and donation records in MongoDB
- Persist allocation history and audit logs in a database
- Add authentication with real user accounts and secure sessions

Additional guidance is available in [`docs/DATABASE_SETUP.md`](docs/DATABASE_SETUP.md).

---

## 🧪 Research Highlights

ASCA Connect is designed not just as a product demo, but also as a research demonstration of fairness-aware allocation.

It supports:
- sequential donation memory,
- shortfall-aware prioritization,
- comparison of multiple allocation policies,
- fairness analysis using Jain’s Fairness Index,
- simulation of dynamic NGO demand over many rounds.

This makes the project useful for academic presentations, MCA research discussions, and prototype validation.

---

## ✅ Current Status

This version of the project is a fully functional demo application with:
- public landing and role-based UI,
- donor and NGO workflows,
- admin actions and allocation processing,
- an interactive research lab,
- seeded data and browser persistence.

---

## 📌 Notes for Contributors

If you are extending this project:

1. Keep the allocation logic in `src/utils/asca.ts` centralized and testable.
2. Prefer adding new models in `src/types.ts` for consistency.
3. Keep UI logic separated from business logic when possible.
4. Use the existing seeded data and local storage patterns for quick iteration.

---

## 🔗 Repository

The current project is already connected to GitHub and can be updated normally with standard git commands.

---

## 🙌 Summary

ASCA Connect demonstrates how a donation platform can be redesigned to care about fairness over time instead of just short-term matching. It combines an engaging user-facing app, a robust allocation engine, and a research lab into one coherent prototype.

If you want, the next step can be to add:
- a real backend and database,
- role-based authentication,
- deployment support for Vercel or Netlify,
- or a polished landing page with screenshots and architecture diagrams.
