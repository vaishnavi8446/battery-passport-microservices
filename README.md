# Battery Passport Microservices

A comprehensive microservices architecture for managing digital battery passports with authentication, document management, and notification systems.

## Architecture Overview

This system consists of four microservices:

1. **Auth Service** - User authentication and authorization
2. **Battery Passport Service** - CRUD operations for battery passports
3. **Document Service** - File upload and management
4. **Notification Service** - Event-driven notifications

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Message Broker**: Apache Kafka
- **Authentication**: JWT
- **Storage**: AWS S3
- **Testing**: Jest (API test coverage for all microservices)

## Services

### Auth Service (Port: 3001)

- User registration and login
- JWT-based authentication
- Role-based access control (admin, user)
- Middleware for role verification

### Battery Passport Service (Port: 3002)

- CRUD operations for battery passports
- JWT authorization
- Kafka event emission (passport.created, passport.updated, passport.deleted)

### Document Service (Port: 3003)

- File upload to S3-compatible storage
- Document metadata management
- JWT verification

### Notification Service (Port: 3004)

- Kafka event consumption
- Email notifications (mock implementation)

## Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd battery-passport-microservices
   ```

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the services**

   ```bash
   docker-compose up -d
   ```

4. **Access the services**
   - Auth Service: http://localhost:3001
   - Battery Passport Service: http://localhost:3002
   - Document Service: http://localhost:3003
   - Notification Service: http://localhost:3004

## API Documentation

### Auth Service Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Battery Passport Service Endpoints

#### Create Passport (Admin only)

```http
POST /api/passports
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "data": {
    "generalInformation": {
      "batteryIdentifier": "BP-2024-011",
      "batteryModel": {
        "id": "LM3-BAT-2024",
        "modelName": "GMC WZX1"
      },
      "batteryMass": 450,
      "batteryCategory": "EV",
      "batteryStatus": "Original",
      "manufacturingDate": "2024-01-15",
      "manufacturingPlace": "Gigafactory Nevada",
      "warrantyPeriod": "8",
      "manufacturerInformation": {
        "manufacturerName": "Tesla Inc",
        "manufacturerIdentifier": "TESLA-001"
      }
    },
    "materialComposition": {
      "batteryChemistry": "LiFePO4",
      "criticalRawMaterials": ["Lithium", "Iron"],
      "hazardousSubstances": [
        {
          "substanceName": "Lithium Hexafluorophosphate",
          "chemicalFormula": "LiPF6",
          "casNumber": "21324-40-3"
        }
      ]
    },
    "carbonFootprint": {
      "totalCarbonFootprint": 850,
      "measurementUnit": "kg CO2e",
      "methodology": "Life Cycle Assessment (LCA)"
    }
  }
}
```

#### Get Passport

```http
GET /api/passports/:id
Authorization: Bearer <jwt-token>
```

#### Update Passport (Admin only)

```http
PUT /api/passports/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "data": { ... }
}
```

#### Delete Passport (Admin only)

```http
DELETE /api/passports/:id
Authorization: Bearer <jwt-token>
```

### Document Service Endpoints

#### Upload Document

```http
POST /api/documents/upload
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

file: <file>
```

#### Get Document Link

```http
GET /api/documents/:docId
Authorization: Bearer <jwt-token>
```

#### Update Document Metadata

```http
PUT /api/documents/:docId
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "fileName": "updated-name.pdf"
}
```

#### Delete Document

```http
DELETE /api/documents/:docId
Authorization: Bearer <jwt-token>
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run tests for specific service
cd services/auth-service && npm test
cd services/document-service && npm test
cd services/passport-service && npm test
cd services/notification-service && npm test
```

Test files for each service are located in their respective `tests/` directories:

- `services/auth-service/tests/auth.test.js`
- `services/document-service/tests/document.test.js`
- `services/passport-service/tests/passport.test.js`
- `services/notification-service/tests/notification.test.js`

### Local Development

```bash
# Start dependencies only
docker-compose up -d mongodb kafka zookeeper

# Start services in development mode
npm run dev
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/battery-passport

# Kafka
KAFKA_BROKERS=localhost:9092

# JWT
JWT_SECRET=your-secret-key

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name

# Service Ports
AUTH_SERVICE_PORT=3001
PASSPORT_SERVICE_PORT=3002
DOCUMENT_SERVICE_PORT=3003
NOTIFICATION_SERVICE_PORT=3004
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License
