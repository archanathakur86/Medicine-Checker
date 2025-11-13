// backend/src/services/priceComparisonService.js
// Service for comparing medicine prices across pharmacies

const https = require('https');

/**
 * Mock price data for demonstration
 * In production, this would call real pharmacy APIs or web scraping
 */
const MOCK_PHARMACY_PRICES = {
  // Paracetamol
  'paracetamol': {
    '1mg': { price: 12.50, url: 'https://www.1mg.com/drugs/paracetamol', inStock: true },
    'PharmEasy': { price: 13.00, url: 'https://pharmeasy.in/search/all?name=paracetamol', inStock: true },
    'Netmeds': { price: 11.80, url: 'https://www.netmeds.com/prescriptions/paracetamol', inStock: true },
    'Apollo': { price: 14.00, url: 'https://www.apollopharmacy.in/search-medicines/paracetamol', inStock: true },
    'Medlife': { price: 12.00, url: 'https://www.medlife.com/search?searchword=paracetamol', inStock: true },
  },
  // Ibuprofen
  'ibuprofen': {
    '1mg': { price: 28.00, url: 'https://www.1mg.com/drugs/ibuprofen', inStock: true },
    'PharmEasy': { price: 27.50, url: 'https://pharmeasy.in/search/all?name=ibuprofen', inStock: true },
    'Netmeds': { price: 26.80, url: 'https://www.netmeds.com/prescriptions/ibuprofen', inStock: true },
    'Apollo': { price: 29.00, url: 'https://www.apollopharmacy.in/search-medicines/ibuprofen', inStock: false },
    'Medlife': { price: 27.00, url: 'https://www.medlife.com/search?searchword=ibuprofen', inStock: true },
  },
  // Aspirin
  'aspirin': {
    '1mg': { price: 15.00, url: 'https://www.1mg.com/drugs/aspirin', inStock: true },
    'PharmEasy': { price: 14.50, url: 'https://pharmeasy.in/search/all?name=aspirin', inStock: true },
    'Netmeds': { price: 14.00, url: 'https://www.netmeds.com/prescriptions/aspirin', inStock: true },
    'Apollo': { price: 16.00, url: 'https://www.apollopharmacy.in/search-medicines/aspirin', inStock: true },
    'Medlife': { price: 15.50, url: 'https://www.medlife.com/search?searchword=aspirin', inStock: true },
  },
  // Amoxicillin
  'amoxicillin': {
    '1mg': { price: 45.00, url: 'https://www.1mg.com/drugs/amoxicillin', inStock: true },
    'PharmEasy': { price: 44.00, url: 'https://pharmeasy.in/search/all?name=amoxicillin', inStock: true },
    'Netmeds': { price: 43.50, url: 'https://www.netmeds.com/prescriptions/amoxicillin', inStock: true },
    'Apollo': { price: 46.00, url: 'https://www.apollopharmacy.in/search-medicines/amoxicillin', inStock: true },
    'Medlife': { price: 44.50, url: 'https://www.medlife.com/search?searchword=amoxicillin', inStock: true },
  },
  // Metformin
  'metformin': {
    '1mg': { price: 35.00, url: 'https://www.1mg.com/drugs/metformin', inStock: true },
    'PharmEasy': { price: 34.50, url: 'https://pharmeasy.in/search/all?name=metformin', inStock: true },
    'Netmeds': { price: 33.80, url: 'https://www.netmeds.com/prescriptions/metformin', inStock: true },
    'Apollo': { price: 36.00, url: 'https://www.apollopharmacy.in/search-medicines/metformin', inStock: true },
    'Medlife': { price: 34.00, url: 'https://www.medlife.com/search?searchword=metformin', inStock: true },
  },
  // Cetirizine
  'cetirizine': {
    '1mg': { price: 18.00, url: 'https://www.1mg.com/drugs/cetirizine', inStock: true },
    'PharmEasy': { price: 17.50, url: 'https://pharmeasy.in/search/all?name=cetirizine', inStock: true },
    'Netmeds': { price: 17.00, url: 'https://www.netmeds.com/prescriptions/cetirizine', inStock: true },
    'Apollo': { price: 19.00, url: 'https://www.apollopharmacy.in/search-medicines/cetirizine', inStock: true },
    'Medlife': { price: 18.50, url: 'https://www.medlife.com/search?searchword=cetirizine', inStock: true },
  },
  // Warfarin
  'warfarin': {
    '1mg': { price: 52.00, url: 'https://www.1mg.com/drugs/warfarin', inStock: true },
    'PharmEasy': { price: 51.00, url: 'https://pharmeasy.in/search/all?name=warfarin', inStock: true },
    'Netmeds': { price: 50.50, url: 'https://www.netmeds.com/prescriptions/warfarin', inStock: true },
    'Apollo': { price: 53.00, url: 'https://www.apollopharmacy.in/search-medicines/warfarin', inStock: false },
    'Medlife': { price: 51.50, url: 'https://www.medlife.com/search?searchword=warfarin', inStock: true },
  },
  // Azithromycin
  'azithromycin': {
    '1mg': { price: 89.00, url: 'https://www.1mg.com/drugs/azithromycin', inStock: true },
    'PharmEasy': { price: 87.50, url: 'https://pharmeasy.in/search/all?name=azithromycin', inStock: true },
    'Netmeds': { price: 86.00, url: 'https://www.netmeds.com/prescriptions/azithromycin', inStock: true },
    'Apollo': { price: 92.00, url: 'https://www.apollopharmacy.in/search-medicines/azithromycin', inStock: true },
    'Medlife': { price: 88.50, url: 'https://www.medlife.com/search?searchword=azithromycin', inStock: true },
  },
  // Omeprazole
  'omeprazole': {
    '1mg': { price: 24.00, url: 'https://www.1mg.com/drugs/omeprazole', inStock: true },
    'PharmEasy': { price: 23.50, url: 'https://pharmeasy.in/search/all?name=omeprazole', inStock: true },
    'Netmeds': { price: 22.80, url: 'https://www.netmeds.com/prescriptions/omeprazole', inStock: true },
    'Apollo': { price: 25.00, url: 'https://www.apollopharmacy.in/search-medicines/omeprazole', inStock: true },
    'Medlife': { price: 23.00, url: 'https://www.medlife.com/search?searchword=omeprazole', inStock: true },
  },
  // Atorvastatin
  'atorvastatin': {
    '1mg': { price: 68.00, url: 'https://www.1mg.com/drugs/atorvastatin', inStock: true },
    'PharmEasy': { price: 67.00, url: 'https://pharmeasy.in/search/all?name=atorvastatin', inStock: true },
    'Netmeds': { price: 65.50, url: 'https://www.netmeds.com/prescriptions/atorvastatin', inStock: true },
    'Apollo': { price: 70.00, url: 'https://www.apollopharmacy.in/search-medicines/atorvastatin', inStock: true },
    'Medlife': { price: 66.00, url: 'https://www.medlife.com/search?searchword=atorvastatin', inStock: true },
  },
  // Losartan
  'losartan': {
    '1mg': { price: 42.00, url: 'https://www.1mg.com/drugs/losartan', inStock: true },
    'PharmEasy': { price: 41.50, url: 'https://pharmeasy.in/search/all?name=losartan', inStock: true },
    'Netmeds': { price: 40.00, url: 'https://www.netmeds.com/prescriptions/losartan', inStock: true },
    'Apollo': { price: 43.50, url: 'https://www.apollopharmacy.in/search-medicines/losartan', inStock: false },
    'Medlife': { price: 41.00, url: 'https://www.medlife.com/search?searchword=losartan', inStock: true },
  },
  // Amlodipine
  'amlodipine': {
    '1mg': { price: 32.00, url: 'https://www.1mg.com/drugs/amlodipine', inStock: true },
    'PharmEasy': { price: 31.50, url: 'https://pharmeasy.in/search/all?name=amlodipine', inStock: true },
    'Netmeds': { price: 30.50, url: 'https://www.netmeds.com/prescriptions/amlodipine', inStock: true },
    'Apollo': { price: 33.00, url: 'https://www.apollopharmacy.in/search-medicines/amlodipine', inStock: true },
    'Medlife': { price: 31.00, url: 'https://www.medlife.com/search?searchword=amlodipine', inStock: true },
  },
  // Clopidogrel
  'clopidogrel': {
    '1mg': { price: 78.00, url: 'https://www.1mg.com/drugs/clopidogrel', inStock: true },
    'PharmEasy': { price: 76.50, url: 'https://pharmeasy.in/search/all?name=clopidogrel', inStock: true },
    'Netmeds': { price: 75.00, url: 'https://www.netmeds.com/prescriptions/clopidogrel', inStock: true },
    'Apollo': { price: 80.00, url: 'https://www.apollopharmacy.in/search-medicines/clopidogrel', inStock: true },
    'Medlife': { price: 77.00, url: 'https://www.medlife.com/search?searchword=clopidogrel', inStock: true },
  },
  // Levothyroxine
  'levothyroxine': {
    '1mg': { price: 38.00, url: 'https://www.1mg.com/drugs/levothyroxine', inStock: true },
    'PharmEasy': { price: 37.00, url: 'https://pharmeasy.in/search/all?name=levothyroxine', inStock: true },
    'Netmeds': { price: 36.50, url: 'https://www.netmeds.com/prescriptions/levothyroxine', inStock: true },
    'Apollo': { price: 39.00, url: 'https://www.apollopharmacy.in/search-medicines/levothyroxine', inStock: true },
    'Medlife': { price: 37.50, url: 'https://www.medlife.com/search?searchword=levothyroxine', inStock: true },
  },
  // Montelukast
  'montelukast': {
    '1mg': { price: 95.00, url: 'https://www.1mg.com/drugs/montelukast', inStock: true },
    'PharmEasy': { price: 93.50, url: 'https://pharmeasy.in/search/all?name=montelukast', inStock: true },
    'Netmeds': { price: 92.00, url: 'https://www.netmeds.com/prescriptions/montelukast', inStock: true },
    'Apollo': { price: 98.00, url: 'https://www.apollopharmacy.in/search-medicines/montelukast', inStock: false },
    'Medlife': { price: 94.00, url: 'https://www.medlife.com/search?searchword=montelukast', inStock: true },
  },
  // Gabapentin
  'gabapentin': {
    '1mg': { price: 125.00, url: 'https://www.1mg.com/drugs/gabapentin', inStock: true },
    'PharmEasy': { price: 123.00, url: 'https://pharmeasy.in/search/all?name=gabapentin', inStock: true },
    'Netmeds': { price: 120.50, url: 'https://www.netmeds.com/prescriptions/gabapentin', inStock: true },
    'Apollo': { price: 128.00, url: 'https://www.apollopharmacy.in/search-medicines/gabapentin', inStock: true },
    'Medlife': { price: 124.00, url: 'https://www.medlife.com/search?searchword=gabapentin', inStock: true },
  },
  // Pantoprazole
  'pantoprazole': {
    '1mg': { price: 28.00, url: 'https://www.1mg.com/drugs/pantoprazole', inStock: true },
    'PharmEasy': { price: 27.50, url: 'https://pharmeasy.in/search/all?name=pantoprazole', inStock: true },
    'Netmeds': { price: 26.80, url: 'https://www.netmeds.com/prescriptions/pantoprazole', inStock: true },
    'Apollo': { price: 29.00, url: 'https://www.apollopharmacy.in/search-medicines/pantoprazole', inStock: true },
    'Medlife': { price: 27.00, url: 'https://www.medlife.com/search?searchword=pantoprazole', inStock: true },
  },
  // Prednisone
  'prednisone': {
    '1mg': { price: 55.00, url: 'https://www.1mg.com/drugs/prednisone', inStock: true },
    'PharmEasy': { price: 54.00, url: 'https://pharmeasy.in/search/all?name=prednisone', inStock: true },
    'Netmeds': { price: 52.50, url: 'https://www.netmeds.com/prescriptions/prednisone', inStock: true },
    'Apollo': { price: 57.00, url: 'https://www.apollopharmacy.in/search-medicines/prednisone', inStock: true },
    'Medlife': { price: 53.50, url: 'https://www.medlife.com/search?searchword=prednisone', inStock: true },
  },
  // Insulin
  'insulin': {
    '1mg': { price: 450.00, url: 'https://www.1mg.com/drugs/insulin', inStock: true },
    'PharmEasy': { price: 445.00, url: 'https://pharmeasy.in/search/all?name=insulin', inStock: true },
    'Netmeds': { price: 440.00, url: 'https://www.netmeds.com/prescriptions/insulin', inStock: true },
    'Apollo': { price: 460.00, url: 'https://www.apollopharmacy.in/search-medicines/insulin', inStock: true },
    'Medlife': { price: 448.00, url: 'https://www.medlife.com/search?searchword=insulin', inStock: true },
  },
};

