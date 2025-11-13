// Simple test for price comparison feature
const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:5001${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON: ' + data));
        }
      });
    }).on('error', reject);
  });
}

async function testPriceComparison() {
  console.log('=== Price Comparison Feature Test ===\n');

  try {
    // Test 1: Single medicine price
    console.log('Test 1: Get prices for Paracetamol');
    const prices = await makeRequest('/api/price/paracetamol');
    console.log('Medicine:', prices.medicine.name);
    console.log('Lowest Price:', `₹${prices.lowestPrice.amount}`, `(${prices.lowestPrice.pharmacy})`);
    console.log('Savings:', `₹${prices.lowestPrice.savings}`, `(${prices.lowestPrice.savingsPercent}%)`);
    console.log('Total Pharmacies:', prices.totalPharmacies);
    console.log('\nPrice Breakdown:');
    prices.prices.forEach((p, idx) => {
      console.log(`  ${idx + 1}. ${p.pharmacy}: ₹${p.price}`, p.inStock ? '✓' : '✗');
    });
    console.log('\n' + '='.repeat(60) + '\n');

    // Test 2: Best deal
    console.log('Test 2: Get best deal for Ibuprofen');
    const bestDeal = await makeRequest('/api/price/best-deal/ibuprofen');
    console.log('Best Deal:', bestDeal.bestDeal.pharmacy);
    console.log('Price:', `₹${bestDeal.bestDeal.price}`);
    console.log('Rating:', `⭐ ${bestDeal.bestDeal.rating}`);
    console.log('Delivery:', bestDeal.bestDeal.deliveryTime);
    console.log('Savings:', `₹${bestDeal.bestDeal.savings}`);
    console.log('Alternatives:', bestDeal.alternativeCount);
    console.log('\n' + '='.repeat(60) + '\n');

    console.log('✅ All tests passed!');
    console.log('\nPrice Comparison Feature is working perfectly! 💰');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests after a delay to ensure server is ready
setTimeout(testPriceComparison, 1000);
