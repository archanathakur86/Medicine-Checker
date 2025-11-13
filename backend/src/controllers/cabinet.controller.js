// backend/src/controllers/cabinet.controller.js
// Medicine cabinet controller

const User = require('../models/User');
const { checkInteractions, checkMultipleInteractions } = require('../services/drugInteractionService');

// @route   GET /api/cabinet
// @desc    Get user's medicine cabinet
exports.getCabinet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('medicineCabinet');
    res.json({
      success: true,
      cabinet: user.medicineCabinet,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/cabinet
// @desc    Add medicine to cabinet
exports.addToCabinet = async (req, res, next) => {
  try {
    const {
      medicineId,
      medicineName,
      manufacturer,
      dosage,
      batch,
      expiry,
      verificationScore,
      verificationStatus,
      notes,
    } = req.body;

    if (!medicineName) {
      return res.status(400).json({ message: 'Medicine name is required' });
    }

    const user = await User.findById(req.user.id);

    // Check if already in cabinet
    const exists = user.medicineCabinet.find(
      m => m.medicineName === medicineName && m.batch === batch
    );

    if (exists) {
      return res.status(400).json({ message: 'Medicine already in your cabinet' });
    }

    // Add to cabinet
    user.medicineCabinet.push({
      medicineId,
      medicineName,
      manufacturer,
      dosage,
      batch,
      expiry,
      verificationScore,
      verificationStatus,
      notes,
      savedAt: new Date(),
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Medicine added to cabinet',
      cabinet: user.medicineCabinet,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/cabinet/:id
// @desc    Remove medicine from cabinet
exports.removeFromCabinet = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.medicineCabinet = user.medicineCabinet.filter(
      m => m._id.toString() !== req.params.id
    );

    await user.save();

    res.json({
      success: true,
      message: 'Medicine removed from cabinet',
      cabinet: user.medicineCabinet,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/cabinet/:id
// @desc    Update medicine notes
exports.updateCabinetItem = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const user = await User.findById(req.user.id);
    
    const medicine = user.medicineCabinet.id(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found in cabinet' });
    }

    medicine.notes = notes;
    await user.save();

    res.json({
      success: true,
      message: 'Medicine updated',
      cabinet: user.medicineCabinet,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/cabinet/check-interactions
// @desc    Check drug interactions between two medicines
exports.checkDrugInteractions = async (req, res, next) => {
  try {
    const { medicine1Id, medicine2Id } = req.body;

    if (!medicine1Id || !medicine2Id) {
      return res.status(400).json({ 
        message: 'Please provide both medicine1Id and medicine2Id' 
      });
    }

    if (medicine1Id === medicine2Id) {
      return res.status(400).json({ 
        message: 'Please select two different medicines' 
      });
    }

    const user = await User.findById(req.user.id);

    // Find both medicines in user's cabinet
    const medicine1 = user.medicineCabinet.id(medicine1Id);
    const medicine2 = user.medicineCabinet.id(medicine2Id);

    if (!medicine1 || !medicine2) {
      return res.status(404).json({ 
        message: 'One or both medicines not found in your cabinet' 
      });
    }

    // Check interactions using NIH RxNav API
    const result = await checkInteractions(
      medicine1.medicineName,
      medicine2.medicineName
    );

    res.json({
      success: result.success,
      medicine1: {
        id: medicine1._id,
        name: medicine1.medicineName,
        ...result.medicine1,
      },
      medicine2: {
        id: medicine2._id,
        name: medicine2.medicineName,
        ...result.medicine2,
      },
      hasInteractions: result.hasInteractions,
      interactionCount: result.interactionCount,
      interactions: result.interactions,
      checkedAt: result.checkedAt,
      warning: result.hasInteractions 
        ? '⚠️ Drug interactions detected! Consult your doctor before taking these medicines together.'
        : '✓ No known interactions found between these medicines.',
    });

  } catch (error) {
    next(error);
  }
};

// @route   POST /api/cabinet/check-all-interactions
// @desc    Check interactions across all medicines in cabinet
exports.checkAllInteractions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.medicineCabinet.length < 2) {
      return res.status(400).json({ 
        message: 'You need at least 2 medicines in your cabinet to check interactions' 
      });
    }

    // Extract all medicine names from cabinet
    const medicineNames = user.medicineCabinet.map(m => m.medicineName);

    // Check all possible interactions
    const result = await checkMultipleInteractions(medicineNames);

    res.json({
      success: result.success,
      medicinesInCabinet: user.medicineCabinet.length,
      totalPairsChecked: result.totalPairsChecked,
      interactionsFound: result.interactionsFound,
      allInteractions: result.allInteractions,
      checkedAt: result.checkedAt,
      warning: result.interactionsFound
        ? '⚠️ Drug interactions detected in your cabinet! Review the details below and consult your doctor.'
        : '✓ No known interactions found between medicines in your cabinet.',
    });

  } catch (error) {
    next(error);
  }
};
