const express = require('express');
const notificationController = require('../controllers/notificationController');

const router = express.Router();

/**
 * @swagger
 * /api/notifications/health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Service health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 service:
 *                   type: string
 *                   example: Notification Service
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Notification Service',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/notifications/stats:
 *   get:
 *     summary: Get notification statistics
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Notification statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationStats'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/stats', notificationController.getNotificationStats);

module.exports = router; 