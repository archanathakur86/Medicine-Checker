// backend/src/config/database.js
// MongoDB connection setup

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmatrust';
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
    
    // Seed some verified batch numbers for testing
    await seedVerifiedMedicines();
    
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Continuing without database - some features will be limited');
  }
};

// Seed initial verified medicines data
async function seedVerifiedMedicines() {
  const VerifiedMedicine = require('../models/VerifiedMedicine');
  
  const count = await VerifiedMedicine.countDocuments();
  if (count > 0) return; // Already seeded

  const medicines = [
    {
      name: 'Paracetamol 500',
      manufacturer: 'HealWell Laboratories',
      batchNumbers: [
        { batchNumber: 'PW23A07', manufactureDate: new Date('2023-01-15'), expiryDate: new Date('2027-12-31') },
        { batchNumber: 'PW24B12', manufactureDate: new Date('2024-02-20'), expiryDate: new Date('2028-12-31') },
        { batchNumber: 'PW24C03', manufactureDate: new Date('2024-03-10'), expiryDate: new Date('2028-12-31') },
      ],
      securityFeatures: ['Hologram', 'QR Code', 'Watermark'],
    },
    {
      name: 'Ibuprofen',
      manufacturer: 'Apex Therapeutics',
      batchNumbers: [
        { batchNumber: 'AT24C19', manufactureDate: new Date('2024-03-15'), expiryDate: new Date('2028-08-31') },
        { batchNumber: 'AT24D21', manufactureDate: new Date('2024-04-10'), expiryDate: new Date('2028-08-31') },
      ],
      securityFeatures: ['Security Seal', 'Holographic Strip'],
    },
    {
      name: 'Amoxicillin',
      manufacturer: 'MedCore Pharma Pvt Ltd',
      batchNumbers: [
        { batchNumber: 'MC22B51', manufactureDate: new Date('2022-11-20'), expiryDate: new Date('2026-05-31') },
        { batchNumber: 'MC23A15', manufactureDate: new Date('2023-01-05'), expiryDate: new Date('2027-05-31') },
      ],
      securityFeatures: ['Tamper-evident Seal', 'Batch QR Code'],
    },
  ];

  await VerifiedMedicine.insertMany(medicines);
  console.log('Verified medicines database seeded');
}

module.exports = connectDB;
