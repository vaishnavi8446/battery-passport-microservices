const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Notification Service',
    timestamp: new Date().toISOString()
  });
});

// Get notification statistics
router.get('/stats', notificationController.getNotificationStats);

module.exports = router; 