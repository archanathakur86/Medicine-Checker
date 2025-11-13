#!/bin/bash

# Test all medicine searches and price comparisons

echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║         Testing PharmaTrust - Medicine Search & Prices          ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# Test medicine searches
echo "📋 Testing Medicine Search (17 medicines available):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

medicines=("paracetamol" "ibuprofen" "aspirin" "insulin" "gabapentin" "azithromycin")

for med in "${medicines[@]}"; do
    echo ""
    echo "Testing: $med"
    response=$(curl -s http://localhost:5001/api/medicine/$med)
    
    if echo "$response" | grep -q '"name"'; then
        name=$(echo "$response" | jq -r '.name')
        dosage=$(echo "$response" | jq -r '.dosage')
        echo "  ✅ Found: $name - $dosage"
    else
        echo "  ❌ Not found"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💰 Testing Price Comparison:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

price_meds=("paracetamol" "insulin" "gabapentin")

for med in "${price_meds[@]}"; do
    echo ""
    echo "Price for: $med"
    response=$(curl -s http://localhost:5001/api/price/$med)
    
    if echo "$response" | grep -q '"success":true'; then
        pharmacy=$(echo "$response" | jq -r '.lowestPrice.pharmacy')
        price=$(echo "$response" | jq -r '.lowestPrice.amount')
        echo "  💵 Best price: ₹$price at $pharmacy"
    else
        echo "  ⚠️  Price not available"
    fi
done

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  ✅ Testing Complete! Open http://localhost:5174 to use the app  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
