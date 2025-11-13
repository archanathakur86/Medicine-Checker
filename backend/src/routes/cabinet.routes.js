// backend/src/routes/cabinet.routes.js
// Medicine cabinet routes

const express = require('express');
const router = express.Router();
const {
  getCabinet,
  addToCabinet,
  removeFromCabinet,
  updateCabinetItem,
  checkDrugInteractions,
  checkAllInteractions,
} = require('../controllers/cabinet.controller');
const { protect } = require('../middleware/auth.middleware');

// All cabinet routes require authentication
router.use(protect);

router.get('/', getCabinet);
router.post('/', addToCabinet);
router.delete('/:id', removeFromCabinet);
router.put('/:id', updateCabinetItem);

// Drug interaction checking routes
router.post('/check-interactions', checkDrugInteractions);
router.post('/check-all-interactions', checkAllInteractions);

module.exports = router;
