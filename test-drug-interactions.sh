#!/bin/bash
# Test script for drug interaction checker feature

echo "=== PharmaTrust Drug Interaction Checker Test ==="
echo ""

# Base URL
BASE_URL="http://localhost:5001/api"

echo "Step 1: Testing drug interaction service directly..."
echo ""

# Test with common drug pair (Aspirin + Warfarin - known interaction)
echo "Testing: Aspirin + Warfarin (should have interaction)"
node -e "
const service = require('./backend/src/services/drugInteractionService');

(async () => {
  const result = await service.checkInteractions('Aspirin 100mg', 'Warfarin 5mg');
  console.log('Result:', JSON.stringify(result, null, 2));
  
  if (result.hasInteractions) {
    console.log('\n✅ SUCCESS: Interaction detected as expected');
    console.log('Interaction:', result.interactions[0]?.description);
  } else {
    console.log('\n❌ UNEXPECTED: No interaction found');
  }
})();
"

echo ""
echo "================================"
echo ""

# Test with non-interacting drugs
echo "Testing: Paracetamol + Vitamin D (should be safe)"
node -e "
const service = require('./backend/src/services/drugInteractionService');

(async () => {
  const result = await service.checkInteractions('Paracetamol 500mg', 'Vitamin D3 1000IU');
  console.log('Result:', JSON.stringify(result, null, 2));
  
  if (!result.hasInteractions) {
    console.log('\n✅ SUCCESS: No interaction detected as expected');
  } else {
    console.log('\n⚠️ WARNING: Unexpected interaction found');
  }
})();
"

echo ""
echo "================================"
echo ""
echo "Step 2: Full API test (requires authentication)"
echo ""
echo "To test the full API endpoints:"
echo "1. Sign up/login to get a token"
echo "2. Add medicines to your cabinet"
echo "3. Use the check-interactions endpoint"
echo ""
echo "Example commands:"
echo ""
echo "# Login"
echo "curl -X POST $BASE_URL/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"test@example.com\",\"password\":\"password123\"}'"
echo ""
echo "# Add medicines to cabinet"
echo "curl -X POST $BASE_URL/cabinet \\"
echo "  -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"medicineName\":\"Aspirin 100mg\",\"verificationStatus\":\"authentic\"}'"
echo ""
echo "# Check interactions"
echo "curl -X POST $BASE_URL/cabinet/check-interactions \\"
echo "  -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"medicine1Id\":\"ID1\",\"medicine2Id\":\"ID2\"}'"
echo ""
echo "=== Test Complete ==="
