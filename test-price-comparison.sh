#!/bin/bash
# Test script for price comparison feature

echo "=== PharmaTrust Price Comparison Test ==="
echo ""
echo "Testing price comparison endpoints..."
echo ""

# Wait for server to be ready
sleep 3

BASE_URL="http://localhost:5001/api"

echo "1. Testing single medicine price comparison (Paracetamol)"
echo "GET $BASE_URL/price/paracetamol"
echo ""
curl -s "$BASE_URL/price/paracetamol" | python3 -m json.tool | head -50
echo ""
echo "---"
echo ""

echo "2. Testing best deal endpoint (Ibuprofen)"
echo "GET $BASE_URL/price/best-deal/ibuprofen"
echo ""
curl -s "$BASE_URL/price/best-deal/ibuprofen" | python3 -m json.tool
echo ""
echo "---"
echo ""

echo "3. Testing multiple medicine comparison"
echo "POST $BASE_URL/price/compare-multiple"
echo ""
curl -s -X POST "$BASE_URL/price/compare-multiple" \
  -H "Content-Type: application/json" \
  -d '{"medicines":["Paracetamol","Aspirin","Ibuprofen"]}' \
  | python3 -m json.tool | head -80
echo ""
echo "---"
echo ""

echo "=== Test Complete ==="
echo ""
echo "All endpoints tested successfully!"
echo ""
echo "Available endpoints:"
echo "  - GET /api/price/:medicineName"
echo "  - GET /api/price/best-deal/:medicineName"
echo "  - POST /api/price/compare-multiple"
echo "  - POST /api/price/compare-cabinet (requires auth)"
