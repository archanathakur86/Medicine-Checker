# Drug Interaction Checker Feature

## Overview
PharmaTrust now includes a powerful drug interaction checker that uses the **NIH RxNav API** (National Library of Medicine) to detect potential interactions between medicines in a user's cabinet.

## Features

### 1. **Two-Medicine Interaction Check**
- Select any two medicines from your cabinet
- Get instant interaction warnings
- View detailed interaction descriptions
- See severity levels for each interaction

### 2. **Full Cabinet Scan**
- Check all medicines in cabinet against each other
- Automatically scans all possible pairs
- Comprehensive interaction report
- Summary of total interactions found

### 3. **NIH RxNav Integration**
- Uses official NIH database (RxNav/DrugBank)
- Access to millions of drug combinations
- Regularly updated interaction data
- Generic and brand name support

## API Endpoints

### Check Interaction Between Two Medicines

**Endpoint:** `POST /api/cabinet/check-interactions`

**Authentication:** Required (JWT token)

**Request Body:**
```json
{
  "medicine1Id": "507f1f77bcf86cd799439011",
  "medicine2Id": "507f1f77bcf86cd799439012"
}
```

**Response (With Interactions):**
```json
{
  "success": true,
  "medicine1": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Warfarin 5mg",
    "genericName": "warfarin",
    "rxcui": "11289"
  },
  "medicine2": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Aspirin 100mg",
    "genericName": "aspirin",
    "rxcui": "1191"
  },
  "hasInteractions": true,
  "interactionCount": 1,
  "interactions": [
    {
      "description": "The risk or severity of bleeding can be increased when Warfarin is combined with Aspirin.",
      "severity": "high",
      "drug1": "Warfarin",
      "drug2": "Aspirin"
    }
  ],
  "checkedAt": "2025-10-31T01:30:00.000Z",
  "warning": "⚠️ Drug interactions detected! Consult your doctor before taking these medicines together."
}
```

**Response (No Interactions):**
```json
{
  "success": true,
  "medicine1": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Paracetamol 500mg",
    "genericName": "paracetamol",
    "rxcui": "161"
  },
  "medicine2": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Vitamin D3 1000IU",
    "genericName": "vitamin",
    "rxcui": "8150"
  },
  "hasInteractions": false,
  "interactionCount": 0,
  "interactions": [],
  "checkedAt": "2025-10-31T01:30:00.000Z",
  "warning": "✓ No known interactions found between these medicines."
}
```

### Check All Interactions in Cabinet

**Endpoint:** `POST /api/cabinet/check-all-interactions`

**Authentication:** Required (JWT token)

**Request Body:** None (automatically uses all medicines in user's cabinet)

**Response:**
```json
{
  "success": true,
  "medicinesInCabinet": 4,
  "totalPairsChecked": 6,
  "interactionsFound": true,
  "allInteractions": [
    {
      "medicine1": "Warfarin 5mg",
      "medicine2": "Aspirin 100mg",
      "interactions": [
        {
          "description": "The risk or severity of bleeding can be increased when Warfarin is combined with Aspirin.",
          "severity": "high",
          "drug1": "Warfarin",
          "drug2": "Aspirin"
        }
      ]
    },
    {
      "medicine1": "Ibuprofen 400mg",
      "medicine2": "Aspirin 100mg",
      "interactions": [
        {
          "description": "Ibuprofen may decrease the antiplatelet activities of Aspirin.",
          "severity": "moderate",
          "drug1": "Ibuprofen",
          "drug2": "Aspirin"
        }
      ]
    }
  ],
  "checkedAt": "2025-10-31T01:30:00.000Z",
  "warning": "⚠️ Drug interactions detected in your cabinet! Review the details below and consult your doctor."
}
```

## How It Works

### 1. Generic Name Extraction
The system automatically extracts generic drug names from your medicine entries:
- "Paracetamol 500mg" → "paracetamol"
- "Ibuprofen 400mg Tablets" → "ibuprofen"
- "Aspirin 100mg" → "aspirin"

### 2. RxCUI Lookup
Each medicine is looked up in the NIH RxNorm database to get its RxCUI (RxNorm Concept Unique Identifier):
- Paracetamol → RxCUI: 161
- Ibuprofen → RxCUI: 5640
- Warfarin → RxCUI: 11289

### 3. Interaction Check
The system queries the NIH DrugBank database for known interactions between the RxCUIs.

### 4. Results Processing
Interactions are parsed and returned with:
- Description of the interaction
- Severity level (high, moderate, low)
- Both drug names involved

## Common Drug Interactions

### High Severity
- **Warfarin + Aspirin**: Increased bleeding risk
- **Warfarin + Ibuprofen**: Increased bleeding risk
- **ACE Inhibitors + Potassium Supplements**: Hyperkalemia risk

### Moderate Severity
- **Ibuprofen + Aspirin**: Reduced antiplatelet effect
- **Metformin + Alcohol**: Lactic acidosis risk
- **Statins + Grapefruit**: Increased statin levels

### Low Severity
- **Calcium + Iron**: Reduced iron absorption
- **Antibiotics + Dairy**: Reduced antibiotic absorption

## Testing the Feature

### Using cURL

**1. Check Two Medicines:**
```bash
# First, add some medicines to your cabinet
curl -X POST http://localhost:5001/api/cabinet \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicineName": "Warfarin 5mg",
    "manufacturer": "PharmaCo",
    "verificationStatus": "authentic"
  }'

curl -X POST http://localhost:5001/api/cabinet \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicineName": "Aspirin 100mg",
    "manufacturer": "MediCure",
    "verificationStatus": "authentic"
  }'

# Get your cabinet to see medicine IDs
curl http://localhost:5001/api/cabinet \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check interactions (use actual IDs from your cabinet)
curl -X POST http://localhost:5001/api/cabinet/check-interactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "medicine1Id": "MEDICINE_1_ID_HERE",
    "medicine2Id": "MEDICINE_2_ID_HERE"
  }'
```

**2. Check All Interactions:**
```bash
curl -X POST http://localhost:5001/api/cabinet/check-all-interactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Frontend Integration

### JavaScript Example

```javascript
// Check interaction between two medicines
async function checkInteraction(medicine1Id, medicine2Id) {
  const token = localStorage.getItem('pharmatrust_token');
  
  const response = await fetch('/api/cabinet/check-interactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      medicine1Id,
      medicine2Id
    })
  });
  
  const data = await response.json();
  
  if (data.hasInteractions) {
    // Show warning to user
    alert(`⚠️ INTERACTION DETECTED!\n\n${data.interactions[0].description}`);
  } else {
    alert('✓ No interactions found');
  }
  
  return data;
}

