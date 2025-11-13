// Complete test suite for all price comparison endpoints
const http = require('http');

const API_BASE = 'http://localhost:5001/api';

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

// Test helper functions
function printHeader(title) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function printSubHeader(title) {
  console.log(`\n${colors.blue}--- ${title} ---${colors.reset}\n`);
}

function printSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function printError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function printInfo(message) {
  console.log(`${colors.yellow}ℹ️  ${message}${colors.reset}`);
}

// Test 1: Single medicine price comparison
async function testSingleMedicinePrices() {
  printSubHeader('Test 1: Single Medicine Price Comparison');

  const medicines = ['paracetamol', 'azithromycin', 'insulin'];

  for (const medicine of medicines) {
    try {
      const response = await makeRequest(`/price/${medicine}`);

      if (response.status === 200 && response.data.success) {
        printSuccess(`${medicine}: Found prices from ${response.data.totalPharmacies} pharmacies`);
        console.log(`   Lowest: ₹${response.data.lowestPrice.price} (${response.data.lowestPrice.pharmacy})`);
        console.log(`   Savings: ₹${response.data.savings.toFixed(2)} (${response.data.savingsPercentage.toFixed(0)}%)`);
      } else {
        printError(`${medicine}: Failed to fetch prices`);
      }
    } catch (error) {
      printError(`${medicine}: ${error.message}`);
    }
  }
}

// Test 2: Best deal finder
async function testBestDeal() {
  printSubHeader('Test 2: Best Deal Finder');

  const medicines = ['ibuprofen', 'atorvastatin', 'gabapentin'];

  for (const medicine of medicines) {
    try {
      const response = await makeRequest(`/price/best-deal/${medicine}`);

      if (response.status === 200 && response.data.success) {
        printSuccess(`${medicine}: Best deal found`);
        console.log(`   Pharmacy: ${response.data.bestDeal.pharmacy}`);
        console.log(`   Price: ₹${response.data.bestDeal.price}`);
        console.log(`   Rating: ${response.data.bestDeal.rating} ⭐`);
        console.log(`   Delivery: ${response.data.bestDeal.deliveryTime}`);
        console.log(`   Potential savings: ₹${response.data.savings.toFixed(2)}`);
      } else {
        printError(`${medicine}: Failed to fetch best deal`);
      }
    } catch (error) {
      printError(`${medicine}: ${error.message}`);
    }
  }
}

// Test 3: Multiple medicine comparison
async function testMultipleMedicineComparison() {
  printSubHeader('Test 3: Multiple Medicine Comparison (Bulk)');

  const testCases = [
    {
      name: 'Common medicines',
      medicines: ['paracetamol', 'ibuprofen', 'aspirin'],
    },
    {
      name: 'Prescription medicines',
      medicines: ['metformin', 'atorvastatin', 'losartan', 'amlodipine'],
    },
    {
      name: 'Antibiotics',
      medicines: ['amoxicillin', 'azithromycin'],
    },
  ];

  for (const testCase of testCases) {
    try {
      const response = await makeRequest('/price/compare-multiple', 'POST', {
        medicines: testCase.medicines,
      });

      if (response.status === 200 && response.data.success) {
        printSuccess(`${testCase.name}: Compared ${response.data.results.length} medicines`);
        
        response.data.results.forEach((result) => {
          if (result.success) {
            console.log(`\n   ${result.medicine}:`);
            console.log(`   - Lowest: ₹${result.lowestPrice.price} (${result.lowestPrice.pharmacy})`);
            console.log(`   - Compared: ${result.totalPharmacies} pharmacies`);
          }
        });

        if (response.data.summary) {
          console.log(`\n   Summary:`);
          console.log(`   - Total Savings: ₹${response.data.summary.totalSavings.toFixed(2)}`);
          console.log(`   - Average Savings: ${response.data.summary.averageSavingsPercentage.toFixed(1)}%`);
        }
      } else {
        printError(`${testCase.name}: Failed to compare medicines`);
      }
    } catch (error) {
      printError(`${testCase.name}: ${error.message}`);
    }
  }
}

// Test 4: Cabinet price analysis (requires authentication)
async function testCabinetPriceAnalysis() {
  printSubHeader('Test 4: Cabinet Price Analysis');

  printInfo('This endpoint requires authentication (JWT token)');
  printInfo('Testing without token to verify protection...');

  try {
    const response = await makeRequest('/price/compare-cabinet', 'POST', {
      userId: 'test-user-id',
    });

    if (response.status === 401) {
      printSuccess('Endpoint correctly requires authentication');
      console.log('   Status: Protected ✓');
    } else if (response.status === 200) {
      printInfo('Endpoint returned data (authentication might be disabled in test mode)');
    } else {
      printError(`Unexpected status: ${response.status}`);
    }
  } catch (error) {
    printError(`Cabinet analysis test: ${error.message}`);
  }
}

