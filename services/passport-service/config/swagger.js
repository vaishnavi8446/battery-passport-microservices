const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Passport Service API',
      version: '1.0.0',
      description: 'Battery passport management service for creating, updating, and retrieving battery passports',
      contact: {
        name: 'Battery Passport Team',
        email: 'support@batterypassport.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002',
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
        BatteryPassport: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Passport ID'
            },
            data: {
              type: 'object',
              properties: {
                generalInformation: {
                  type: 'object',
                  properties: {
                    batteryIdentifier: {
                      type: 'string',
                      description: 'Unique battery identifier'
                    },
                    batteryModel: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        modelName: { type: 'string' }
                      }
                    },
                    batteryMass: {
                      type: 'number',
                      description: 'Battery mass in kg'
                    },
                    batteryCategory: {
                      type: 'string',
                      enum: ['EV', 'HEV', 'PHEV', 'BEV'],
                      description: 'Battery category'
                    },
                    batteryStatus: {
                      type: 'string',
                      enum: ['Original', 'Reconditioned', 'Reused'],
                      description: 'Battery status'
                    },
                    manufacturingDate: {
                      type: 'string',
                      format: 'date',
                      description: 'Manufacturing date'
                    },
                    manufacturingPlace: {
                      type: 'string',
                      description: 'Manufacturing location'
                    },
                    warrantyPeriod: {
                      type: 'string',
                      description: 'Warranty period in years'
                    },
                    manufacturerInformation: {
                      type: 'object',
                      properties: {
                        manufacturerName: { type: 'string' },
                        manufacturerIdentifier: { type: 'string' }
                      }
                    }
                  }
                },
                materialComposition: {
                  type: 'object',
                  properties: {
                    batteryChemistry: {
                      type: 'string',
                      description: 'Battery chemistry type'
                    },
                    criticalRawMaterials: {
                      type: 'array',
                      items: { type: 'string' },
                      description: 'List of critical raw materials'
                    },
                    hazardousSubstances: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          substanceName: { type: 'string' },
                          chemicalFormula: { type: 'string' },
                          casNumber: { type: 'string' }
                        }
                      }
                    }
                  }
                },
                carbonFootprint: {
                  type: 'object',
                  properties: {
                    totalCarbonFootprint: {
                      type: 'number',
                      description: 'Total carbon footprint value'
                    },
                    measurementUnit: {
                      type: 'string',
                      description: 'Measurement unit for carbon footprint'
                    },
                    methodology: {
                      type: 'string',
                      description: 'Methodology used for calculation'
                    }
                  }
                }
              }
            },
            createdBy: {
              type: 'string',
              description: 'User ID who created the passport'
            },
            updatedBy: {
              type: 'string',
              description: 'User ID who last updated the passport'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the passport is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        CreatePassportRequest: {
          type: 'object',
          required: ['data'],
          properties: {
            data: {
              $ref: '#/components/schemas/BatteryPassport/properties/data'
            }
          }
        },
        UpdatePassportRequest: {
          type: 'object',
          properties: {
            data: {
              $ref: '#/components/schemas/BatteryPassport/properties/data'
            }
          }
        },
        PassportResponse: {
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
            passport: {
              $ref: '#/components/schemas/BatteryPassport'
            }
          }
        },
        PassportsResponse: {
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
            passports: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/BatteryPassport'
              }
            },
            total: {
              type: 'number',
              description: 'Total number of passports'
            },
            page: {
              type: 'number',
              description: 'Current page number'
            },
            limit: {
              type: 'number',
              description: 'Number of items per page'
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