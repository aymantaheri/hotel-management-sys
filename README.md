# Hotel Management System

A comprehensive, intelligent hotel management application built with modern microservices architecture.

## 🏨 Overview

This system provides a complete solution for hotel operations, including room management, reservations, user authentication, and administrative functions. Built using cutting-edge technologies and following industry best practices.

## ✨ Features

### For Customers
- 🔐 User registration and secure authentication
- 🏠 Browse available rooms with detailed information
- 📅 Real-time room availability checking
- 💳 Easy reservation booking with mock payment
- 📋 Manage reservations (view, cancel)
- 📱 Responsive design for all devices

### For Administrators
- 📊 Admin dashboard with system statistics
- 🏠 Complete room management (add, edit, view)
- 📋 Reservation oversight and management
- 👥 User role management
- 📈 System monitoring and analytics

## 🏗️ Architecture

### Microservices
- **Authentication Service** (Port 3001): User management and JWT authentication
- **Room Management Service** (Port 3002): Room inventory and availability
- **Reservation Service** (Port 3003): Booking management and payment processing

### Technology Stack
- **Backend**: NestJS, TypeScript, GraphQL, MongoDB, Redis, Kafka
- **Frontend**: React 18, Tailwind CSS, Apollo Client, Vite
- **DevOps**: Docker, Kubernetes, GitHub Actions
- **Monitoring**: Prometheus, Grafana
- **Testing**: Jest, React Testing Library, k6

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- kubectl (for Kubernetes deployment)

### Local Development with Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd hotel-management-app

# Start all services
docker-compose up -d

# Access the application
# Frontend: http://localhost:80
# Auth Service: http://localhost:3001/graphql
# Room Service: http://localhost:3002/graphql
# Reservation Service: http://localhost:3003/graphql
```

### Local Development Setup

```bash
# Install dependencies for all services
cd backend/auth-service && npm install
cd ../room-service && npm install
cd ../reservation-service && npm install
cd ../../frontend/hotel-frontend-react && npm install

# Start infrastructure services
docker run -d --name mongodb -p 27017:27017 mongo:latest
docker run -d --name redis -p 6379:6379 redis:alpine

# Start backend services (in separate terminals)
cd backend/auth-service && npm run start:dev
cd backend/room-service && npm run start:dev
cd backend/reservation-service && npm run start:dev

# Start frontend
cd frontend/hotel-frontend-react && npm run dev
```

## 🐳 Docker Deployment

### Build Images
```bash
# Build all service images
docker-compose build

# Or build individually
docker build -t hotel-auth ./backend/auth-service
docker build -t hotel-rooms ./backend/room-service
docker build -t hotel-reservations ./backend/reservation-service
docker build -t hotel-frontend ./frontend/hotel-frontend-react
```

### Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☸️ Kubernetes Deployment

### Deploy to Kubernetes
```bash
# Create namespace
kubectl create namespace hotel-management

# Apply secrets
kubectl apply -f k8s/secrets.yaml

# Deploy infrastructure
kubectl apply -f k8s/mongodb.yaml
kubectl apply -f k8s/redis.yaml

# Deploy services
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/room-service.yaml
kubectl apply -f k8s/reservation-service.yaml
kubectl apply -f k8s/frontend.yaml

# Check deployment status
kubectl get pods -n hotel-management
```

## 🧪 Testing

### Run Tests
```bash
# Backend unit tests
cd backend/auth-service && npm test
cd backend/room-service && npm test
cd backend/reservation-service && npm test

# Frontend tests
cd frontend/hotel-frontend-react && npm test

# E2E tests
npm run test:e2e

# Load testing
k6 run load-test.js
```

### Test Coverage
```bash
# Generate coverage report
npm run test:cov
```

## 📊 Monitoring

### Prometheus & Grafana
```bash
# Start monitoring stack
docker-compose up -d prometheus grafana

# Access dashboards
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3000 (admin/admin)
```

### Health Checks
```bash
# Check service health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

## 📚 Documentation

### Available Documentation
- **[API Documentation](docs/api-documentation.md)**: Complete GraphQL API reference
- **[Deployment Guide](docs/deployment-guide.md)**: Detailed deployment instructions
- **[User Manual](docs/user-manual.md)**: End-user guide
- **[Developer Documentation](docs/developer-documentation.md)**: Technical implementation details

### PDF Versions
All documentation is also available in PDF format in the `docs/` directory.

## 🔧 Configuration

### Environment Variables

#### Authentication Service
```env
MONGODB_URI=mongodb://localhost:27017/hotel-auth
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
PORT=3001
```

#### Room Service
```env
MONGODB_URI=mongodb://localhost:27017/hotel-rooms
PORT=3002
```

#### Reservation Service
```env
MONGODB_URI=mongodb://localhost:27017/hotel-reservations
ROOM_SERVICE_URL=http://localhost:3002
PORT=3003
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Kubernetes secrets management

## 📈 Performance

- Redis caching for optimal performance
- Database indexing for fast queries
- GraphQL for efficient data fetching
- Horizontal scaling support
- Load balancing ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation
- Follow commit message conventions

## 📝 API Examples

### Authentication
```graphql
# Register a new user
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    token
    user {
      id
      email
      firstName
      lastName
    }
  }
}

# Login
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      email
      role
    }
  }
}
```

### Room Management
```graphql
# Get available rooms
query GetAvailableRooms {
  availableRooms {
    id
    roomNumber
    roomType
    price
    amenities
    maxGuests
  }
}

# Create a room (Admin only)
mutation CreateRoom($input: CreateRoomInput!) {
  createRoom(input: $input) {
    id
    roomNumber
    roomType
    price
  }
}
```

### Reservations
```graphql
# Create a reservation
mutation CreateReservation($input: CreateReservationInput!) {
  createReservation(input: $input) {
    id
    checkInDate
    checkOutDate
    totalPrice
    status
  }
}

# Get user reservations
query GetUserReservations($userId: String!) {
  userReservations(userId: $userId) {
    id
    roomId
    checkInDate
    checkOutDate
    status
    totalPrice
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### Services won't start
```bash
# Check logs
docker-compose logs <service-name>

# Check ports
netstat -tulpn | grep :3001
```

#### Database connection issues
```bash
# Test MongoDB connection
docker exec -it hotel-mongodb mongo

# Check network connectivity
docker network ls
```

#### Frontend not loading
```bash
# Check if backend services are running
curl http://localhost:3001/graphql
curl http://localhost:3002/graphql
curl http://localhost:3003/graphql
```


---

**Ayman Taheri**
**Loubna bikri**
**taha neffai**
