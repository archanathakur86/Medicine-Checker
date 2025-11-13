// backend/src/models/VerifiedMedicine.js
// Official database of verified medicines with batch numbers

const mongoose = require('mongoose');

const verifiedMedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  batchNumbers: [{
    batchNumber: {
      type: String,
      required: true,
      index: true,
    },
    manufactureDate: Date,
    expiryDate: Date,
    verified: {
      type: Boolean,
      default: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  officialLogo: String,
  securityFeatures: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for fast batch number lookup
verifiedMedicineSchema.index({ 'batchNumbers.batchNumber': 1 });

module.exports = mongoose.model('VerifiedMedicine', verifiedMedicineSchema);
