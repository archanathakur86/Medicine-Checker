# 🧪 Testing Gemini AI Integration

## Quick Start

Your PharmaTrust application is now live with Google Gemini AI integration!

### 🌐 Access Points:
- **Frontend:** `file:///home/navgurukul/medicine/index.html` (Already open in browser)
- **Backend API:** `http://localhost:5001`

## 📸 Test AI Verification

### Step 1: Prepare Test Images
Take or download images of medicine packages. Good test images include:
- Medicine box/packaging
- Blister packs
- Medicine bottles with labels
- Close-ups of batch numbers

### Step 2: Upload via UI
1. Open the HTML page (already open)
2. Click **"Upload Medicine Photo"** button
3. Select 1-3 medicine images
4. Wait 2-5 seconds for Gemini AI analysis
5. View results in the verification box

### Step 3: Interpret Results

**Green Box (Authentic):**
- Score: 80-100
- Status: "Appears Genuine"
- Confidence: HIGH CONFIDENCE

**Yellow Box (Suspect):**
- Score: 50-79
- Status: "Requires Further Inspection"
- Confidence: MEDIUM CONFIDENCE

**Red Box (Counterfeit):**
- Score: 0-49
- Status: "Potentially Counterfeit"
- Confidence: HIGH RISK

## 🔍 What Gemini AI Checks

The AI analyzes:
1. ✅ **Logo Quality** - Sharpness and consistency
2. ✅ **Font Clarity** - Print quality and legibility
3. ✅ **Batch Numbers** - Format and readability
4. ✅ **Packaging** - Material quality and seals
5. ✅ **Security Features** - Holograms, watermarks
6. ✅ **Color Consistency** - Uniform printing
7. ✅ **Text Alignment** - Professional layout
8. ✅ **Overall Integrity** - Signs of tampering

## 🧪 API Testing

### Test with cURL:

```bash
# Test verification endpoint
curl -X POST http://localhost:5001/api/verify \
  -F "images=@your_medicine_photo.jpg"
```

### Expected Response:
```json
{
  "score": 85,
  "status": "authentic",
  "hints": [
    "Clear and legible printing with professional quality",
    "Batch number format matches manufacturer standards",
    "Holographic security features present",
    "Packaging quality consistent with genuine products",
    "Expiry date clearly visible and properly formatted"
  ],
  "fullAnalysis": "Detailed Gemini response...",
  "filesAnalyzed": 1,
  "analyzedAt": "2025-10-31T00:50:00.000Z"
}
```

## 🎯 Test Scenarios

### Scenario 1: High Quality Package
- Upload clear photo of genuine medicine
- Expected: Green box, score 80-100

### Scenario 2: Blurry or Poor Quality
- Upload low-resolution or blurry image
- Expected: Yellow box, score 50-70

### Scenario 3: Multiple Images
- Upload 2-3 images of same medicine
- Expected: More detailed analysis

## 📊 Monitoring Gemini API Calls

### Backend Logs:
Watch the terminal for:
```bash
Gemini API Response: AUTHENTICITY_SCORE: 85
STATUS: authentic
FINDINGS:
- Clear and legible printing...
```

### Error Logs:
If API fails, you'll see:
```bash
Gemini API Error: [error message]
```

## 🔧 Troubleshooting

### Issue: "AI analysis temporarily unavailable"
**Cause:** Gemini API error or rate limit
**Solution:** 
- Check API key is correct in `.env`
- Wait 60 seconds and retry
- Check Google Cloud Console for quota

### Issue: Loading forever
**Cause:** Backend not responding
**Solution:**
- Check backend is running: `curl http://localhost:5001/api/medicine/ibuprofen`
- Restart backend: `cd backend && PORT=5001 node src/server.js`

### Issue: "Connection error"
**Cause:** CORS or network issue
**Solution:**
- Open browser console (F12)
- Check for CORS errors
- Verify API_BASE is correct

## 📈 Performance Tips

### For Best Results:
1. **Image Quality:**
   - Use good lighting
   - Focus on text and logos
   - Avoid shadows or glare
   - Resolution: 800x600 minimum

2. **File Size:**
   - Keep under 5MB per image
   - Compress if needed
   - Use JPG format

3. **Multiple Angles:**
   - Upload front, back, and side views
   - Include close-ups of batch numbers
   - Show security features

## 🎓 Understanding the AI Analysis

### Gemini's Verification Process:
1. **Image Recognition:** Identifies medicine packaging elements
2. **Text Analysis:** Reads and validates text quality
3. **Pattern Matching:** Compares with known genuine patterns
4. **Feature Detection:** Spots security features
5. **Anomaly Detection:** Flags suspicious elements
6. **Scoring:** Combines all factors into confidence score

### Key Findings Categories:
- **Printing Quality:** Font sharpness, ink consistency
- **Security Features:** Holograms, special inks
- **Batch Information:** Number format, date validity
- **Physical Condition:** Packaging integrity, seals
- **Authenticity Markers:** Brand elements, logos

## 🚀 Next Steps

1. **Test with Real Images:**
   - Try various medicine packages
   - Compare results with known authentic/fake samples

2. **Fine-tune Prompts:**
   - Modify `VERIFICATION_PROMPT` in `src/services/aiVerifier.js`
   - Add specific checks for your region/market

3. **Add More Features:**
   - QR code scanning
   - Barcode validation
   - Database cross-reference

4. **Monitor Usage:**
   - Track API calls in Google Cloud Console
   - Set up usage alerts
   - Optimize costs

## 📞 Support

### Resources:
- **Gemini Docs:** https://ai.google.dev/docs
- **API Console:** https://console.cloud.google.com
- **Code:** `backend/src/services/aiVerifier.js`
- **Config:** `backend/.env`

---

**Status:** ✅ **Ready to Test!**

Your PharmaTrust application is live with real Gemini AI verification. Upload an image to see it in action! 🎉
