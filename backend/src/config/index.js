// backend/src/config/index.js
// Centralized configuration and constants

require('dotenv').config();

const parseNumber = (v, d) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

const MAX_FILES = parseNumber(process.env.MAX_FILES, 5);
const MAX_FILE_SIZE_MB = parseNumber(process.env.MAX_FILE_SIZE_MB, 5);
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const CORS_ORIGIN = process.env.CORS_ORIGIN || '';
const PORT = parseNumber(process.env.PORT, 5000);
const API_KEY = process.env.API_KEY || '';

module.exports = {
  PORT,
  CORS_ORIGIN,
  MAX_FILES,
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  API_KEY,
};
