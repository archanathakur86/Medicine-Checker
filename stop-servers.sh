#!/bin/bash

# PharmaTrust - Stop All Servers Script

echo "🛑 Stopping PharmaTrust servers..."

# Kill backend server
pkill -f "node.*server.js" && echo "✓ Backend stopped" || echo "⚠ Backend not running"

# Kill frontend server
pkill -f "vite" && echo "✓ Frontend stopped" || echo "⚠ Frontend not running"

# Clean up ports
fuser -k 5001/tcp 2>/dev/null || true
fuser -k 5173/tcp 2>/dev/null || true
fuser -k 5174/tcp 2>/dev/null || true

echo ""
echo "✅ All servers stopped!"