// Check all interactions in cabinet
async function checkAllInteractions() {
  const token = localStorage.getItem('pharmatrust_token');
  
  const response = await fetch('/api/cabinet/check-all-interactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (data.interactionsFound) {
    console.log(`Found ${data.allInteractions.length} interactions`);
    data.allInteractions.forEach(interaction => {
      console.log(`${interaction.medicine1} + ${interaction.medicine2}`);
      interaction.interactions.forEach(detail => {
        console.log(`  - ${detail.description}`);
      });
    });
  }
  
  return data;
}
```

### React Component Example

```jsx
import React, { useState } from 'react';

function InteractionChecker({ medicine1Id, medicine2Id }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkInteraction = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('pharmatrust_token');
      const response = await fetch('/api/cabinet/check-interactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ medicine1Id, medicine2Id })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error checking interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={checkInteraction} disabled={loading}>
        {loading ? 'Checking...' : 'Check Interactions'}
      </button>
      
      {result && (
        <div className={result.hasInteractions ? 'warning' : 'safe'}>
          <p>{result.warning}</p>
          {result.interactions.map((interaction, idx) => (
            <div key={idx}>
              <strong>Severity: {interaction.severity}</strong>
              <p>{interaction.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Error Handling

The system handles various error cases:

1. **Medicine not found in NIH database**: Returns message indicating drug not found
2. **API timeout**: Graceful fallback with error message
3. **Invalid medicine IDs**: Returns 404 error
4. **Same medicine selected twice**: Returns 400 error

## Limitations

1. **Generic names**: Works best with generic drug names
2. **Brand names**: May not recognize all brand names
3. **Combination drugs**: May need to check each component separately
4. **Herbal supplements**: Limited data for non-prescription supplements
5. **Regional differences**: Based on US drug database

## Important Disclaimer

⚠️ **This tool is for informational purposes only.**

- Always consult your doctor or pharmacist before taking new medicines
- Do not stop taking prescribed medicines without medical advice
- Drug interactions can vary based on dosage, timing, and individual factors
- Some interactions may not be detected by the database

## Technical Details

### NIH RxNav API
- **Base URL**: https://rxnav.nlm.nih.gov/REST
- **Rate Limit**: No authentication required, reasonable use policy
- **Data Source**: DrugBank, FDA, and other sources
- **Update Frequency**: Regular updates from NIH

### Endpoints Used
1. `/rxcui.json?name={drugName}` - Get RxCUI for drug name
2. `/interaction/interaction.json?rxcui={rxcui}&sources=DrugBank` - Get interactions

### Performance
- Average response time: 1-3 seconds per pair
- Batch checking: Sequential to avoid API rate limits
- Caching: Can be implemented for frequently checked pairs

## Future Enhancements

- [ ] Cache interaction results for 24 hours
- [ ] Add severity level filtering
- [ ] Export interaction report as PDF
- [ ] Email alerts for dangerous interactions
- [ ] Integration with prescription data
- [ ] Support for food-drug interactions
- [ ] Multi-language support
- [ ] Offline fallback database

## Resources

- [NIH RxNav API Documentation](https://lhncbc.nlm.nih.gov/RxNav/APIs/)
- [DrugBank Database](https://www.drugbank.ca/)
- [FDA Drug Interactions](https://www.fda.gov/drugs/drug-interactions-labeling)

## Support

For issues or questions about drug interactions:
1. Check the API response for detailed error messages
2. Verify medicine names are spelled correctly
3. Try using generic drug names instead of brand names
4. Consult documentation at NIH RxNav website
