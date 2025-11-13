// backend/src/app.js
// Express application setup for PharmaTrust backend

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// Main router (expects ./routes/index.js to export an Express router)
const apiRouter = require('./routes');

// Error and 404 handlers
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// -----------------------------
// Middleware
// -----------------------------
// Configure CORS using CORS_ORIGIN (supports comma-separated list)
const rawOrigins = process.env.CORS_ORIGIN || '';
const allowedOrigins = rawOrigins
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  // If a list is provided, use it. Otherwise allow all origins.
  origin: allowedOrigins.length ? allowedOrigins : '*',
  // Credentials only when we have explicit origins to avoid '*' with credentials
  credentials: allowedOrigins.length > 0,
};
app.use(cors(corsOptions));

// HTTP request logger
app.use(morgan('dev'));

// Parse JSON bodies
app.use(express.json());

// -----------------------------
// Routes
// -----------------------------
// Mount the API router at /api
app.use('/api', apiRouter);

// -----------------------------
// Error Handlers
// -----------------------------
// 404 for unknown routes
app.use(notFound);

// Centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
