const express = require('express');
const router = express.Router();
const analyticsController = require('../Controller/analyticsController');

router.get('/stats', analyticsController.getAnalytics);

module.exports = router;
