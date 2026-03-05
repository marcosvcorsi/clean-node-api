# Clean Node API

[![Build Status](https://travis-ci.com/marcosvcorsi/clean-node-api.svg?branch=master)](https://travis-ci.com/marcosvcorsi/clean-node-api)
[![Coverage Status](https://coveralls.io/repos/github/marcosvcorsi/clean-node-api/badge.svg?branch=master)](https://coveralls.io/github/marcosvcorsi/clean-node-api?branch=master)
[![GitHub stars](https://img.shields.io/github/stars/marcosvcorsi/clean-node-api)](https://github.com/marcosvcorsi/clean-node-api/stargazers)

A production-ready Node.js API built with **Clean Architecture** principles, **Test-Driven Development (TDD)**, and modern best practices.

## 📋 About

This project demonstrates how to build a scalable, maintainable Node.js API following Clean Architecture principles and TDD methodology. It enforces a strict separation of concerns, making the codebase testable, flexible, and easy to understand.

## ✨ Features

- **Clean Architecture**: Clear separation of concerns across layers
- **TDD Methodology**: Test-first development approach
- **MongoDB Integration**: Document-oriented database with TypeORM-like patterns
- **JWT Authentication**: Secure token-based authentication
- **API Documentation**: Swagger/OpenAPI documentation
- **Input Validation**: Request/response validation with class-validator
- **Error Handling**: Centralized error handling and logging
- **Commitlint**: Enforced conventional commits
- **Husky**: Git hooks for code quality
- **Lint-staged**: Pre-commit code quality checks

## 🛠️ Tech Stack

- **Runtime**: Node.js 12.x
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: validator
- **Testing**: Jest, Supertest
- **Documentation**: Swagger UI
- **Code Quality**: ESLint, Prettier, Husky
- **CI/CD**: Travis CI, Coveralls

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/marcosvcorsi/clean-node-api.git
cd clean-node-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

## 🚀 Running the Application

### Development

```bash
# Run in development mode with hot reload
npm run dev

# Run in debug mode
npm run debug
```

### Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Docker (Optional)

```bash
# Build and start with Docker Compose
npm run up

# Stop Docker Compose
npm run down
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in verbose mode
npm run test:verbose

# Run unit tests in watch mode
npm run test:unit

# Run integration tests in watch mode
npm run test:integration

# Run tests in watch mode
npm run test:watch

# Run tests for staged files (git hook)
npm run test:staged

# Run tests with coverage (CI)
npm run test:ci

# Send coverage to Coveralls
npm run test:coveralls
```

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│         Web/Express Layer          │  ← HTTP Controllers
├─────────────────────────────────────┤
│         Use Cases Layer            │  ← Business Logic
├─────────────────────────────────────┤
│      Data Access Layer             │  ← Database/External APIs
└─────────────────────────────────────┘
```

### Directory Structure

```
src/
├── main/
│   └── server.ts              # Application entry point
├── presentation/               # HTTP Controllers & Routes
│   └── controllers/
├── domain/                    # Business Entities & Value Objects
│   ├── entities/
│   └── value-objects/
├── application/               # Use Cases (Business Logic)
│   ├── usecases/
│   └── errors/
├── infrastructure/             # External dependencies
│   ├── database/
│   ├── authentication/
│   └── logging/
└── shared/                    # Shared utilities
    └── helpers/
```

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:5000/api-docs
```

## 🔧 Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URL=mongodb://localhost:27017/clean_node_api

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

## 📝 Code Quality

```bash
# Build the project
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

## 🎯 Principles

This project follows these key principles:

- **Single Responsibility Principle**: Each module has one reason to change
- **Open/Closed Principle**: Open for extension, closed for modification
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Separation of Concerns**: Clear boundaries between layers
- **Test-Driven Development**: Write tests before implementation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Implement the feature (make tests pass)
5. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Marcos Vinicius Corsi**

- GitHub: [@marcosvcorsi](https://github.com/marcosvcorsi)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=marcosvcorsi/clean-node-api&type=Date)](https://star-history.com/#marcosvcorsi/clean-node-api&Date)

## 🙏 Acknowledgments

- Inspired by Clean Architecture principles by Robert C. Martin
- Built with modern Node.js best practices
