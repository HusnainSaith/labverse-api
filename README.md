# LabVerse API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

LabVerse API is a comprehensive project management and CRM system built with NestJS and TypeScript. It provides a complete backend solution for managing projects, employees, clients, tasks, time tracking, billing, and communication.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- User registration, login, logout, password reset
- Protected routes and middleware

### 👥 User & Employee Management
- User CRUD operations with role management
- Employee profiles with skills management
- Employee-skill associations
- Search and filter employees by skills

### 📊 Project Management
- Project CRUD operations
- Project member assignments with roles
- Project milestones and updates
- Task management with comments
- Time tracking and reporting
- Technology stack management

### 💰 Financial Operations
- Service and development plan management
- Quotation generation and tracking
- Invoice creation and management
- Payment tracking and history

### 💬 Communication & Support
- Real-time messaging system
- Support ticket management
- Client approval workflows
- WebSocket integration for real-time updates

### 📈 CRM & Marketing
- Client management and notes
- Lead tracking and interactions
- Contact inquiry handling
- Blog posts and Q&A management
- Case studies and testimonials
- Content categorization

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Real-time**: WebSockets

## Installation

```bash
# Install dependencies
$ npm install

# Set up environment variables
$ cp .env.example .env
# Edit .env with your database credentials
```

## Database Setup

```bash
# Run migrations
$ npm run migration:run

# Seed initial data (optional)
$ npm run seed
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs

## Database Migrations

```bash
# Generate new migration
$ npm run migration:generate -- MigrationName

# Run migrations
$ npm run migration:run

# Revert last migration
$ npm run migration:revert
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Project Structure

```
src/
├── common/           # Shared utilities, guards, filters
├── config/           # Configuration files
├── modules/          # Feature modules
│   ├── auth/         # Authentication & authorization
│   ├── users/        # User management
│   ├── roles/        # Role & permission management
│   ├── hr/           # Employee & skills management
│   ├── project-management/  # Projects, tasks, time tracking
│   ├── billing/      # Invoices, payments
│   ├── crm/          # Client management, leads
│   ├── content/      # Blog, Q&A, case studies
│   ├── messaging/    # Real-time communication
│   └── support-tickets/  # Support system
├── migrations/       # Database migrations
└── seeds/           # Database seeders
```

## Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=labverse

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d

# Application
PORT=3000
FRONTEND_URL=http://localhost:3001

# Logging
TYPEORM_LOGGING=false
```

## Development Milestones

### ✅ Milestone 1: Core System Setup & User Management
- Database setup with PostgreSQL
- NestJS project structure
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- User registration, login, logout
- Basic error handling and logging

### ✅ Milestone 2: Employee & Basic Project Management
- Employee profiles and skills management
- Project creation and team assignment
- Technology management
- Employee-skill associations

### ✅ Milestone 3: Client Dashboard & Project Progress Tracking
- Project milestones and updates
- Client-specific data access
- Project progress tracking

### ✅ Milestone 4: Task Management & Time Tracking
- Task CRUD operations with comments
- Time entry logging
- Task assignment and status tracking

### ✅ Milestone 5: Financial Operations & Quotations
- Services and development plans
- Quotation generation and management
- Invoice and payment tracking

### ✅ Milestone 6: Communication & Support Systems
- Real-time messaging with WebSockets
- Support ticket system
- Client approval workflows

### ✅ Milestone 7: CRM, Marketing & Content Management
- Client notes and interactions
- Lead management
- Blog posts and Q&A system
- Case studies and testimonials
- Contact inquiry handling

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - User logout

### Users & Roles
- `GET /users` - Get all users
- `POST /users` - Create user
- `GET /roles` - Get all roles
- `POST /roles` - Create role

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create task
- `PUT /tasks/:id` - Update task
- `POST /tasks/:id/comments` - Add task comment

### Time Tracking
- `GET /time-entries` - Get time entries
- `POST /time-entries` - Log time entry

### Billing
- `GET /invoices` - Get invoices
- `POST /invoices` - Create invoice
- `GET /payments` - Get payments
- `POST /payments` - Record payment

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team

### Backend Team
- **Hamza Iftikhar** - Backend Developer
- **Husnain Ramzan** - Backend Developer  
- **Umer Shehzad** - Backend Developer

### Frontend Team
- **Minahil Zahra** - Frontend Developer
- **Maida Butt** - UI/UX Developer
- **Zimal Ahmad** - Frontend Developer (Redux)
- **Samreen** - Frontend Developer
- **Fawad Ahmad** - QA & Code Quality

## License

This project is [MIT licensed](LICENSE).