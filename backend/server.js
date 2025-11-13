// backend/server.js
// Standalone Express server for PharmaTrust (basic version)

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// --------------------------------------
// Middleware
// --------------------------------------
// Enable CORS so the React frontend can call this API
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

// --------------------------------------
// Data loading (mock DB)
// --------------------------------------
// Load the mock database from src/data/db.json once at startup
const DB_PATH = path.resolve(__dirname, 'src', 'data', 'db.json');
let medicines = [];
try {
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  medicines = JSON.parse(raw);
  if (!Array.isArray(medicines)) {
    throw new Error('db.json must export a JSON array');
  }
} catch (err) {
  console.error('Failed to load mock database:', err.message);
  medicines = [];
}

// Utility: simulate latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// --------------------------------------
// Routes
// --------------------------------------
// POST /api/verify - simulate AI verification
// Simulates a delay and returns a hardcoded authenticity response
app.post('/api/verify', async (req, res) => {
  await delay(1000); // simulate 1s processing
  return res.json({ authenticityScore: 95, status: 'Verified Genuine' });
});

// GET /api/medicine/:name - return medicine details by name
// Looks up the requested medicine (case-insensitive) from the mock db
app.get('/api/medicine/:name', (req, res) => {
  const name = String(req.params.name || '').trim().toLowerCase();
  if (!name) {
    return res.status(400).json({ message: 'Medicine name is required' });
  }

  const match = medicines.find((m) => String(m.name || '').toLowerCase() === name);
  if (!match) {
    return res.status(404).json({ message: 'Medicine not found' });
  }

  return res.json(match);
});

// --------------------------------------
// Server bootstrap
// --------------------------------------
const PORT = parseInt(process.env.PORT, 10) || 5001;
app.listen(PORT, () => {
  console.log(`PharmaTrust basic server listening on http://localhost:${PORT}`);
});
