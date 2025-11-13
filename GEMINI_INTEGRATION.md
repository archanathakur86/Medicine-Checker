# Gemini AI Integration for PharmaTrust

## 🤖 Overview

PharmaTrust now uses **Google Gemini AI** (gemini-1.5-flash model) for real-time pharmaceutical verification. When users upload medicine images, the system analyzes them using advanced AI vision capabilities.

## 🔄 How It Works

### User Flow:
1. **User uploads image(s)** via "Upload Medicine Photo" button
2. **Frontend sends images** to backend API (`POST /api/verify`)
3. **Backend forwards to Gemini API** with pharmaceutical verification prompt
4. **Gemini analyzes** packaging, printing, security features, etc.
5. **Backend parses response** into score, status, and findings
6. **Frontend displays results** in green/yellow/red verification box

## 📋 Verification Criteria

Gemini AI examines:
- ✅ Logo quality and clarity
- ✅ Font clarity and printing quality
- ✅ Batch number text quality and format
- ✅ Physical appearance of packaging
- ✅ Color consistency and quality
- ✅ Holographic or security features
- ✅ Text alignment and spacing
- ✅ Overall packaging integrity

## 🎯 Response Format

### Gemini Analysis Structure:
```
AUTHENTICITY_SCORE: [0-100]
STATUS: [authentic/suspect/counterfeit]
FINDINGS:
- Clear and legible printing with professional quality
- Batch number format matches manufacturer standards
- Holographic security features present
- Packaging quality consistent with genuine products
- Expiry date clearly visible and properly formatted
```

### API Response:
```json
{
  "score": 85,
  "status": "authentic",
  "hints": [
    "Clear and legible printing with professional quality",
    "Batch number format matches manufacturer standards",
    "Holographic security features present"
  ],
  "fullAnalysis": "Full Gemini response text...",
  "filesAnalyzed": 2,
  "analyzedAt": "2025-10-31T00:00:00.000Z"
}
```

## 🎨 UI Status Indicators

### Authentic (Score ≥ 80):
- **Color:** Green (`bg-green-50`, `border-green-300`)
- **Status:** "Appears Genuine"
- **Confidence:** "HIGH CONFIDENCE"
- **Icon:** Green checkmark

### Suspect (Score 50-79):
- **Color:** Yellow (`bg-yellow-50`, `border-yellow-300`)
- **Status:** "Requires Further Inspection"
- **Confidence:** "MEDIUM CONFIDENCE"
- **Icon:** Yellow warning

### Counterfeit (Score < 50):
- **Color:** Red (`bg-red-50`, `border-red-300`)
- **Status:** "Potentially Counterfeit"
- **Confidence:** "HIGH RISK"
- **Icon:** Red alert

## 🔧 Technical Implementation

### Backend Service (`src/services/aiVerifier.js`)

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Convert images to base64 format
const imageParts = files.map(file => ({
  inlineData: {
    data: file.buffer.toString('base64'),
    mimeType: file.mimetype,
  }
}));

// Send to Gemini with verification prompt
const result = await model.generateContent([
  VERIFICATION_PROMPT,
  ...imageParts
]);
```

### Frontend Integration (`index.html`)

```javascript
// Upload handler
async function handleFileUpload() {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('images', files[i]);
  }
  
  const response = await fetch('/api/verify', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  displayGeminiVerification(data);
}
```

## 🔑 API Key Setup

Your Gemini API key is configured in:
- `backend/.env` → `API_KEY=AIzaSyBzIuvcqo4Hy0nXKK89v-LXXbkBB49eFa4`
- Loaded via `src/config/index.js`
- Used by `src/services/aiVerifier.js`

## 📦 Dependencies

```json
{
  "@google/generative-ai": "^0.21.0"
}
```

Installed with: `npm install @google/generative-ai`

## 🧪 Testing the Integration

### Test with cURL:
```bash
curl -X POST http://localhost:5001/api/verify \
  -F "images=@medicine_photo.jpg" \
  | jq
```

### Expected Response:
```json
{
  "score": 85,
  "status": "authentic",
  "hints": [
    "Clear and legible printing",
    "Batch number appears valid",
    "Holographic security features present"
  ],
  "filesAnalyzed": 1,
  "analyzedAt": "2025-10-31T00:47:00.000Z"
}
```

### Test with UI:
1. Open `file:///home/navgurukul/medicine/index.html`
2. Click "Upload Medicine Photo"
3. Select a medicine package image
4. Wait for Gemini AI analysis (2-5 seconds)
5. View results in the verification box

## 🔒 Security Best Practices

### API Key Protection:
- ✅ API key stored in `.env` (not committed to git)
- ✅ Backend-only access (never exposed to frontend)
- ✅ Rate limiting recommended for production
- ✅ Enable API restrictions in Google Cloud Console

### Recommended Restrictions:
1. **API Key Restrictions:**
   - Restrict to Generative Language API only
   - Set IP allowlist (your server IPs)
   - Enable application restrictions

2. **Usage Quotas:**
   - Set daily request limits
   - Monitor usage in Google Cloud Console
   - Set up billing alerts

## 📊 Model Capabilities

**Gemini 1.5 Flash:**
- Fast response times (2-5 seconds)
- Multimodal (text + images)
- Up to 1 million tokens context
- Excellent for vision tasks
- Cost-effective for production

## ⚠️ Error Handling

### Fallback Behavior:
If Gemini API fails, the system returns:
```json
{
  "score": 75,
  "status": "suspect",
  "hints": [
    "AI analysis temporarily unavailable",
    "Manual verification recommended",
    "Error: [error message]"
  ],
  "error": "API error details"
}
```

### Common Errors:
- **API_KEY not configured** → Check `.env` file
- **Rate limit exceeded** → Wait or upgrade quota
- **Invalid image format** → Use JPG/PNG
- **Image too large** → Resize before upload

## 🚀 Production Deployment

### Checklist:
- [ ] Secure API key with proper restrictions
- [ ] Enable HTTPS for all endpoints
- [ ] Implement rate limiting (e.g., 100 requests/hour)
- [ ] Add request caching for duplicate images
- [ ] Set up monitoring and logging
- [ ] Configure CDN for image optimization
- [ ] Add user authentication
- [ ] Implement audit logging

### Environment Variables:
```bash
# Production .env
API_KEY=your_actual_gemini_api_key
NODE_ENV=production
PORT=5001
CORS_ORIGIN=https://your-domain.com
MAX_FILES=5
MAX_FILE_SIZE_MB=5
```

## 📈 Performance Optimization

### Tips:
1. **Image Preprocessing:**
   - Resize images to max 1024px
   - Compress to reduce upload time
   - Convert to JPEG for faster processing

2. **Caching:**
   - Cache results for identical images
   - Use Redis for distributed caching
   - Set TTL to 24 hours

3. **Batch Processing:**
   - Process multiple images in parallel
   - Limit to 3 images per request
   - Show progress indicator

## 🎓 Learning Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Vision API Best Practices](https://ai.google.dev/docs/vision)
- [Rate Limits & Quotas](https://ai.google.dev/pricing)

## 🐛 Troubleshooting

### Issue: "API_KEY not configured"
**Solution:** Add API key to `backend/.env` file

### Issue: "Connection error"
**Solution:** Check backend is running on port 5001

### Issue: "Rate limit exceeded"
**Solution:** Wait 60 seconds or upgrade quota

### Issue: "Invalid image format"
**Solution:** Use JPG, PNG, or WebP formats

---

**Status:** ✅ **Gemini AI Integration Complete**

Your PharmaTrust application now uses real AI-powered verification with Google Gemini! 🎉
