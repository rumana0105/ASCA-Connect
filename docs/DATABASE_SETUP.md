# MongoDB Integration Guide & Architecture

## Overview
This application is currently running in **Demo Authentication & Prototype Persistence Mode** (using TypeScript memory & client-side storage), allowing full functional and algorithmic testing of the **Adaptive Shortfall Credit Allocation (ASCA)** system without requiring an external database cluster during demonstration.

When ready to export and deploy to a production environment with MongoDB, follow the setup instructions below.

---

## 1. Prerequisites
- **Node.js**: v18 or higher
- **MongoDB**: v6.0+ (Local Community Edition or MongoDB Atlas cluster)
- **Mongoose**: Recommended ODM (`npm install mongoose`)

---

## 2. Environment Variables
Add the following to your `.env` file:

```env
# MongoDB Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/asca_donations?retryWrites=true&w=majority

# JWT Authentication Secret
JWT_SECRET=your_super_secret_jwt_key_2026

# Application Port
PORT=3000
```

---

## 3. Database Schema Models (Mongoose Blueprints)

All TypeScript interfaces are pre-defined in `src/models/index.ts`. Here are the equivalent Mongoose schemas for the backend:

### User Schema (`models/User.js`)
```javascript
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['donor', 'ngo', 'admin'], required: true },
  phone: { type: String },
  address: { type: String },
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
```

### NGO Schema (`models/NGO.js`)
```javascript
const mongoose = require('mongoose');

const NGOSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['verified', 'pending', 'rejected'], default: 'pending' },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    latitude: Number,
    longitude: Number
  },
  categoriesAccepted: [{ type: String }],
  capacityMetric: { type: Number, default: 50 },
  shortfallCredits: {
    Clothes: { type: Number, default: 0 },
    Books: { type: Number, default: 0 },
    SchoolSupplies: { type: Number, default: 0 }
  },
  starvationRounds: {
    Clothes: { type: Number, default: 0 },
    Books: { type: Number, default: 0 },
    SchoolSupplies: { type: Number, default: 0 }
  },
  cumulativeAllocated: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NGO', NGOSchema);
```

### Donation Schema (`models/Donation.js`)
```javascript
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorName: { type: String, required: true },
  category: { type: String, enum: ['Clothes', 'Books', 'SchoolSupplies', 'Other'], required: true },
  quantity: { type: Number, required: true },
  approximateWeightKg: { type: Number, default: 0 },
  description: { type: String },
  condition: { type: String, enum: ['Excellent', 'Good', 'Usable'], default: 'Good' },
  status: { 
    type: String, 
    enum: ['pending_pickup', 'collected', 'in_batch', 'allocated', 'delivered'],
    default: 'pending_pickup' 
  },
  batchId: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationBatch' },
  pickupAddress: { type: String, required: true },
  pickupToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
```

### Requirement Schema (`models/Requirement.js`)
```javascript
const mongoose = require('mongoose');

const RequirementSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  ngoName: { type: String, required: true },
  category: { type: String, required: true },
  quantityNeeded: { type: Number, required: true },
  quantityFulfilled: { type: Number, default: 0 },
  urgency: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['open', 'partially_fulfilled', 'fulfilled'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Requirement', RequirementSchema);
```

---

## 4. Migration & API Services
The frontend already defines service adapters in `src/services/`:
- `src/services/authService.ts`
- `src/services/donationService.ts`
- `src/services/ngoService.ts`
- `src/services/allocationService.ts`

When switching from Demo Mode to MongoDB:
1. Implement standard Express REST controllers (`/api/auth`, `/api/donations`, `/api/ngos`, `/api/allocations`).
2. Replace local state mutators in `src/context/AppContext.tsx` with `fetch` calls to the Express endpoints.
3. The ASCA allocation algorithm (`src/utils/asca.ts`) can run either server-side inside an Express endpoint or via worker queues before updating the `DonationBatch` and `Allocation` collections.
