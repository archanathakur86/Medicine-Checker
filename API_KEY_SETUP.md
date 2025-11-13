# API Key Configuration

## API Key Added
Your Google API Key has been added to the PharmaTrust project:
```
AIzaSyBzIuvcqo4Hy0nXKK89v-LXXbkBB49eFa4
```

## Where the API Key is Stored

### Backend
- **File:** `backend/.env`
- **Variable:** `API_KEY`
- **Access in code:** Via `config.API_KEY` (imported from `src/config/index.js`)

### Frontend (React)
- **File:** `frontend/.env`
- **Variable:** `VITE_API_KEY`
- **Access in code:** Via `import.meta.env.VITE_API_KEY`

### HTML File
- **File:** `index.html`
- **Variable:** `API_KEY` (JavaScript constant)
- Directly embedded in the script section

## How to Use the API Key

### In Backend Code
```javascript
const { API_KEY } = require('./config');

// Example: Use in API call
const response = await fetch(`https://api.example.com/endpoint?key=${API_KEY}`);
```

### In Frontend React Components
```javascript
const apiKey = import.meta.env.VITE_API_KEY;

// Example: Use in API call
const response = await fetch(`https://api.example.com/endpoint?key=${apiKey}`);
```

### In HTML File (Already Added)
```javascript
const API_KEY = 'AIzaSyBzIuvcqo4Hy0nXKK89v-LXXbkBB49eFa4';

// Use in fetch calls
fetch(`https://api.example.com/endpoint?key=${API_KEY}`)
```

## Common Use Cases for Google API Key

This appears to be a Google Cloud API key. It can be used for:

1. **Google Vision API** - For image analysis and OCR
2. **Google Cloud AI** - For machine learning predictions
3. **Google Maps API** - For location services
4. **Google Translate API** - For translation services

### Example: Using with Google Vision API

```javascript
// Backend example (Node.js)
const { API_KEY } = require('./config');

async function analyzeImage(imageBase64) {
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: imageBase64 },
          features: [{ type: 'TEXT_DETECTION' }, { type: 'LABEL_DETECTION' }]
        }]
      })
    }
  );
  return await response.json();
}
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Backend Only for Production**
   - For production apps, API keys should ONLY be stored on the backend
   - Never expose API keys in frontend code that users can access
   - The HTML file includes the key for demo purposes only

2. **Environment Variables**
   - `.env` files are already in `.gitignore` to prevent committing secrets
   - Always use `.env.example` as a template without real keys

3. **API Key Restrictions**
   - Configure API key restrictions in Google Cloud Console:
     - Set allowed IP addresses
     - Set allowed domains/URLs
     - Enable only specific APIs you need
     - Set usage quotas

4. **Rotate Keys**
   - Regularly rotate API keys
   - If a key is exposed, immediately regenerate it in Google Cloud Console

## Restart Required

After adding environment variables, restart your servers:

```bash
# Backend
cd backend
PORT=5001 npm start

# Frontend (if using React)
cd frontend
npm run dev
```

## Testing the API Key

You can verify the API key works by making a test call:

```bash
# Test with curl (replace with actual API endpoint)
curl "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBzIuvcqo4Hy0nXKK89v-LXXbkBB49eFa4" \
  -H "Content-Type: application/json" \
  -d '{
    "requests": [{
      "image": {"content": "BASE64_IMAGE_DATA"},
      "features": [{"type": "TEXT_DETECTION"}]
    }]
  }'
```

## Next Steps

1. Integrate the API key into your AI verification service
2. Update `backend/src/services/aiVerifier.js` to use real Google Vision API
3. Configure API key restrictions in Google Cloud Console
4. Remove the key from HTML file for production deployment
5. Use backend proxy to make API calls securely

---

**Location of files updated:**
- ✅ `backend/.env` (actual key)
- ✅ `backend/.env.example` (placeholder)
- ✅ `backend/src/config/index.js` (exports API_KEY)
- ✅ `frontend/.env` (actual key)
- ✅ `frontend/.env.example` (placeholder)
- ✅ `index.html` (embedded for demo)
