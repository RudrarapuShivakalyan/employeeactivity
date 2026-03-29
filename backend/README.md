# Employee Management System - Backend

A Node.js backend API for the Employee Activity Management System using Express.js and SQLite.

## Features

- **User Management**: CRUD operations for employees, managers, and admins
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Database**: SQLite database with proper schema and relationships
- **API Endpoints**: RESTful API endpoints for all operations
- **Data Migration**: Automatic migration from existing JSON files
- **Validation**: Input validation using express-validator

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database and migrate existing data:
   ```bash
   npm run init-db
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (admin only)
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/verify` - Verify JWT token

### Employees
- `GET /api/employees` - Get all employees (with optional filters)
- `GET /api/employees/:id` - Get employee by ID
- `GET /api/employees/by-employee-id/:employeeId` - Get employee by employee ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/stats/overview` - Get employee statistics

### Managers
- `GET /api/managers` - Get all managers
- `GET /api/managers/:id` - Get manager by ID
- `GET /api/managers/by-employee-id/:employeeId` - Get manager by employee ID
- `POST /api/managers` - Create new manager
- `PUT /api/managers/:id` - Update manager
- `DELETE /api/managers/:id` - Delete manager
- `GET /api/managers/:id/employees` - Get employees under a manager

### Admins
- `GET /api/admins` - Get all admins
- `GET /api/admins/:id` - Get admin by ID
- `GET /api/admins/by-employee-id/:employeeId` - Get admin by employee ID
- `POST /api/admins` - Create new admin
- `PUT /api/admins/:id` - Update admin
- `DELETE /api/admins/:id` - Delete admin
- `GET /api/admins/stats/system` - Get system statistics

## Database Schema

### Users Table
- `id` - Primary key
- `employeeId` - Unique employee identifier
- `name` - Full name
- `email` - Email address (unique)
- `password` - Hashed password
- `jobTitle` - Job title
- `department` - Department
- `role` - Role (employee/manager/admin)
- `joiningDate` - Date of joining
- `salary` - Salary amount
- `yearsOfExperience` - Years of experience
- `status` - Employment status
- `createdDate` - Record creation date
- `lastUpdated` - Last update date
- Additional fields for personal information, benefits, etc.

### Activities Table
- `id` - Primary key
- `employeeId` - Foreign key to users
- `activityType` - Type of activity
- `description` - Activity description
- `startTime` - Activity start time
- `endTime` - Activity end time
- `duration` - Duration in minutes
- `status` - Activity status (pending/approved/rejected)
- `approvedBy` - Foreign key to users (approver)
- `approvedAt` - Approval timestamp
- `createdAt` - Record creation date

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## Data Migration

The system automatically migrates data from the existing JSON files (`employees.json`, `managers.json`, `admins.json`) to the SQLite database when you run `npm run init-db`.

## Development

- Use `npm run dev` for development with nodemon
- Use `npm start` for production
- The database file `employee_management.db` is created in the `data/` directory

## Security Notes

- Change the JWT secret in production
- Passwords are hashed using bcrypt
- Input validation is implemented for all endpoints
- CORS is enabled for cross-origin requests

## License

This project is part of the Employee Activity Management System.