/**
 * Pharmacy metadata
 */
const PHARMACY_INFO = {
  '1mg': {
    name: '1mg',
    fullName: 'Tata 1mg',
    logo: 'https://www.1mg.com/logo.png',
    rating: 4.5,
    deliveryTime: '24-48 hours',
    minOrder: 0,
  },
  'PharmEasy': {
    name: 'PharmEasy',
    fullName: 'PharmEasy',
    logo: 'https://pharmeasy.in/logo.png',
    rating: 4.3,
    deliveryTime: '24-48 hours',
    minOrder: 0,
  },
  'Netmeds': {
    name: 'Netmeds',
    fullName: 'Netmeds',
    logo: 'https://www.netmeds.com/logo.png',
    rating: 4.4,
    deliveryTime: '48-72 hours',
    minOrder: 0,
  },
  'Apollo': {
    name: 'Apollo',
    fullName: 'Apollo Pharmacy',
    logo: 'https://www.apollopharmacy.in/logo.png',
    rating: 4.6,
    deliveryTime: '24 hours',
    minOrder: 50,
  },
  'Medlife': {
    name: 'Medlife',
    fullName: 'Medlife',
    logo: 'https://www.medlife.com/logo.png',
    rating: 4.2,
    deliveryTime: '48 hours',
    minOrder: 0,
  },
};

