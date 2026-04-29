const express = require('express');
const { seedDatabase, getSeedStatus, clearDatabase } = require('../Controller/adminController');

const router = express.Router();

// Seed database from JSON
router.post('/seed', seedDatabase);

// Get seed/database status
router.get('/seed-status', getSeedStatus);

// Clear database (requires admin key)
router.delete('/clear-database', clearDatabase);

module.exports = router;
