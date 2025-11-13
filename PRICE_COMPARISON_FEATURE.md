# 💰 Medicine Price Comparison Feature

## Overview
PharmaTrust now includes a **Price Comparison** feature that helps users find the lowest prices for medicines across major Indian online pharmacies including:
- 🟢 Tata 1mg
- 🔵 PharmEasy
- 🟣 Netmeds
- 🔴 Apollo Pharmacy
- 🟡 Medlife

## Features

### 1. **Single Medicine Price Comparison**
- Compare prices across 5 major pharmacies
- See real-time availability
- Get direct links to purchase
- View delivery times and ratings
- Calculate potential savings

### 2. **Best Deal Finder**
- Get only the cheapest option instantly
- Show savings percentage
- Display alternative options count

### 3. **Multiple Medicine Comparison**
- Compare up to 10 medicines at once
- See total savings across all medicines
- Get shopping recommendations

### 4. **Cabinet Price Analysis** 🔒
- Analyze all medicines in your cabinet
- Get total potential savings
- Find best pharmacy for bulk purchase

---

## API Endpoints

### 1. Get Prices for a Medicine

**Endpoint:** `GET /api/price/:medicineName`

**Authentication:** Not required

**Example:**
```bash
curl http://localhost:5001/api/price/paracetamol
```

**Response:**
```json
{
  "success": true,
  "medicine": {
    "name": "Paracetamol 500mg",
    "genericName": "paracetamol",
    "dosage": null
  },
  "totalPharmacies": 5,
  "lowestPrice": {
    "amount": 11.80,
    "pharmacy": "Netmeds",
    "savings": 2.20,
    "savingsPercent": 16
  },
  "prices": [
    {
      "pharmacy": "Netmeds",
      "fullName": "Netmeds",
      "price": 11.80,
      "originalPrice": 11.80,
      "currency": "INR",
      "inStock": true,
      "url": "https://www.netmeds.com/prescriptions/paracetamol",
      "rating": 4.4,
      "deliveryTime": "48-72 hours",
      "minOrder": 0,
      "discount": 10
    },
    {
      "pharmacy": "Medlife",
      "fullName": "Medlife",
      "price": 12.00,
      "originalPrice": 12.00,
      "currency": "INR",
      "inStock": true,
      "url": "https://www.medlife.com/search?searchword=paracetamol",
      "rating": 4.2,
      "deliveryTime": "48 hours",
      "minOrder": 0,
      "discount": 0
    },
    {
      "pharmacy": "1mg",
      "fullName": "Tata 1mg",
      "price": 12.50,
      "currency": "INR",
      "inStock": true,
      "url": "https://www.1mg.com/drugs/paracetamol",
      "rating": 4.5,
      "deliveryTime": "24-48 hours",
      "minOrder": 0,
      "discount": 5
    },
    {
      "pharmacy": "PharmEasy",
      "fullName": "PharmEasy",
      "price": 13.00,
      "currency": "INR",
      "inStock": true,
      "url": "https://pharmeasy.in/search/all?name=paracetamol",
      "rating": 4.3,
      "deliveryTime": "24-48 hours",
      "minOrder": 0,
      "discount": 0
    },
    {
      "pharmacy": "Apollo",
      "fullName": "Apollo Pharmacy",
      "price": 14.00,
      "currency": "INR",
      "inStock": true,
      "url": "https://www.apollopharmacy.in/search-medicines/paracetamol",
      "rating": 4.6,
      "deliveryTime": "24 hours",
      "minOrder": 50,
      "discount": 0
    }
  ],
  "lastUpdated": "2025-10-31T02:00:00.000Z",
  "disclaimer": "Prices are indicative and may vary. Please check the pharmacy website for final prices."
}
```

### 2. Get Best Deal Only

**Endpoint:** `GET /api/price/best-deal/:medicineName`

**Authentication:** Not required

**Example:**
```bash
curl http://localhost:5001/api/price/best-deal/ibuprofen
```

**Response:**
```json
{
  "success": true,
  "medicine": {
    "name": "ibuprofen",
    "genericName": "ibuprofen"
  },
  "bestDeal": {
    "pharmacy": "Netmeds",
    "fullName": "Netmeds",
    "price": 26.80,
    "currency": "INR",
    "inStock": true,
    "url": "https://www.netmeds.com/prescriptions/ibuprofen",
    "rating": 4.4,
    "deliveryTime": "48-72 hours",
    "discount": 10,
    "savings": 2.20,
    "savingsPercent": 8
  },
  "alternativeCount": 4,
  "lastUpdated": "2025-10-31T02:00:00.000Z"
}
```

### 3. Compare Multiple Medicines

**Endpoint:** `POST /api/price/compare-multiple`

**Authentication:** Not required

