// backend/src/server.js
// Server entry point: boots the PharmaTrust API

// Load environment variables from .env if present
require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/database');

// Resolve port from environment with a sane default
const PORT = parseInt(process.env.PORT, 10) || 5000;

// Connect to MongoDB (optional - server works without it)
connectDB()
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection optional - continuing without it:', err.message));

// Start the HTTP server
const server = app.listen(PORT, () => {
  console.log(`PharmaTrust API server running on http://localhost:${PORT}`);
});

// Graceful shutdown helpers
const shutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed. Bye.');
    process.exit(0);
  });

  // Force-exit if not closed in time
  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
