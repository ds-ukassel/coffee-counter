# Coffee Counter ☕

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💻 Local Development

### Backend (NestJS)

```bash
cd service

# Install dependencies
pnpm install

# Set environment variables
export COFFEE_API_KEY="your-secret-key"
export COFFEE_PRICE="0.40"

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
