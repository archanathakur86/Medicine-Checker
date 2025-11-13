// backend/src/routes/index.js
// Aggregates and mounts feature routers

const express = require('express');
const verifyRoutes = require('./verify.routes');
const medicineRoutes = require('./medicine.routes');
const authRoutes = require('./auth.routes');
const cabinetRoutes = require('./cabinet.routes');
const priceRoutes = require('./price.routes');

const router = express.Router();

router.use('/verify', verifyRoutes);
router.use('/medicine', medicineRoutes);
router.use('/auth', authRoutes);
router.use('/cabinet', cabinetRoutes);
router.use('/price', priceRoutes);

module.exports = router;