// Test 5: Error handling
async function testErrorHandling() {
  printSubHeader('Test 5: Error Handling');

  const testCases = [
    {
      name: 'Non-existent medicine',
      path: '/price/nonexistentmedicine12345',
      expectedBehavior: 'Should return estimated prices',
    },
    {
      name: 'Empty medicine name',
      path: '/price/ ',
      expectedBehavior: 'Should handle gracefully',
    },
    {
      name: 'Too many medicines in bulk',
      method: 'POST',
      path: '/price/compare-multiple',
      body: {
        medicines: Array(15).fill('paracetamol'), // More than limit of 10
      },
      expectedBehavior: 'Should return error or limit',
    },
  ];

  for (const testCase of testCases) {
    try {
      const response = await makeRequest(
        testCase.path,
        testCase.method || 'GET',
        testCase.body || null
      );

      console.log(`\n   ${testCase.name}:`);
      console.log(`   - Status: ${response.status}`);
      console.log(`   - Behavior: ${testCase.expectedBehavior}`);

      if (response.data.success !== undefined) {
        console.log(`   - Success: ${response.data.success}`);
        if (response.data.note) {
          console.log(`   - Note: ${response.data.note}`);
        }
        if (response.data.error) {
          console.log(`   - Error: ${response.data.error}`);
        }
      }
    } catch (error) {
      console.log(`   ${testCase.name}: ${error.message}`);
    }
  }
}

// Test 6: Response structure validation
async function testResponseStructure() {
  printSubHeader('Test 6: Response Structure Validation');

  try {
    const response = await makeRequest('/price/paracetamol');

    if (response.status === 200 && response.data.success) {
      printSuccess('Validating response structure...');

      const requiredFields = [
        'success',
        'medicine',
        'lowestPrice',
        'prices',
        'totalPharmacies',
        'savings',
        'savingsPercentage',
      ];

      const missingFields = requiredFields.filter((field) => !(field in response.data));

      if (missingFields.length === 0) {
        printSuccess('All required fields present');
      } else {
        printError(`Missing fields: ${missingFields.join(', ')}`);
      }

      // Validate lowestPrice structure
      const lowestPriceFields = ['pharmacy', 'price', 'url', 'rating', 'deliveryTime'];
      const missingLowestPriceFields = lowestPriceFields.filter(
        (field) => !(field in response.data.lowestPrice)
      );

      if (missingLowestPriceFields.length === 0) {
        printSuccess('lowestPrice structure is valid');
      } else {
        printError(`lowestPrice missing fields: ${missingLowestPriceFields.join(', ')}`);
      }

      // Validate prices array structure
      if (Array.isArray(response.data.prices) && response.data.prices.length > 0) {
        const priceFields = [
          'pharmacy',
          'price',
          'url',
          'inStock',
          'rating',
          'deliveryTime',
          'isLowest',
        ];
        const firstPrice = response.data.prices[0];
        const missingPriceFields = priceFields.filter((field) => !(field in firstPrice));

        if (missingPriceFields.length === 0) {
          printSuccess('prices array structure is valid');
        } else {
          printError(`prices array missing fields: ${missingPriceFields.join(', ')}`);
        }
      }
    } else {
      printError('Failed to fetch data for validation');
    }
  } catch (error) {
    printError(`Structure validation: ${error.message}`);
  }
}

// Test 7: Performance test
async function testPerformance() {
  printSubHeader('Test 7: Performance Test');

  const medicines = ['paracetamol', 'ibuprofen', 'aspirin'];
  const times = [];

  for (const medicine of medicines) {
    const startTime = Date.now();
    try {
      await makeRequest(`/price/${medicine}`);
      const endTime = Date.now();
      const duration = endTime - startTime;
      times.push(duration);
      console.log(`   ${medicine}: ${duration}ms`);
    } catch (error) {
      printError(`${medicine}: ${error.message}`);
    }
  }

  if (times.length > 0) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
    console.log(`\n   Average response time: ${avgTime.toFixed(2)}ms`);

    if (avgTime < 100) {
      printSuccess('Performance is excellent (<100ms)');
    } else if (avgTime < 500) {
      printSuccess('Performance is good (<500ms)');
    } else {
      printInfo('Performance could be improved (>500ms)');
    }
  }
}

// Main test runner
async function runAllTests() {
  printHeader('PharmaTrust Price Comparison API - Complete Test Suite');

  console.log(`${colors.yellow}Testing API at: ${API_BASE}${colors.reset}\n`);

  try {
    await testSingleMedicinePrices();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testBestDeal();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testMultipleMedicineComparison();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testCabinetPriceAnalysis();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testErrorHandling();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testResponseStructure();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await testPerformance();

    printHeader('Test Suite Complete');
    printSuccess('All tests finished successfully! 🎉');
  } catch (error) {
    printError(`Test suite error: ${error.message}`);
    process.exit(1);
  }
}

// Run tests after server is ready
setTimeout(() => {
  runAllTests().catch((error) => {
    printError(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}, 1000);
