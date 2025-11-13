// backend/src/controllers/verify.controller.js
// Controller for AI authenticity verification

const aiVerifier = require('../services/aiVerifier');
const VerifiedMedicine = require('../models/VerifiedMedicine');

exports.verify = async (req, res, next) => {
  try {
    const files = req.files || [];
    if (!files.length) {
      return res.status(400).json({ message: 'No images uploaded. Please attach at least one image.' });
    }

    const analysis = await aiVerifier.analyze(files);

    // Initialize verification result
    let batchVerified = false;
    let verificationStamp = null;
    let batchDetails = null;

    // If batch number was extracted, check against official database
    if (analysis.batchNumber) {
      try {
        const verifiedMedicine = await VerifiedMedicine.findOne({
          'batchNumbers.batchNumber': analysis.batchNumber
        });

        if (verifiedMedicine) {
          // Find the specific batch in the array
          const batch = verifiedMedicine.batchNumbers.find(
            b => b.batchNumber === analysis.batchNumber
          );

          if (batch && batch.verified) {
            batchVerified = true;
            verificationStamp = '100% VERIFIED';
            batchDetails = {
              medicineName: verifiedMedicine.name,
              manufacturer: verifiedMedicine.manufacturer,
              batchNumber: batch.batchNumber,
              manufactureDate: batch.manufactureDate,
              expiryDate: batch.expiryDate,
              verifiedAt: new Date().toISOString(),
            };
          }
        }
      } catch (dbError) {
        console.error('Database verification error:', dbError.message);
        // Continue without database verification if DB is unavailable
      }
    }

    return res.json({
      score: analysis.score,
      status: analysis.status,
      batchNumber: analysis.batchNumber,
      batchVerified,
      verificationStamp,
      batchDetails,
      hints: analysis.hints,
      fullAnalysis: analysis.fullAnalysis, // Include full AI response
      filesAnalyzed: files.length,
      analyzedAt: new Date().toISOString(),
      error: analysis.error, // Include error if any
    });
  } catch (err) {
    return next(err);
  }
};
