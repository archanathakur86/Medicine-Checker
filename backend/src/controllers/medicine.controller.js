// backend/src/controllers/medicine.controller.js
// Controller to read medicine details from mock db.json with AI fallback

const fs = require('fs');
const path = require('path');
const { getMedicineInfoFromAI } = require('../services/aiMedicineInfo');

let cache = null;
function loadDB() {
  if (cache) return cache;
  const dbPath = path.resolve(__dirname, '..', 'data', 'db.json');
  const raw = fs.readFileSync(dbPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('db.json must be a JSON array');
  }
  cache = parsed;
  return cache;
}

exports.getByName = async (req, res, next) => {
  try {
    const name = String(req.params.name || '').trim().toLowerCase();
    if (!name) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }

    const db = loadDB();
    
    // Try exact match first
    let match = db.find((m) => String(m.name || '').toLowerCase() === name);
    
    // If no exact match, try partial match (search term is contained in medicine name)
    if (!match) {
      match = db.find((m) => String(m.name || '').toLowerCase().includes(name));
    }
    
    // If still no match, try if medicine name starts with search term
    if (!match) {
      match = db.find((m) => String(m.name || '').toLowerCase().startsWith(name));
    }
    
    // If found in database, return it
    if (match) {
      return res.json({ ...match, source: 'database' });
    }

    // Not found in database - use AI to get information
    console.log(`Medicine "${name}" not in database. Fetching from AI...`);
    
    try {
      const aiResult = await getMedicineInfoFromAI(name);
      
      if (!aiResult.found) {
        return res.status(404).json({ 
          message: 'Medicine not found',
          error: aiResult.error,
          suggestion: aiResult.suggestion,
          aiGenerated: true
        });
      }

      // Return AI-generated medicine information
      return res.json({
        ...aiResult.data,
        id: 'fda-generated',
        note: '💊 Medicine info from US FDA Official Database'
      });
    } catch (aiError) {
      console.error('AI fallback failed:', aiError);
      
      // If AI fails, return 404 with helpful message
      return res.status(404).json({ 
        message: 'Medicine not found in database and AI lookup failed',
        searchedFor: name,
        suggestion: 'Please check the spelling or try a different medicine name',
        availableMedicines: db.slice(0, 5).map(m => m.name) // Show first 5 as examples
      });
    }
  } catch (err) {
    return next(err);
  }
};
