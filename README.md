# Coffee Counter ☕

A full-stack web application for tracking coffee consumption in a shared environment:
coffee tracking with achievements, user statistics, and purchase management.
Built with NestJS (backend) and Angular (frontend).

## 🌟 Features

- **Coffee Tracking**: Log coffee consumption with timestamps
- **User Management**: Create and manage multiple users
- **Achievements**: Unlock achievements based on coffee habits (e.g., "Night Owl" for late-night coffee, "Early Bird" for morning coffee)
- **Statistics & Analytics**: Visualize coffee consumption patterns with charts and diagrams
- **Purchase Tracking**: Record coffee purchases and manage balances
- **Auto-logging**: Quick coffee logging via cookies/shortcuts
- **RESTful API**: Full-featured API with Swagger documentation
- **Responsive UI**: Modern Angular-based interface with Bootstrap

## 📋 Prerequisites

- **Docker & Docker Compose** (recommended for quick start)
- **Node.js** 24+ and **pnpm** 11+ (for local development)
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
- `COFFEE_PRICE`: Price per coffee (default: 0.40)
- `COFFEE_API_KEY`: Secret key for API authentication (change this!)

Other backend environment variables: see [environment.ts](service/src/environment.ts)

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
- Integration with an existing MongoDB instance (MongoDB must be deployed separately; connection details are provided via secrets)
- Backend deployment and service
- Frontend deployment and service
- Ingress configuration
- Automated MongoDB backups

## 📚 API Documentation

Once the backend is running, access the interactive API documentation: http://localhost:3000/api

## 🔒 Security

- API key authentication via `COFFEE_API_KEY` environment variable (header `X-Coffee-Api-Key`)
- Input validation using class-validator
- CORS configuration for production deployments

**Important**: Change the default API key in production!

## 🛠️ Development Tools

### Frameworks

- Backend built with [NestJS](https://nestjs.com/)
- Frontend powered by [Angular](https://angular.io/)
- UI components from [Bootstrap](https://getbootstrap.com/) and [ng-bootstrap](https://ng-bootstrap.github.io/)

### NodeJS
Frontend and backend require NodeJS 24+.

### Package Manager
This project uses **pnpm** (version 11+).
The package manager is enforced via the `packageManager` field in `package.json`.

### Code Quality
- **ESLint**: Linting for TypeScript code
- **Prettier**: Code formatting
- **Jest**: Testing framework (backend)

## 📝 License

[MIT](LICENSE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
