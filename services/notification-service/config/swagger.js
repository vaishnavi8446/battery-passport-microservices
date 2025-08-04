const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notification Service API',
      version: '1.0.0',
      description: 'Notification service for handling email notifications and event-driven messaging in the battery passport system',
      contact: {
        name: 'Battery Passport Team',
        email: 'support@batterypassport.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3004',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        NotificationStats: {
          type: 'object',
          properties: {
            service: {
              type: 'string',
              description: 'Service name'
            },
            status: {
              type: 'string',
              description: 'Service status'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Current timestamp'
            },
            stats: {
              type: 'object',
              properties: {
                totalNotifications: {
                  type: 'number',
                  description: 'Total number of notifications sent'
                },
                lastNotification: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Timestamp of last notification sent'
                }
              }
            }
          }
        },
        NotificationEvent: {
          type: 'object',
          properties: {
            passportId: {
              type: 'string',
              description: 'Battery passport ID'
            },
            batteryIdentifier: {
              type: 'string',
              description: 'Battery identifier'
            },
            createdBy: {
              type: 'string',
              description: 'User ID who created the passport'
            },
            updatedBy: {
              type: 'string',
              description: 'User ID who updated the passport'
            },
            deletedBy: {
              type: 'string',
              description: 'User ID who deleted the passport'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Event timestamp'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './controllers/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 