/**
 * Extract generic drug name from medicine name
 */
function extractGenericName(medicineName) {
  if (!medicineName) return '';
  
  // Remove dosage, brand info, and special characters
  let cleaned = medicineName
    .toLowerCase()
    .replace(/\d+\s*(mg|g|ml|mcg|%|i\.p\.|tablets?|capsules?|syrup)/gi, '')
    .replace(/[^\w\s]/gi, '')
    .trim();
  
  // Take first word (usually the generic name)
  const firstWord = cleaned.split(/\s+/)[0];
  
  return firstWord;
}

/**
 * Add price variation (simulate real-time prices)
 */
function addPriceVariation(basePrice) {
  // Add ±5% variation to simulate real-time pricing
  const variation = (Math.random() - 0.5) * 0.1; // -5% to +5%
  return Math.round((basePrice * (1 + variation)) * 100) / 100;
}

/**
 * Get prices for a medicine from all pharmacies
 */
async function getPricesForMedicine(medicineName, dosage = null) {
  try {
    const genericName = extractGenericName(medicineName);
    
    if (!genericName) {
      return {
        success: false,
        message: 'Invalid medicine name',
        prices: [],
      };
    }

    // Check if we have mock data for this medicine
    const mockPrices = MOCK_PHARMACY_PRICES[genericName];
    
    if (!mockPrices) {
      // Return generic prices for unknown medicines
      return generateGenericPrices(medicineName, genericName);
    }

    // Build price comparison array
    const prices = [];
    
    for (const [pharmacyKey, priceData] of Object.entries(mockPrices)) {
      const pharmacy = PHARMACY_INFO[pharmacyKey];
      
      prices.push({
        pharmacy: pharmacy.name,
        fullName: pharmacy.fullName,
        price: addPriceVariation(priceData.price),
        originalPrice: priceData.price,
        currency: 'INR',
        inStock: priceData.inStock,
        url: priceData.url,
        rating: pharmacy.rating,
        deliveryTime: pharmacy.deliveryTime,
        minOrder: pharmacy.minOrder,
        discount: Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 5 : 0, // Random discount
      });
    }

    // Sort by price (lowest first)
    prices.sort((a, b) => {
      // Prioritize in-stock items
      if (a.inStock && !b.inStock) return -1;
      if (!a.inStock && b.inStock) return 1;
      return a.price - b.price;
    });

    // Calculate savings
    const lowestPrice = prices[0].price;
    const highestPrice = Math.max(...prices.map(p => p.price));
    const savings = highestPrice - lowestPrice;
    const savingsPercent = Math.round((savings / highestPrice) * 100);

    return {
      success: true,
      medicine: {
        name: medicineName,
        genericName: genericName,
        dosage: dosage,
      },
      totalPharmacies: prices.length,
      lowestPrice: {
        amount: lowestPrice,
        pharmacy: prices[0].pharmacy,
        savings: savings,
        savingsPercent: savingsPercent,
      },
      prices: prices,
      lastUpdated: new Date().toISOString(),
      disclaimer: 'Prices are indicative and may vary. Please check the pharmacy website for final prices.',
    };

  } catch (error) {
    console.error('Error getting prices:', error.message);
    return {
      success: false,
      error: error.message,
      message: 'Failed to fetch prices. Please try again later.',
      prices: [],
    };
  }
}

