require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../../shared/utils/logger');
const { connectConsumer, subscribeToTopic } = require('../../shared/utils/kafka');
const notificationController = require('./controllers/notificationController');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3004;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Notification Service',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/notifications', notificationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message
  });
});

// Setup Kafka consumers
const setupKafkaConsumers = async () => {
  try {
    await connectConsumer();
    
    // Subscribe to passport events
    await subscribeToTopic('passport.created', notificationController.handlePassportCreated);
    await subscribeToTopic('passport.updated', notificationController.handlePassportUpdated);
    await subscribeToTopic('passport.deleted', notificationController.handlePassportDeleted);
    
    logger.info('Kafka consumers setup completed');
  } catch (error) {
    logger.error('Failed to setup Kafka consumers:', error);
    throw error;
  }
};

// Start server
const startServer = async () => {
  try {
    await setupKafkaConsumers();
    
    app.listen(PORT, () => {
      logger.info(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer(); 