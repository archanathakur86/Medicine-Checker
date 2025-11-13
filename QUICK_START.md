# 🚀 PharmaTrust - Quick Start Guide

## Option 1: Easy One-Command Startup (Recommended)

Just run this single command from the `medicine` directory:

```bash
./start-app.sh
```

This will:
- ✅ Check and install dependencies
- ✅ Start backend on port 5001
- ✅ Start frontend on port 5174 (or 5173)
- ✅ Show you the access URLs
- ✅ Display live logs

### To Stop Everything:
```bash
./stop-servers.sh
```

---

## Option 2: Manual Startup (Step by Step)

If you prefer to run servers in separate terminals:

### Terminal 1 - Backend:
```bash
cd /home/navgurukul/medicine/backend
PORT=5001 node src/server.js
```

You should see:
```
PharmaTrust API server running on http://localhost:5001
```

### Terminal 2 - Frontend:
```bash
cd /home/navgurukul/medicine/frontend
npm run dev
```

You should see:
```
VITE v5.4.21  ready in 693 ms
➜  Local:   http://localhost:5174/
```

---

## 🌐 Access the Application

Once both servers are running:

1. **Open your browser**: http://localhost:5174
2. **Try the Search tab**: Search for "paracetamol" or "insulin"
3. **Click**: "💰 Find Lowest Price" button
4. **Compare**: Prices from 5 pharmacies!

---

## 🧪 Test the API Directly

### Single Medicine Price:
```bash
curl http://localhost:5001/api/price/insulin | jq '.'
```

### Best Deal:
```bash
curl http://localhost:5001/api/price/best-deal/gabapentin | jq '.'
```

### Bulk Comparison:
```bash
curl -X POST http://localhost:5001/api/price/compare-multiple \
  -H "Content-Type: application/json" \
  -d '{"medicines":["paracetamol","ibuprofen","aspirin"]}' | jq '.'
```

---

## 📊 Available Features

### Backend (Port 5001)
- ✅ Medicine verification with AI
- ✅ Medicine search
- ✅ User authentication
- ✅ Medicine cabinet
- ✅ Drug interaction checker
- ✅ **Price comparison (NEW!)**

### Frontend (Port 5174)
- ✅ Scan medicines
- ✅ Search medicines
- ✅ **Find Lowest Price button**
- ✅ Price comparison table
- ✅ Best deal highlighting

---

## 🆘 Troubleshooting

### Port Already in Use?
```bash
# Kill process on port 5001
fuser -k 5001/tcp

# Kill process on port 5174
fuser -k 5174/tcp
```

### Backend Not Starting?
```bash
cd backend
npm install
PORT=5001 node src/server.js
```

### Frontend Not Starting?
```bash
cd frontend
npm install
npm run dev
```

### Dependencies Missing?
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd frontend && npm install
```

---

## 📁 Project Structure

```
medicine/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── server.js    # Main server file
│   │   ├── controllers/ # API handlers
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic (including price comparison)
│   │   └── models/      # Database models
│   └── package.json
├── frontend/            # React + Vite UI
│   ├── src/
│   │   ├── components/  # React components (including PriceComparison)
│   │   └── styles/      # CSS files
│   └── package.json
├── start-app.sh         # One-command startup
├── stop-servers.sh      # Stop all servers
└── README.md            # This file
```

---

## 🎯 What's Next?

After starting the servers:

1. **Test the price comparison feature** - Search for any medicine and click "Find Lowest Price"
2. **Try different medicines** - We have 17 medicines in the database
3. **Check mobile view** - Resize browser to see responsive design
4. **Test API endpoints** - Use the curl commands above

---

## 💡 Pro Tips

- **View logs**: `tail -f backend.log` and `tail -f frontend.log`
- **Restart servers**: Run `./stop-servers.sh` then `./start-app.sh`
- **Backend only**: `cd backend && PORT=5001 node src/server.js`
- **Frontend only**: `cd frontend && npm run dev`

---

## 🎉 Features Ready to Test

- [x] Price comparison for 17 medicines
- [x] 5 pharmacy integrations
- [x] Best deal finder
- [x] Bulk comparison
- [x] Savings calculator
- [x] Stock status
- [x] Pharmacy ratings
- [x] Direct purchase links
- [x] Mobile responsive

---

**Enjoy using PharmaTrust! 💊💰**
