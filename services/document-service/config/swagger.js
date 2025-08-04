const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Document Service API',
      version: '1.0.0',
      description: 'Document management service for uploading, retrieving, and managing files in the battery passport system',
      contact: {
        name: 'Battery Passport Team',
        email: 'support@batterypassport.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3003',
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
        Document: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Document ID'
            },
            docId: {
              type: 'string',
              description: 'Unique document identifier'
            },
            fileName: {
              type: 'string',
              description: 'Document file name'
            },
            originalName: {
              type: 'string',
              description: 'Original file name'
            },
            fileSize: {
              type: 'number',
              description: 'File size in bytes'
            },
            mimeType: {
              type: 'string',
              description: 'File MIME type'
            },
            s3Key: {
              type: 'string',
              description: 'S3 storage key'
            },
            s3Bucket: {
              type: 'string',
              description: 'S3 bucket name'
            },
            uploadedBy: {
              type: 'string',
              description: 'User ID who uploaded the document'
            },
            isActive: {
              type: 'boolean',
              description: 'Document active status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Document creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Document last update timestamp'
            }
          }
        },
        DocumentResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            document: {
              $ref: '#/components/schemas/Document'
            }
          }
        },
        DocumentsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Operation success status'
            },
            documents: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Document'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'number',
                  description: 'Current page number'
                },
                limit: {
                  type: 'number',
                  description: 'Number of items per page'
                },
                total: {
                  type: 'number',
                  description: 'Total number of documents'
                },
                pages: {
                  type: 'number',
                  description: 'Total number of pages'
                }
              }
            }
          }
        },
        DocumentDownloadResponse: {
          type: 'object',
          properties: {
            document: {
              $ref: '#/components/schemas/Document'
            },
            downloadUrl: {
              type: 'string',
              description: 'Presigned URL for downloading the document'
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