/**
 * Generate generic prices for medicines not in database
 */
function generateGenericPrices(medicineName, genericName) {
  const basePrice = Math.floor(Math.random() * 50) + 20; // ₹20-70
  const prices = [];

  for (const [pharmacyKey, pharmacy] of Object.entries(PHARMACY_INFO)) {
    const priceVariation = (Math.random() - 0.5) * 0.2; // -10% to +10%
    const price = Math.round((basePrice * (1 + priceVariation)) * 100) / 100;

    prices.push({
      pharmacy: pharmacy.name,
      fullName: pharmacy.fullName,
      price: price,
      currency: 'INR',
      inStock: Math.random() > 0.2, // 80% chance in stock
      url: `https://www.${pharmacyKey.toLowerCase()}.com/search?q=${encodeURIComponent(genericName)}`,
      rating: pharmacy.rating,
      deliveryTime: pharmacy.deliveryTime,
      minOrder: pharmacy.minOrder,
      discount: Math.random() > 0.7 ? Math.floor(Math.random() * 15) + 5 : 0,
    });
  }

  prices.sort((a, b) => {
    if (a.inStock && !b.inStock) return -1;
    if (!a.inStock && b.inStock) return 1;
    return a.price - b.price;
  });

  const lowestPrice = prices[0].price;
  const highestPrice = Math.max(...prices.map(p => p.price));
  const savings = highestPrice - lowestPrice;

  return {
    success: true,
    medicine: {
      name: medicineName,
      genericName: genericName,
    },
    totalPharmacies: prices.length,
    lowestPrice: {
      amount: lowestPrice,
      pharmacy: prices[0].pharmacy,
      savings: savings,
      savingsPercent: Math.round((savings / highestPrice) * 100),
    },
    prices: prices,
    lastUpdated: new Date().toISOString(),
    disclaimer: 'Prices are estimated. Please check the pharmacy website for actual prices.',
  };
}