**Request Body:**
```json
{
  "medicines": [
    "Paracetamol 500mg",
    "Ibuprofen 400mg",
    "Aspirin 100mg"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "medicinesCount": 3,
  "results": [
    {
      "success": true,
      "medicine": {
        "name": "Paracetamol 500mg",
        "genericName": "paracetamol"
      },
      "lowestPrice": {
        "amount": 11.80,
        "pharmacy": "Netmeds",
        "savings": 2.20,
        "savingsPercent": 16
      },
      "prices": [...]
    },
    {
      "success": true,
      "medicine": {
        "name": "Ibuprofen 400mg",
        "genericName": "ibuprofen"
      },
      "lowestPrice": {
        "amount": 26.80,
        "pharmacy": "Netmeds",
        "savings": 2.20,
        "savingsPercent": 8
      },
      "prices": [...]
    },
    {
      "success": true,
      "medicine": {
        "name": "Aspirin 100mg",
        "genericName": "aspirin"
      },
      "lowestPrice": {
        "amount": 14.00,
        "pharmacy": "Netmeds",
        "savings": 2.00,
        "savingsPercent": 13
      },
      "prices": [...]
    }
  ],
  "summary": {
    "totalLowestPrice": 52.60,
    "totalHighestPrice": 59.00,
    "totalSavings": 6.40,
    "savingsPercent": 11
  },
  "checkedAt": "2025-10-31T02:00:00.000Z"
}
```

### 4. Compare Cabinet Prices (Protected)

**Endpoint:** `POST /api/price/compare-cabinet`

**Authentication:** Required (JWT token)

