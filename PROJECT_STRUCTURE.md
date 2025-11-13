# PharmaTrust - Project Structure Overview

```
medicine/
│
├── backend/
│   ├── src/
│   │   ├── app.js                          # Express app setup
│   │   ├── server.js                       # Server entry point
│   │   │
│   │   ├── config/
│   │   │   ├── index.js                    # Environment config
│   │   │   └── database.js                 # MongoDB connection + seeding
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js          # Signup, login, getMe
│   │   │   ├── verify.controller.js        # AI verification + batch check
│   │   │   ├── medicine.controller.js      # Medicine search
│   │   │   └── cabinet.controller.js       # Cabinet CRUD + interactions ✨
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js          # JWT verification
│   │   │   ├── upload.middleware.js        # Multer file upload
│   │   │   ├── errorHandler.js             # Global error handler
│   │   │   └── notFound.js                 # 404 handler
│   │   │
│   │   ├── models/
│   │   │   ├── User.js                     # User + medicineCabinet
│   │   │   └── VerifiedMedicine.js         # Official batch database
│   │   │
│   │   ├── routes/
│   │   │   ├── index.js                    # Main router
│   │   │   ├── auth.routes.js              # Auth endpoints
│   │   │   ├── cabinet.routes.js           # Cabinet + interactions ✨
│   │   │   ├── verify.routes.js            # Verification endpoint
│   │   │   └── medicine.routes.js          # Medicine search
│   │   │
│   │   ├── services/
│   │   │   ├── aiVerifier.js               # Google Gemini AI integration
│   │   │   └── drugInteractionService.js   # Drug interaction checker ✨
│   │   │
│   │   ├── data/
│   │   │   └── db.json                     # Mock medicine database
│   │   │
│   │   └── utils/
│   │       └── logger.js                   # Logging utility
│   │
│   ├── package.json                        # Backend dependencies
│   └── .env                                # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                        # React entry point
│   │   ├── App.jsx                         # Main app component
│   │   ├── components/
│   │   │   ├── Scan.jsx                    # Upload component
│   │   │   └── Search.jsx                  # Search component
│   │   ├── services/
│   │   │   └── api.js                      # API client
│   │   └── styles/
│   │       └── app.css                     # Styling
│   ├── vite.config.js                      # Vite configuration
│   └── package.json                        # Frontend dependencies
│
├── index.html                              # Standalone HTML app
│
├── test-interactions.js                    # Interaction checker test
├── test-drug-interactions.sh               # Test script
│
└── Documentation/
    ├── README.md                           # Main project docs
    ├── AUTH_AND_CABINET_FEATURES.md        # Authentication guide
    ├── DRUG_INTERACTION_CHECKER.md         # Interaction checker docs ✨
    ├── GEMINI_INTEGRATION.md               # AI verification docs
    ├── TESTING_GUIDE.md                    # Testing guide
    ├── COMPLETE_FEATURES.md                # Feature summary ✨
    └── API_KEY_SETUP.md                    # API key setup

```

---

## 🔑 Key Files Explained

### Backend Core
- **src/server.js** - Starts Express server, connects to MongoDB
- **src/app.js** - Configures Express (CORS, routes, middleware)
- **src/config/database.js** - MongoDB connection with verified medicine seeding

### Authentication
- **models/User.js** - User schema with password hashing and medicineCabinet
- **middleware/auth.middleware.js** - JWT token verification
- **controllers/auth.controller.js** - Signup, login, profile endpoints

### Medicine Cabinet
- **controllers/cabinet.controller.js** - Cabinet CRUD + **drug interaction checking** ✨
- **routes/cabinet.routes.js** - Cabinet API routes

### Drug Interaction Checker ✨ NEW
- **services/drugInteractionService.js** - Core interaction logic
  - NIH RxNav API integration
  - Known interactions database
  - Generic name extraction
  - RxCUI lookup
  - Batch interaction checking

### AI Verification
- **services/aiVerifier.js** - Google Gemini integration
  - Image analysis
  - Batch number extraction
  - Authenticity scoring
- **controllers/verify.controller.js** - Verification endpoint + batch verification

### Medicine Database
- **data/db.json** - Mock medicine data (5 medicines)
- **models/VerifiedMedicine.js** - Official batch numbers (7 pre-seeded)

---

## 🌐 API Endpoints Map

```
/api
├── /auth
│   ├── POST   /signup                      # Register user
│   ├── POST   /login                       # Login user
│   └── GET    /me                          # Get profile
│
├── /cabinet                                 # 🔒 Protected
│   ├── GET    /                            # Get cabinet
│   ├── POST   /                            # Add medicine
│   ├── DELETE /:id                         # Remove medicine
│   ├── PUT    /:id                         # Update medicine
│   ├── POST   /check-interactions          # Check 2 medicines ✨
│   └── POST   /check-all-interactions      # Scan cabinet ✨
│
├── /verify
│   └── POST   /                            # Upload images + AI verify
│
└── /medicine
    └── GET    /:name                       # Search medicine
```

---

## 🗄️ Database Schema

