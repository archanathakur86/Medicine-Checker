// backend/src/routes/verify.routes.js
// Routes for AI authenticity verification

const express = require('express');
const { verify } = require('../controllers/verify.controller');
const { upload } = require('../middleware/upload.middleware');
const { MAX_FILES } = require('../config');

const router = express.Router();

// Accept multiple images via field name 'images'
router.post('/', upload.array('images', MAX_FILES), verify);

module.exports = router;