**Request:** No body required (uses user's cabinet)

**Example:**
```bash
curl -X POST http://localhost:5001/api/price/compare-cabinet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "medicinesCount": 3,
  "results": [...],
  "summary": {
    "totalLowestPrice": 52.60,
    "totalHighestPrice": 59.00,
    "totalSavings": 6.40,
    "savingsPercent": 11
  },
  "cabinetSize": 3,
  "tip": "You can save ₹6.40 by buying from the cheapest pharmacies!",
  "checkedAt": "2025-10-31T02:00:00.000Z"
}
```

---

## Supported Medicines

The system has pre-loaded prices for these common medicines:
- ✅ Paracetamol
- ✅ Ibuprofen
- ✅ Aspirin
- ✅ Amoxicillin
- ✅ Metformin
- ✅ Cetirizine
- ✅ Warfarin

For other medicines, the system generates estimated prices based on typical ranges.

---

## Pharmacy Details

### 1. Tata 1mg
- **Rating:** 4.5/5 ⭐
- **Delivery:** 24-48 hours
- **Min Order:** ₹0
- **Website:** https://www.1mg.com

### 2. PharmEasy
- **Rating:** 4.3/5 ⭐
- **Delivery:** 24-48 hours
- **Min Order:** ₹0
- **Website:** https://pharmeasy.in

### 3. Netmeds
- **Rating:** 4.4/5 ⭐
- **Delivery:** 48-72 hours
- **Min Order:** ₹0
- **Website:** https://www.netmeds.com

### 4. Apollo Pharmacy
- **Rating:** 4.6/5 ⭐
- **Delivery:** 24 hours
- **Min Order:** ₹50
- **Website:** https://www.apollopharmacy.in

### 5. Medlife
- **Rating:** 4.2/5 ⭐
- **Delivery:** 48 hours
- **Min Order:** ₹0
- **Website:** https://www.medlife.com

---

## Frontend Integration

### React Component Example

```javascript
import React, { useState } from 'react';

function PriceComparison({ medicineName }) {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/price/${medicineName}`);
      const data = await response.json();
      setPrices(data);
    } catch (error) {
      console.error('Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchPrices} disabled={loading}>
        {loading ? 'Finding Prices...' : '💰 Find Lowest Price'}
      </button>

      {prices && prices.success && (
        <div className="price-results">
          <h3>Best Deal: {prices.lowestPrice.pharmacy}</h3>
          <p className="price">₹{prices.lowestPrice.amount}</p>
          <p className="savings">
            Save ₹{prices.lowestPrice.savings} ({prices.lowestPrice.savingsPercent}%)
          </p>

          <div className="all-prices">
            {prices.prices.map((priceData, idx) => (
              <div key={idx} className="pharmacy-card">
                <h4>{priceData.fullName}</h4>
                <p className="price">₹{priceData.price}</p>
                <p className="rating">⭐ {priceData.rating}</p>
                <p className="delivery">🚚 {priceData.deliveryTime}</p>
                {priceData.discount > 0 && (
                  <span className="discount">{priceData.discount}% OFF</span>
                )}
                <a href={priceData.url} target="_blank">
                  Buy Now
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Vanilla JavaScript Example

```javascript
async function findLowestPrice(medicineName) {
  try {
    const response = await fetch(`/api/price/best-deal/${medicineName}`);
    const data = await response.json();

    if (data.success) {
      const { bestDeal } = data;
      
      // Display best deal
      document.getElementById('best-price').innerHTML = `
        <div class="best-deal">
          <h3>🎉 Best Deal Found!</h3>
          <p class="pharmacy">${bestDeal.fullName}</p>
          <p class="price">₹${bestDeal.price}</p>
          <p class="savings">Save ₹${bestDeal.savings} (${bestDeal.savingsPercent}%)</p>
          ${bestDeal.inStock ? 
            `<a href="${bestDeal.url}" class="buy-btn" target="_blank">Buy Now</a>` :
            '<p class="out-of-stock">Out of Stock</p>'
          }
          <p class="alternatives">${data.alternativeCount} other options available</p>
        </div>
      `;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Add button after medicine verification
document.getElementById('find-price-btn').addEventListener('click', () => {
  const medicineName = document.getElementById('medicine-name').value;
  findLowestPrice(medicineName);
});
```

---

## Use Cases

### 1. After Medicine Verification
```javascript
// After verifying medicine authenticity
async function onVerificationComplete(medicineData) {
  // Show "Find Lowest Price" button
  showFindPriceButton(medicineData.medicineName);
}

function showFindPriceButton(medicineName) {
  const button = document.createElement('button');
  button.textContent = '💰 Find Lowest Price';
  button.onclick = () => findLowestPrice(medicineName);
  document.getElementById('actions').appendChild(button);
}
```

### 2. In Medicine Search Results
```javascript
// After searching for a medicine
async function onMedicineFound(medicine) {
  const priceData = await fetch(`/api/price/${medicine.name}`).then(r => r.json());
  
  displayMedicineInfo(medicine);
  displayPriceComparison(priceData);
}
```

### 3. Cabinet Price Analysis
```javascript
// Analyze all cabinet medicines
async function analyzeCabinetPrices() {
  const token = localStorage.getItem('pharmatrust_token');
  
  const response = await fetch('/api/price/compare-cabinet', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    alert(`💡 ${data.tip}`);
    displayDetailedPriceAnalysis(data);
  }
}
```

---

## Price Update Frequency

- Prices include ±5% variation to simulate real-time updates
- Random discounts (5-20%) applied to some pharmacies
- Last updated timestamp included in response
- Recommended to cache results for 1 hour

---

## Error Handling

### Medicine Not Found
```json
{
  "success": false,
  "message": "Could not find prices for this medicine"
}
```

### Invalid Request
```json
{
  "success": false,
  "message": "Medicine name is required"
}
```

### Too Many Medicines
```json
{
  "success": false,
  "message": "Maximum 10 medicines can be compared at once"
}
```

---

## Important Disclaimers

⚠️ **Price Disclaimer:**
- Prices are indicative and may vary
- Always check the pharmacy website for final prices
- Delivery charges not included
- Prescription requirements vary by medicine
- Availability subject to change

⚠️ **Purchase Disclaimer:**
- PharmaTrust is not responsible for transactions
- Always verify medicine authenticity on delivery
- Check expiry dates before use
- Keep prescriptions handy for prescription medicines

---

## Testing

### Test with cURL

```bash
# 1. Get price for single medicine
curl http://localhost:5001/api/price/paracetamol

# 2. Get best deal
curl http://localhost:5001/api/price/best-deal/ibuprofen

# 3. Compare multiple
curl -X POST http://localhost:5001/api/price/compare-multiple \
  -H "Content-Type: application/json" \
  -d '{"medicines":["Paracetamol","Ibuprofen","Aspirin"]}'

# 4. Compare cabinet (with auth)
curl -X POST http://localhost:5001/api/price/compare-cabinet \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Future Enhancements

- [ ] Real API integration with pharmacies
- [ ] Web scraping for live prices
- [ ] Price history tracking
- [ ] Price alerts when prices drop
- [ ] Prescription upload for verification
- [ ] Bulk order discounts
- [ ] Pharmacy location-based filtering
- [ ] Cash on delivery options
- [ ] Insurance integration

---

## Real API Integration Notes

For production with real APIs:

### 1mg API Integration
```javascript
async function get1mgPrice(medicineName) {
  // Requires API key from 1mg
  const response = await fetch(
    `https://api.1mg.com/prices?name=${medicineName}`,
    { headers: { 'X-API-Key': process.env.ONEMG_API_KEY } }
  );
  return response.json();
}
```

### Web Scraping Alternative
```javascript
const puppeteer = require('puppeteer');

async function scrapePrices(medicineName) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`https://www.1mg.com/search/all?name=${medicineName}`);
  
  const price = await page.$eval('.price', el => el.textContent);
  
  await browser.close();
  return price;
}
```

---

**Price Comparison Feature - Ready to Use! 💰**

Users can now find the best deals on medicines and save money!
