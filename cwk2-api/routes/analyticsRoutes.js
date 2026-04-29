const express = require('express');
const router = express.Router();
const analyticsController = require('../Controller/analyticsController');
const { requirePermission } = require('../Middleware/authMiddleware');

// Analytics routes require read:analytics permission
// Both alumni and non-alumni have this permission
router.get('/stats', requirePermission('read:analytics'), analyticsController.getAnalytics);

module.exports = router;
