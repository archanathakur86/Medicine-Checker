# PharmaTrust

A MERN stack web application to help users verify medicine authenticity and get clear drug information.

##  Features

1. **AI Authenticity Check** - Upload medicine images for real-time AI verification using **Google Gemini AI**
2. **Drug Information Hub** - Search for medicine details by name

##  Tech Stack

### Frontend
- React 18 (functional components, hooks)
- Vite (build tool & dev server)
- Vanilla CSS

### Backend
- Node.js
- Express
- Mock JSON database (simulates MongoDB)

##  Project Structure

```
medicine/
├── backend/
│   ├── src/
│   │   ├── app.js                    # Express app configuration
│   │   ├── server.js                 # Server entry point
│   │   ├── config/
│   │   │   └── index.js              # Environment config
│   │   ├── controllers/
│   │   │   ├── verify.controller.js  # AI verification logic
│   │   │   └── medicine.controller.js # Medicine search logic
│   │   ├── data/
│   │   │   └── db.json               # Mock database
│   │   ├── middleware/
│   │   │   ├── errorHandler.js       # Error handling
│   │   │   ├── notFound.js           # 404 handler
│   │   │   └── upload.middleware.js  # Multer file upload
│   │   ├── routes/
│   │   │   ├── index.js              # Route aggregator
│   │   │   ├── verify.routes.js      # /api/verify routes
│   │   │   └── medicine.routes.js    # /api/medicine routes
│   │   ├── services/
│   │   │   └── aiVerifier.js         # Simulated AI service
│   │   └── utils/
│   │       └── logger.js             # Logging utility
│   ├── package.json
│   ├── nodemon.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── main.jsx                  # Entry point
    │   ├── App.jsx                   # Root component
    │   ├── components/
    │   │   ├── Scan.jsx              # Image upload & verification
    │   │   ├── Search.jsx            # Medicine search
    │   │   ├── UploadDropzone.jsx    # Drag-drop upload
    │   │   └── ResultCard.jsx        # Result display
    │   ├── services/
    │   │   └── api.js                # API client
    │   ├── styles/
    │   │   └── app.css               # Global styles
    │   └── utils/
    │       └── constants.js          # App constants
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

##  Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone or navigate to the project:**
   ```bash
   cd /home/navgurukul/medicine
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

#### Option 1: Run both servers separately

**Terminal 1 - Backend:**
```bash
cd backend
PORT=5001 npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Option 2: Use development mode with nodemon

**Backend (with auto-reload):**
```bash
cd backend
PORT=5001 npm run dev
```

### Access the Application

- **Frontend:** http://localhost:5176 (or check terminal for actual port)
- **Backend API:** http://localhost:5001

The Vite dev server includes a proxy that forwards `/api/*` requests to the backend.

##  API Endpoints

### POST /api/verify
Upload images for authenticity verification.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: FormData with key `images` (up to 5 files)

**Response:**
```json
{
  "score": 85,
  "status": "authentic",
  "hints": ["Packaging matches reference", "QR code verified"],
  "filesAnalyzed": 2,
  "analyzedAt": "2025-10-31T00:00:00.000Z"
}
```

### GET /api/medicine/:name
Get medicine information by name (case-insensitive).

**Request:**
- Method: `GET`
- Example: `/api/medicine/Paracetamol%20500`

**Response:**
```json
{
  "id": 1,
  "name": "Paracetamol 500",
  "manufacturer": "HealWell Laboratories",
  "dosage": "500 mg tablet",
  "batch": "PW23A07",
  "expiry": "12/2027",
  "warnings": [
    "Do not exceed 4,000 mg in 24 hours",
    "Consult a doctor if you have liver disease",
    "Keep out of reach of children"
  ],
  "description": "Paracetamol (acetaminophen) is an analgesic and antipyretic used to relieve mild to moderate pain and reduce fever."
}
```

**Error Response (404):**
```json
{
  "message": "Not found"
}
```

##  Testing the API

**Test medicine search:**
```bash
curl http://localhost:5001/api/medicine/paracetamol%20500
```

**Test image verification (requires a test image):**
```bash
curl -X POST http://localhost:5001/api/verify \
  -F "images=@test-image.jpg"
```

##  Configuration

### Backend Environment Variables

Create `backend/.env` from `.env.example`:

```env
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176
MAX_FILES=5
MAX_FILE_SIZE_MB=5
```

### Frontend Environment Variables

Create `frontend/.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

*Note: The frontend uses Vite's proxy by default, so this is optional.*

##  Available Medicines in Mock Database

1. Paracetamol 500
2. Amoxicillin
3. Ibuprofen
4. Cetirizine
5. Metformin

Search is case-insensitive.

##  Frontend Components

### Scan.jsx
- Image upload (multiple files)
- Calls `/api/verify` endpoint
- Displays authenticity score and status

### Search.jsx
- Search input with debounce
- Calls `/api/medicine/:name` endpoint
- Displays complete medicine details

### UploadDropzone.jsx
- Drag-and-drop file upload
- File type validation
- Max files limit

### ResultCard.jsx
- Color-coded status display
- Score visualization
- Analysis hints/notes

##  Troubleshooting

### Connection Refused Error

If you see `ERR_CONNECTION_REFUSED`:

1. **Check backend is running:**
   ```bash
   curl http://localhost:5001/api/medicine/paracetamol%20500
   ```

2. **Check frontend is running:**
   - Look for "VITE ready" message in terminal
   - Note the actual port (might be 5173, 5174, 5175, or 5176)

3. **Restart servers:**
   ```bash
   # Kill any running node/npm processes
   pkill -f node
   
   # Restart backend
   cd backend && PORT=5001 npm start
   
   # Restart frontend (in new terminal)
   cd frontend && npm run dev
   ```

### Port Already in Use

If port 5001 is busy:
```bash
# Find and kill process on port 5001
fuser -k 5001/tcp

# Or use a different port
PORT=5002 npm start
```

### Frontend Can't Connect to Backend

1. Check `vite.config.js` proxy settings
2. Verify backend is on port 5001
3. Check browser console for CORS errors

## Dependencies

### Backend
- express - Web framework
- cors - CORS middleware
- dotenv - Environment variables
- morgan - HTTP logger
- multer - File upload handling
- @google/generative-ai - Google Gemini AI integration

### Frontend
- react - UI library
- react-dom - React DOM rendering
- vite - Build tool
- @vitejs/plugin-react - Vite React plugin

##  Security Notes

This is a **demonstration project** with a mock database and simulated AI. For production:

1. Replace `db.json` with real MongoDB
2. Implement real AI service integration
3. Add authentication & authorization
4. Add input validation & sanitization
5. Implement rate limiting
6. Add HTTPS
7. Secure file upload validation
8. Add logging & monitoring

##  License

Educational project for NavGurukul.

##  Contributing

This is a learning project. Feel free to extend it with:
- Real database integration
- User authentication
- Medicine image gallery
- QR code scanning
- Batch verification reports
- Admin dashboard

---


