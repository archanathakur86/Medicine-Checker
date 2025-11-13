# PharmaTrust Authentication & Cabinet Features

## Overview
PharmaTrust now includes user authentication, medicine cabinet management, and official batch number verification against a trusted database.

## New Features

### 1. User Authentication
- User signup with email and password
- Secure login with JWT tokens
- Password hashing with bcryptjs
- Protected routes for cabinet access

### 2. Medicine Cabinet
- Save verified medicines to personal cabinet
- Track medicine details (name, batch, expiry, verification score)
- Add personal notes to saved medicines
- Remove medicines from cabinet
- View full cabinet history

### 3. Batch Number Verification
- AI extracts batch number from medicine images
- Backend checks against official VerifiedMedicine database
- Returns "100% VERIFIED" stamp if batch found in database
- Provides manufacture and expiry dates for verified batches

## API Endpoints

### Authentication

#### POST /api/auth/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "medicineCabinet": []
  }
}
```

#### POST /api/auth/login
Login existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "medicineCabinet": [...]
  }
}
```

#### GET /api/auth/me
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "medicineCabinet": [...]
  }
}
```

### Medicine Cabinet

#### GET /api/cabinet
Get user's medicine cabinet (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "cabinet": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "medicineName": "Paracetamol 500mg",
      "manufacturer": "PharmaCo",
      "dosage": "500mg",
      "batch": "PW23A07",
      "expiry": "2025-12-31",
      "verificationScore": 95,
      "verificationStatus": "authentic",
      "savedAt": "2024-01-15T10:30:00Z",
      "notes": "For headaches"
    }
  ]
}
```

#### POST /api/cabinet
Add medicine to cabinet (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "medicineName": "Paracetamol 500mg",
  "manufacturer": "PharmaCo",
  "dosage": "500mg",
  "batch": "PW23A07",
  "expiry": "2025-12-31",
  "verificationScore": 95,
  "verificationStatus": "authentic",
  "notes": "For headaches"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medicine added to cabinet",
  "cabinet": [...]
}
```

#### DELETE /api/cabinet/:id
Remove medicine from cabinet (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Medicine removed from cabinet",
  "cabinet": [...]
}
```

#### PUT /api/cabinet/:id
Update medicine notes (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "notes": "Updated notes for this medicine"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Medicine updated",
  "cabinet": [...]
}
```

### Enhanced Verification

#### POST /api/verify
Upload and verify medicine images (now includes batch verification).

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Field name: "images" (supports multiple files)

**Response:**
```json
{
  "score": 95,
  "status": "authentic",
  "batchNumber": "PW23A07",
  "batchVerified": true,
  "verificationStamp": "100% VERIFIED",
  "batchDetails": {
    "medicineName": "Paracetamol 500mg",
    "manufacturer": "PharmaCo",
    "batchNumber": "PW23A07",
    "manufactureDate": "2023-01-15",
    "expiryDate": "2025-12-31",
    "verifiedAt": "2024-10-31T00:57:00Z"
  },
  "hints": [
    "Logo and branding match official standards",
    "Batch number format is correct",
    "Packaging quality appears genuine",
    "All security features present"
  ],
  "fullAnalysis": "...",
  "filesAnalyzed": 2,
  "analyzedAt": "2024-10-31T00:57:00Z"
}
```

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  medicineCabinet: [{
    medicineId: String,
    medicineName: String (required),
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

### VerifiedMedicine Model
```javascript
{
  name: String (required),
  manufacturer: String (required),
  batchNumbers: [{
    batchNumber: String (required, indexed),
    manufactureDate: Date,
    expiryDate: Date,
    verified: Boolean,
    addedAt: Date
  }],
  securityFeatures: [String],
  createdAt: Date
}
```

## Seeded Verified Batches

The database comes pre-seeded with verified batch numbers:

**Paracetamol 500mg (PharmaCo):**
- PW23A07 (Mfg: 2023-01-15, Exp: 2025-12-31)
- PW24B12 (Mfg: 2024-02-20, Exp: 2026-12-31)
- PW24C03 (Mfg: 2024-03-10, Exp: 2026-12-31)

**Ibuprofen 400mg (MediCure):**
- AT24C19 (Mfg: 2024-03-05, Exp: 2027-03-05)
- AT24D21 (Mfg: 2024-04-15, Exp: 2027-04-15)

**Amoxicillin 500mg (BioPharm):**
- MC22B51 (Mfg: 2022-02-10, Exp: 2024-02-10)
- MC23A15 (Mfg: 2023-01-20, Exp: 2025-01-20)

## How It Works

### 1. User Workflow
1. User signs up or logs in
2. Receives JWT token stored in browser
3. Token sent with all authenticated requests

### 2. Verification Workflow
1. User uploads medicine image
2. Gemini AI analyzes image and extracts batch number
3. Backend checks batch number against VerifiedMedicine database
4. If found, returns "100% VERIFIED" stamp with official details
5. If not found, returns AI analysis only
6. User can save verified medicine to personal cabinet

### 3. Cabinet Workflow
1. After verification, user clicks "Save to Cabinet"
2. Medicine details stored in user's medicineCabinet array
3. User can add personal notes
4. View all saved medicines anytime
5. Remove medicines when no longer needed

## Environment Variables

Add to `backend/.env`:
```env
# JWT Authentication
JWT_SECRET=pharmatrust-super-secret-key-change-in-production-2024

# MongoDB
MONGODB_URI=mongodb://localhost:27017/pharmatrust
```

## Security Features

1. **Password Security**: Passwords hashed with bcrypt (10 salt rounds)
2. **JWT Tokens**: 30-day expiration, signed with secret key
3. **Protected Routes**: Cabinet routes require valid JWT token
4. **Input Validation**: Email format, password length (min 6 chars)
5. **Error Handling**: Secure error messages (no sensitive data exposed)

## Testing Authentication

### Using cURL:

**1. Signup:**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**3. Access Cabinet:**
```bash
curl http://localhost:5001/api/cabinet \
  -H "Authorization: Bearer <your-token-here>"
```

**4. Add to Cabinet:**
```bash
curl -X POST http://localhost:5001/api/cabinet \
  -H "Authorization: Bearer <your-token-here>" \
  -H "Content-Type: application/json" \
  -d '{
    "medicineName": "Paracetamol 500mg",
    "batch": "PW23A07",
    "verificationScore": 95,
    "verificationStatus": "authentic"
  }'
```

## MongoDB Setup (Optional)

If MongoDB is not running, the app will continue to work but cabinet and batch verification features will be limited.

**Install MongoDB:**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

The app will automatically seed the database with verified medicine batches on first connection.

## Frontend Integration

Store JWT token in localStorage:
```javascript
// After login
localStorage.setItem('pharmatrust_token', response.token);

// Include in requests
fetch('/api/cabinet', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('pharmatrust_token')}`
  }
});

// Check if logged in
const isLoggedIn = !!localStorage.getItem('pharmatrust_token');
```

## What's New

✅ User authentication (signup/login)  
✅ JWT token-based authorization  
✅ Protected cabinet routes  
✅ Save medicines to personal cabinet  
✅ Batch number extraction from images  
✅ Official batch verification database  
✅ "100% VERIFIED" stamp for verified batches  
✅ Manufacture and expiry date tracking  
✅ Personal notes for saved medicines  

## Next Steps

The backend is fully functional with authentication and batch verification. To complete the user experience:

1. Add login/signup forms to index.html
2. Create cabinet UI to display saved medicines
3. Add "Save to Cabinet" button after verification
4. Store JWT token in localStorage
5. Show/hide features based on auth state
