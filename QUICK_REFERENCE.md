# 🚀 Quick Reference - Drug Interaction Checker

## ⚡ Quick Start

### 1. Test the Feature (No Auth Required)
```bash
cd /home/navgurukul/medicine
node test-interactions.js
```

### 2. API Testing (Requires Auth)

#### Step 1: Login
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

#### Step 2: Add Medicines
```bash
# Save the token from step 1, then:
curl -X POST http://localhost:5001/api/cabinet \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"medicineName":"Aspirin 100mg","verificationStatus":"authentic"}'

curl -X POST http://localhost:5001/api/cabinet \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"medicineName":"Warfarin 5mg","verificationStatus":"authentic"}'
```

#### Step 3: Check Interactions
```bash
# Get medicine IDs
curl http://localhost:5001/api/cabinet \
  -H "Authorization: Bearer YOUR_TOKEN"

# Check interactions (use actual IDs)
curl -X POST http://localhost:5001/api/cabinet/check-interactions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"medicine1Id":"ID1","medicine2Id":"ID2"}'
```

---

## 📋 Quick API Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/signup` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login user |
| `/api/cabinet` | GET | Yes | Get cabinet |
| `/api/cabinet` | POST | Yes | Add medicine |
| `/api/cabinet/check-interactions` | POST | Yes | ⚠️ Check 2 medicines |
| `/api/cabinet/check-all-interactions` | POST | Yes | ⚠️ Scan cabinet |

---

## 🔥 Common Interactions

| Medicine 1 | Medicine 2 | Severity | Description |
|------------|------------|----------|-------------|
| Warfarin | Aspirin | 🔴 HIGH | Increased bleeding risk |
| Warfarin | Ibuprofen | 🔴 HIGH | Increased bleeding risk |
| Aspirin | Ibuprofen | 🟡 MODERATE | Reduced cardioprotection |
| Ibuprofen | Naproxen | 🔴 HIGH | Don't mix NSAIDs |

---

## 📁 Key Files

```
backend/src/
  ├── services/drugInteractionService.js  ← Core logic
  ├── controllers/cabinet.controller.js   ← Endpoints
  └── routes/cabinet.routes.js            ← Routes

Documentation/
  ├── DRUG_INTERACTION_CHECKER.md        ← Full docs
  ├── COMPLETE_FEATURES.md                ← Feature summary
  └── INTERACTION_IMPLEMENTATION_SUMMARY.md ← This feature

Tests/
  └── test-interactions.js                ← Automated tests
```

---

## 🧪 Test Results

✅ **Aspirin + Warfarin**: HIGH interaction detected  
✅ **Paracetamol + Vitamin D**: No interaction  
✅ **Multiple medicines**: 3 interactions found in batch  

---

## 💡 Frontend Integration Snippet

```javascript
async function checkTwoMedicines(id1, id2) {
  const token = localStorage.getItem('pharmatrust_token');
  
  const response = await fetch('/api/cabinet/check-interactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      medicine1Id: id1,
      medicine2Id: id2
    })
  });
  
  const data = await response.json();
  
  if (data.hasInteractions) {
    // Show warning
    alert(`⚠️ ${data.interactions[0].severity} INTERACTION\n${data.interactions[0].description}`);
  }
}
```

---

## ⚠️ Important Notes

1. **Always requires authentication** (JWT token)
2. **Medicines must be in user's cabinet** first
3. **Uses generic names** for best results
4. **Fallback database** if NIH API unavailable
5. **Consult doctor** before making changes

---

## 🎯 What's Working

✅ Backend server running on port 5001  
✅ Two-medicine interaction check  
✅ Full cabinet scan  
✅ Known interactions database (9 pairs)  
✅ Severity levels  
✅ RxCUI lookup  
✅ Generic name extraction  
✅ Error handling  
✅ JWT authentication  
✅ Comprehensive documentation  

---

## 📞 Quick Help

**Server not responding?**
```bash
cd backend && npm run dev
```

**Need to test quickly?**
```bash
node test-interactions.js
```

**Need medicine IDs?**
```bash
curl http://localhost:5001/api/cabinet -H "Authorization: Bearer TOKEN"
```

---

## 🎉 Success!

The drug interaction checker is **fully functional** and ready to use!

- ✅ 9 dangerous interactions pre-loaded
- ✅ NIH RxNav API integration
- ✅ Automatic generic name extraction
- ✅ Comprehensive error handling
- ✅ Full documentation provided

---

**Server Status**: 🟢 Running on http://localhost:5001

**Documentation**: See DRUG_INTERACTION_CHECKER.md for complete details

**Test Command**: `node test-interactions.js`