### Collections

#### users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (bcrypt hashed),
  medicineCabinet: [{
    _id: ObjectId,
    medicineName: String,
    manufacturer: String,
    dosage: String,
    batch: String,
    expiry: Date,
    verificationScore: Number,
    verificationStatus: String,
    savedAt: Date,
    notes: String
  }],
  createdAt: Date
}
```

#### verifiedmedicines
```javascript
{
  _id: ObjectId,
  name: String,
  manufacturer: String,
  batchNumbers: [{
    batchNumber: String (indexed),
    manufactureDate: Date,
    expiryDate: Date,
    verified: Boolean,
    addedAt: Date
  }],
  securityFeatures: [String],
  createdAt: Date
}
```

---

## 🔄 Request Flow

### 1. User Signup/Login
```
Client → POST /api/auth/signup → auth.controller
  → User.create() → bcrypt.hash(password)
  → jwt.sign() → Return token + user
```

### 2. Medicine Verification
```
Client → POST /api/verify (multipart/form-data)
  → upload.middleware → verify.controller
  → aiVerifier.analyze() → Google Gemini API
  → Extract batch number
  → VerifiedMedicine.findOne({ batchNumber })
  → Return score + batch verification
```

### 3. Drug Interaction Check ✨
```
Client → POST /api/cabinet/check-interactions
  → auth.middleware → cabinet.controller
  → drugInteractionService.checkInteractions()
  → Extract generic names
  → Check known interactions database
  → Try NIH RxNav API
  → Return interactions + severity
```

### 4. Full Cabinet Scan ✨
```
Client → POST /api/cabinet/check-all-interactions
  → auth.middleware → cabinet.controller
  → drugInteractionService.checkMultipleInteractions()
  → Check all medicine pairs
  → Return all interactions found
```

---

## 🧩 Feature Dependencies

```
Drug Interaction Checker
  ├── Requires: User Authentication (JWT)
  ├── Requires: Medicine Cabinet (saved medicines)
  ├── Uses: drugInteractionService.js
  ├── Uses: NIH RxNav API (optional)
  └── Uses: Known interactions database (fallback)

Medicine Cabinet
  ├── Requires: User Authentication
  ├── Uses: User model (medicineCabinet array)
  └── Integrates with: Drug Interaction Checker

Medicine Verification
  ├── Uses: Google Gemini AI
  ├── Uses: VerifiedMedicine model
  └── Can save to: Medicine Cabinet (if authenticated)

User Authentication
  ├── Uses: JWT tokens
  ├── Uses: Bcrypt password hashing
  └── Protects: Cabinet routes
```

---

## 📦 Dependencies

### Backend (package.json)
```json
{
  "dependencies": {
    "express": "^4.19.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "@google/generative-ai": "^0.21.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0"
  }
}
```

---

## 🔐 Environment Variables

```env
# Server
PORT=5001
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5176

# File Upload
MAX_FILES=5
MAX_FILE_SIZE_MB=5

# Google Gemini AI
API_KEY=your_google_gemini_api_key

# Authentication
JWT_SECRET=your_secret_key_here

# Database
MONGODB_URI=mongodb://localhost:27017/pharmatrust
```

---

## 🚦 Server Status

✅ Backend running on: `http://localhost:5001`  
✅ Frontend (React) on: `http://localhost:5176`  
✅ Standalone HTML: `index.html`  

### Health Check
```bash
curl http://localhost:5001/api/medicine/paracetamol%20500
```

---

## 🎨 Color Coding

- 🟢 **Green** - Safe, authentic, no interactions
- 🟡 **Yellow** - Suspect, moderate interactions
- 🔴 **Red** - Counterfeit, high-risk interactions
- 🔵 **Blue** - Information, neutral

---

## 📊 Statistics

- **Total Files**: ~30
- **Lines of Code**: ~3,000+
- **API Endpoints**: 11
- **Models**: 2
- **Services**: 2
- **Middleware**: 4
- **Controllers**: 4
- **Known Interactions**: 9
- **Verified Batches**: 7
- **Features**: 6 major

---

## 🎯 Quick Start Commands

```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Test interactions
node test-interactions.js

# Test API
curl http://localhost:5001/api/medicine/paracetamol

# View logs
tail -f backend/logs/app.log
```

---

## 🔍 Find Things Quickly

### Need to modify authentication?
→ `backend/src/controllers/auth.controller.js`  
→ `backend/src/middleware/auth.middleware.js`

### Need to add new interactions?
→ `backend/src/services/drugInteractionService.js`  
→ Edit `KNOWN_INTERACTIONS` object

### Need to change AI prompts?
→ `backend/src/services/aiVerifier.js`  
→ Edit `VERIFICATION_PROMPT`

### Need to add verified batches?
→ `backend/src/config/database.js`  
→ Edit `seedVerifiedMedicines` function

### Need to modify cabinet features?
→ `backend/src/controllers/cabinet.controller.js`  
→ `backend/src/routes/cabinet.routes.js`

---

**PharmaTrust** - All features implemented and documented! 🎉
