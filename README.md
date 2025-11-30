# Coffee Counter ☕

A full-stack web application for tracking coffee consumption in a shared environment. Built with NestJS (backend) and Angular (frontend), this application gamifies coffee tracking with achievements, user statistics, and purchase management.

## 🌟 Features

- **Coffee Tracking**: Log coffee consumption with timestamps
- **User Management**: Create and manage multiple users
- **Achievements System**: Unlock achievements based on coffee habits (e.g., "Night Owl" for late-night coffee, "Early Bird" for morning coffee)
- **Statistics & Analytics**: Visualize coffee consumption patterns with charts and diagrams
- **Purchase Tracking**: Record coffee purchases and manage balances
- **Auto-logging**: Quick coffee logging via cookies/shortcuts
- **RESTful API**: Full-featured API with Swagger documentation
- **Responsive UI**: Modern Angular-based interface with Bootstrap

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended for quick start)
- **Node.js** 18+ and **pnpm** 9.15+ (for local development)
- **MongoDB** 8+ (if running without Docker)

## 🚀 Quick Start with Docker Compose

The easiest way to run the application:

```bash
# Clone the repository
git clone https://github.com/ds-ukassel/coffee-counter.git
cd coffee-counter

# Start all services (MongoDB, backend, frontend)
docker-compose up -d

# Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:3000
# Swagger API Docs: http://localhost:3000/api
```

### Environment Configuration

Edit `docker-compose.yaml` to customize:
- `COFFEE_PRICE`: Price per coffee (default: 0.4)
- `COFFEE_API_KEY`: Secret key for API authentication (change this!)
- `MONGO_URI`: MongoDB connection string

## 💻 Local Development

### Backend (NestJS)

```bash
cd service

# Install dependencies
pnpm install

# Set environment variables
export MONGO_URI="mongodb://127.0.0.1:27017/coffee-counter"
export COFFEE_API_KEY="your-secret-key"
export COFFEE_PRICE="0.4"

# Development mode with hot-reload
pnpm start:dev

# Run tests
pnpm test

# Lint code
pnpm lint
```

The backend will be available at `http://localhost:3000` with Swagger documentation at `http://localhost:3000/api`.

### Frontend (Angular)

```bash
cd frontend

# Install dependencies
pnpm install

# Start development server
pnpm start

# Access at http://localhost:46307

# Run tests
pnpm test

# Build for production
pnpm build
```

## 🏗️ Architecture

### Backend Structure
- **NestJS Framework**: Modern Node.js framework with TypeScript
- **MongoDB**: Document database with Mongoose ODM
- **Modules**:
  - `coffee`: Coffee logging and statistics
  - `user`: User management and profiles
  - `purchase`: Purchase tracking
  - `achievement`: Achievement system with event-driven unlocking
- **API Documentation**: Auto-generated Swagger/OpenAPI docs

### Frontend Structure
- **Angular 20**: Modern TypeScript-based SPA framework
- **Bootstrap 5**: Responsive UI components
- **Chart.js**: Data visualization for statistics
- **Modules**:
  - `home`: Main dashboard with quick coffee logging
  - `user`: User management and detail views
  - `settings`: Configuration and preferences
  - `autolog`: Automated logging features

## 🐳 Docker Images

Multi-architecture images are available for both AMD64 and ARM64:

- Backend: `registry.uni-kassel.dev/coffee-counter/backend:latest`
- Frontend: `registry.uni-kassel.dev/coffee-counter/frontend:latest`

## ☸️ Kubernetes Deployment

Deploy to Kubernetes using the provided Helm chart:

```bash
cd helm

# Install the chart
helm install coffee-counter .

# Or with custom values
helm install coffee-counter . -f custom-values.yaml
```

The Helm chart includes:
- MongoDB deployment with persistent storage
- Backend deployment and service
- Frontend deployment and service
- Ingress configuration
- Automated MongoDB backups

## 📚 API Documentation

Once the backend is running, access the interactive API documentation:

- Swagger UI: `http://localhost:3000/api`

### Main API Endpoints

- `GET /coffees` - List all coffee logs
- `POST /coffees` - Create a new coffee log
- `GET /users` - List all users
- `POST /users` - Create a new user
- `GET /users/:userId/achievements` - Get user achievements
- `GET /purchases` - List purchases
- `POST /purchases` - Record a purchase

## 🔒 Security

- API key authentication via `COFFEE_API_KEY` environment variable
- Input validation using class-validator
- CORS configuration for production deployments

**Important**: Change the default API key in production!

## 🛠️ Development Tools

### Package Manager
This project uses **pnpm** (version 9.15.2+). The package manager is enforced via the `packageManager` field in `package.json`.

### Code Quality
- **ESLint**: Linting for TypeScript code
- **Prettier**: Code formatting
- **Jest**: Testing framework (backend)
- **Karma/Jasmine**: Testing framework (frontend)

## 📝 License

This project is licensed under UNLICENSED - see the service/package.json for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

- Organization: [ds-ukassel](https://github.com/ds-ukassel)
- Repository: [coffee-counter](https://github.com/ds-ukassel/coffee-counter)

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Frontend powered by [Angular](https://angular.io/)
- UI components from [Bootstrap](https://getbootstrap.com/) and [ng-bootstrap](https://ng-bootstrap.github.io/)
