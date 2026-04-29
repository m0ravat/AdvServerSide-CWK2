const express = require('express');
const { seedDatabase, getSeedStatus, clearDatabase } = require('../Controller/adminController');

const router = express.Router();

// Seed database from JSON
router.post('/seed', seedDatabase);




module.exports = router;