#!/bin/bash

# PharmaTrust - Easy Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting PharmaTrust Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found!"
    echo "Please run this script from the medicine directory"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found!"
    echo "Please run this script from the medicine directory"
    exit 1
fi

echo "📦 Checking dependencies..."

# Check backend dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Check frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo -e "${GREEN}✓${NC} Dependencies ready!"
echo ""

# Kill any existing processes on ports 5001 and 5173/5174
echo "🧹 Cleaning up old processes..."
fuser -k 5001/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
fuser -k 5174/tcp 2>/dev/null || true
sleep 1

echo ""
echo "🔧 Starting Backend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start backend in background
cd backend
PORT=5001 node src/server.js > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5001/api/medicine/paracetamol > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend API running on http://localhost:5001${NC}"
    echo "  Process ID: $BACKEND_PID"
else
    echo -e "${YELLOW}⚠ Backend may still be starting...${NC}"
fi

echo ""
echo "🎨 Starting Frontend Server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Start frontend in background
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 4

echo -e "${GREEN}✓ Frontend UI starting...${NC}"
echo "  Process ID: $FRONTEND_PID"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ PharmaTrust is now running!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}🔗 Access Points:${NC}"
echo "   Backend API:  http://localhost:5001"
echo "   Frontend UI:  http://localhost:5174 (or 5173)"
echo ""
echo -e "${YELLOW}📝 Logs:${NC}"
echo "   Backend log:  tail -f backend.log"
echo "   Frontend log: tail -f frontend.log"
echo ""
echo -e "${YELLOW}🛑 To stop servers:${NC}"
echo "   Run: ./stop-servers.sh"
echo "   Or:  pkill -f 'node.*server.js' && pkill -f 'vite'"
echo ""
echo "Press Ctrl+C to stop this script (servers will keep running)"
echo ""

# Keep script running and show logs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Live logs (Ctrl+C to exit, servers will continue running):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Show live logs from both servers
tail -f backend.log frontend.log
