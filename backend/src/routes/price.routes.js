// backend/src/routes/price.routes.js
// Routes for medicine price comparison

const express = require('express');
const router = express.Router();
const priceController = require('../controllers/price.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
// More specific routes first to avoid conflicts
router.get('/best-deal/:medicineName', priceController.getBestDeal);
router.post('/compare-multiple', priceController.compareMultiple);
router.get('/:medicineName', priceController.getPrices);

// Protected routes (require authentication)
router.post('/compare-cabinet', protect, priceController.compareCabinetPrices);

module.exports = router;