/**
 * Compare prices across multiple medicines
 */
async function comparePricesForMultipleMedicines(medicineNames) {
  try {
    const results = [];

    for (const medicineName of medicineNames) {
      const priceData = await getPricesForMedicine(medicineName);
      results.push(priceData);
    }

    // Calculate total savings
    const totalLowestPrice = results.reduce((sum, r) => sum + (r.lowestPrice?.amount || 0), 0);
    const totalHighestPrice = results.reduce((sum, r) => {
      const highest = Math.max(...(r.prices?.map(p => p.price) || [0]));
      return sum + highest;
    }, 0);
    const totalSavings = totalHighestPrice - totalLowestPrice;

    return {
      success: true,
      medicinesCount: medicineNames.length,
      results: results,
      summary: {
        totalLowestPrice: Math.round(totalLowestPrice * 100) / 100,
        totalHighestPrice: Math.round(totalHighestPrice * 100) / 100,
        totalSavings: Math.round(totalSavings * 100) / 100,
        savingsPercent: totalHighestPrice > 0 ? Math.round((totalSavings / totalHighestPrice) * 100) : 0,
      },
      checkedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Error comparing prices:', error.message);
    return {
      success: false,
      error: error.message,
      results: [],
    };
  }
}

module.exports = {
  getPricesForMedicine,
  comparePricesForMultipleMedicines,
  extractGenericName,
};
