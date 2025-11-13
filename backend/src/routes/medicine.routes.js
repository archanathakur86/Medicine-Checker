// backend/src/routes/medicine.routes.js
// Routes for medicine information hub

const express = require('express');
const { getByName } = require('../controllers/medicine.controller');

const router = express.Router();

router.get('/:name', getByName);

module.exports = router;
