// backend/src/controllers/price.controller.js
// Controller for medicine price comparison

const { getPricesForMedicine, comparePricesForMultipleMedicines } = require('../services/priceComparisonService');
const User = require('../models/User');

// @route   GET /api/price/:medicineName
// @desc    Get price comparison for a medicine
exports.getPrices = async (req, res, next) => {
  try {
    const { medicineName } = req.params;
    const { dosage } = req.query;

    if (!medicineName) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }

    const result = await getPricesForMedicine(medicineName, dosage);

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'Could not find prices for this medicine',
      });
    }

    res.json(result);

  } catch (error) {
    next(error);
  }
};

// @route   POST /api/price/compare-multiple
// @desc    Compare prices for multiple medicines
exports.compareMultiple = async (req, res, next) => {
  try {
    const { medicines } = req.body;

    if (!Array.isArray(medicines) || medicines.length === 0) {
      return res.status(400).json({
        message: 'Please provide an array of medicine names',
      });
    }

    if (medicines.length > 10) {
      return res.status(400).json({
        message: 'Maximum 10 medicines can be compared at once',
      });
    }

    const result = await comparePricesForMultipleMedicines(medicines);

    res.json(result);

  } catch (error) {
    next(error);
  }
};

// @route   POST /api/price/compare-cabinet
// @desc    Compare prices for all medicines in user's cabinet (requires auth)
exports.compareCabinetPrices = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.medicineCabinet || user.medicineCabinet.length === 0) {
      return res.status(400).json({
        message: 'Your cabinet is empty. Add medicines to compare prices.',
      });
    }

    // Extract medicine names from cabinet
    const medicineNames = user.medicineCabinet.map(m => m.medicineName);

    const result = await comparePricesForMultipleMedicines(medicineNames);

    res.json({
      ...result,
      cabinetSize: user.medicineCabinet.length,
      tip: result.summary?.totalSavings > 0 
        ? `You can save ₹${result.summary.totalSavings} by buying from the cheapest pharmacies!`
        : 'All prices are competitive!',
    });

  } catch (error) {
    next(error);
  }
};

// @route   GET /api/price/best-deal/:medicineName
// @desc    Get only the best deal for a medicine
exports.getBestDeal = async (req, res, next) => {
  try {
    const { medicineName } = req.params;

    if (!medicineName) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }

    const result = await getPricesForMedicine(medicineName);

    if (!result.success || !result.prices || result.prices.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Could not find prices for this medicine',
      });
    }

    // Get the best deal (first item after sorting)
    const bestDeal = result.prices[0];

    res.json({
      success: true,
      medicine: result.medicine,
      bestDeal: {
        pharmacy: bestDeal.pharmacy,
        fullName: bestDeal.fullName,
        price: bestDeal.price,
        currency: bestDeal.currency,
        inStock: bestDeal.inStock,
        url: bestDeal.url,
        rating: bestDeal.rating,
        deliveryTime: bestDeal.deliveryTime,
        discount: bestDeal.discount,
        savings: result.lowestPrice.savings,
        savingsPercent: result.lowestPrice.savingsPercent,
      },
      alternativeCount: result.prices.length - 1,
      lastUpdated: result.lastUpdated,
    });

  } catch (error) {
    next(error);
  }
};
