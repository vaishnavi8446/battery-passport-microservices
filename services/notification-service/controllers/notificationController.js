const { 
  sendPassportCreatedNotification, 
  sendPassportUpdatedNotification, 
  sendPassportDeletedNotification 
} = require('../utils/emailService');
const logger = require('../../shared/utils/logger');

const handlePassportCreated = async (data) => {
  try {
    logger.info('Handling passport.created event:', data);
    await sendPassportCreatedNotification(data);
    logger.info('Passport created notification sent successfully');
  } catch (error) {
    logger.error('Failed to handle passport.created event:', error);
  }
};

const handlePassportUpdated = async (data) => {
  try {
    logger.info('Handling passport.updated event:', data);
    await sendPassportUpdatedNotification(data);
    logger.info('Passport updated notification sent successfully');
  } catch (error) {
    logger.error('Failed to handle passport.updated event:', error);
  }
};

const handlePassportDeleted = async (data) => {
  try {
    logger.info('Handling passport.deleted event:', data);
    await sendPassportDeletedNotification(data);
    logger.info('Passport deleted notification sent successfully');
  } catch (error) {
    logger.error('Failed to handle passport.deleted event:', error);
  }
};

const getNotificationStats = async (req, res) => {
  try {
    // In a real system, you would track notification statistics
    res.json({
      service: 'Notification Service',
      status: 'running',
      timestamp: new Date().toISOString(),
      stats: {
        totalNotifications: 0,
        lastNotification: null
      }
    });
  } catch (error) {
    logger.error('Get notification stats error:', error);
    res.status(500).json({
      error: 'Failed to get notification stats',
      message: 'Unable to retrieve notification statistics'
    });
  }
};

module.exports = {
  handlePassportCreated,
  handlePassportUpdated,
  handlePassportDeleted,
  getNotificationStats
}; 