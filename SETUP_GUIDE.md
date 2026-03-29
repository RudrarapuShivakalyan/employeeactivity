## 🚀 Employee Activity Management System - Setup & Startup Guide

### Prerequisites
- Node.js (v16+)
- npm or yarn
- SQLite3

### Installation Steps

#### 1️⃣ Install Frontend Dependencies
```bash
npm install
```

#### 2️⃣ Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

---

## 🏃 Running the Application

### ✅ RECOMMENDED: Run Both Frontend & Backend Together

```bash
npm run dev
```

This command will:
- 🔵 Start the **Frontend** on `http://localhost:5173`
- 🔴 Start the **Backend API** on `http://localhost:5000`
- 💾 **Auto-seed** the database with sample employee data
- 📊 Display structured console output showing all activity

**Expected Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Database initialized successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 BACKEND SERVER RUNNING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 API URL: http://localhost:5000
💾 Database: SQLite (data/employee_management.db)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VITE v7.2.5 building for production...
...
➜  Local:   http://localhost:5173
```

### ⚙️ Run Separately (if needed)

**Backend Only:**
```bash
cd backend
npm run dev
```

**Frontend Only:**
```bash
npm run dev:frontend
```

---

## 🔐 Login Credentials

The system auto-loads sample data. You can login with any of these employees:

**Employees (Role: employee):**
- Name: John Doe, Department: IT
- Name: Jane Smith, Department: HR
- Name: Mike Johnson, Department: Sales

**Managers (Role: manager):**
- Name: Robert Brown, Department: IT
- Name: Sarah Williams, Department: HR

**Admins (Role: admin):**
- Name: Admin User, Department: Admin

**Default Password:** Leave as default

---

## 🌐 Public API Endpoints (No Authentication Required)

- `GET /api/health` - Health check
- `GET /api/employees/csv` - Get all employees
- `GET /api/employees/by-name/:name` - Get employee by name
- `GET /api/employees/id/:id` - Get employee by ID
- `GET /api/employees/activities` - Get all activities
- `GET /api/loans` - Get all loan applications
- `POST /api/loans/apply` - Apply for a loan

---

## 📊 Database

- **Type:** SQLite
- **Location:** `data/employee_management.db`
- **Auto-seeded with:** Employees, Managers, Admins, Loans data

### Re-seed Database (if needed)
```bash
npm run init-db
```

---

## 🛠️ Troubleshooting

### ❌ "No token provided" Error
**Solution:** Ensure you're logged in first. This error should not appear on the login page.

### ❌ Backend not connecting
**Solution:** 
1. Check if port 5000 is available
2. Verify backend is running: `curl http://localhost:5000/api/health`

### ❌ Frontend not loading
**Solution:**
1. Check if port 5173 is available  
2. Clear browser cache and try again

### ❌ Database locked error
**Solution:** Kill any existing backend processes and restart

---

## 📁 Project Structure

```
employee_activity_management_system/
├── src/                      # Frontend React code
│   ├── Pages/               # React components for each page
│   ├── context/             # React context (Auth, Employee, Activity)
│   ├── services/            # API service functions
│   └── App.jsx
├── backend/                 # Backend Express server
│   ├── routes/              # API route handlers
│   ├── middleware/          # Authentication middleware
│   ├── database/            # Database initialization
│   └── server.js
├── data/                    # Sample data files
│   ├── employees.json
│   ├── managers.json
│   ├── admins.json
│   └── employee_management.db
└── package.json
```

---

## 🎯 Features

✅ **Employee Management**
- View employee profile
- Manage personal information
- Track work activities

✅ **Activity Tracking**
- Log work activities
- Track project hours
- Manager approval workflow

✅ **Loan Management**
- Apply for loans
- Admin approval system
- Loan status tracking

✅ **Role-Based Access**
- Employee Dashboard
- Manager Dashboard
- Admin Dashboard

---

Made with ❤️ for Employee Activity Management
