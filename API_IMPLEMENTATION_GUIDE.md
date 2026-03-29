# API Documentation & Implementation Guide

## 🔧 Fixes Applied to Project

### 1. ✅ Fixed Context File Typo
**Issue**: Filename typo `EmpolyeeContext.jsx` → `EmployeeContext.jsx`
**Fixed Files**:
- `src/context/EmployeeContext.jsx` (created new file with correct name)
- Updated imports in:
  - `src/main.jsx`
  - `src/Pages/Dashboard.jsx`
  - `src/Pages/EmployeeManagement.jsx`
  - `src/Pages/EmployeeProfileSearch.jsx`

### 2. ✅ Added Vite Proxy Configuration
**Issue**: Frontend couldn't communicate with backend API
**Solution**: Added proxy configuration in `vite.config.js`
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
},
```

### 3. ✅ Created Environment Configuration
**Files Created**:
- `.env` - Frontend environment variables
- `.env.example` - Example configuration file
**Content**:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. ✅ Created API Service Layer
**File**: `src/services/api.js`
**Features**:
- Centralized API calls with authentication
- Helper functions for auth, employees, managers, admins
- JWT token handling
- Error handling

**Usage Example**:
```javascript
import { employeeAPI } from '@/services/api';

// Get all employees
const employees = await employeeAPI.getAll();

// Get specific employee
const employee = await employeeAPI.getById(1);

// Create new employee
await employeeAPI.create(employeeData);
```

### 5. ✅ Added Backend Authentication Middleware
**File**: `backend/middleware/auth.js`
**Functions**:
- `verifyToken()` - Validates JWT tokens
- `verifyRole()` - Checks user roles

**Implementation**:
```javascript
app.use('/api/employees', verifyToken, employeeRoutes);
app.use('/api/admins', verifyToken, verifyRole(['admin']), adminRoutes);
```

### 6. ✅ Updated Backend Routes with Security
**File**: `backend/server.js`
- Protected routes with JWT authentication
- Role-based access control on admin routes
- Improved error handling

---

## 📚 How to Use Frontend-Backend Integration

### Step 1: Update Frontend Components to Use API

**Old Way (Using localStorage)**:
```javascript
const { employees } = useEmployees();
```

**New Way (Using API)**:
```javascript
import { employeeAPI } from '@/services/api';
import { useState, useEffect } from 'react';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    employeeAPI.getAll()
      .then(data => setEmployees(data))
      .catch(err => console.error(err));
  }, []);

  return (
    // Render employees
  );
}
```

### Step 2: Implement Authentication Flow

**Login**:
```javascript
import { authAPI } from '@/services/api';

const handleLogin = async (email, password) => {
  const { token, user } = await authAPI.login(email, password);
  localStorage.setItem('authToken', token);
  localStorage.setItem('user', JSON.stringify(user));
};
```

**Verify Token**:
```javascript
useEffect(() => {
  authAPI.verify()
    .then(data => setUser(data.user))
    .catch(() => logout());
}, []);
```

---

## 🚀 Running the System

### Terminal 1: Start Backend
```bash
node "c:\Users\SHIVA\OneDrive\Desktop\employee_activity_management_system-main\backend\server.js"
```

### Terminal 2: Start Frontend
```bash
cd c:\Users\SHIVA\OneDrive\Desktop\employee_activity_management_system-main
npm run dev
```

---

## 🔐 Security Implemented

1. **JWT Authentication**: Token-based authentication on all protected routes
2. **Role-Based Access Control**: Admin routes require admin role
3. **Environment Variables**: Sensitive data in .env files
4. **.gitignore**: Prevents accidental commits of sensitive files
5. **Password Hashing**: Passwords hashed with bcryptjs
6. **CORS**: Configured for secure cross-origin requests

---

## 📊 API Endpoints Overview

### Public Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/health` - Health check

### Protected Endpoints (Require Authentication)
- `GET /api/employees` - List employees
- `GET /api/managers` - List managers
- `GET /api/admins` - List admins (admin only)

**Making Authenticated Requests**:
```javascript
const token = localStorage.getItem('authToken');
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

---

## ✨ Remaining Recommendations

1. **Frontend Context Update**: Update `AuthContext` to use backend API
2. **Activity Logging**: Implement activity endpoints in backend
3. **Error Handling**: Add better error messages in UI
4. **Loading States**: Add loading indicators during API calls
5. **Form Validation**: Enhance client-side validation
6. **Testing**: Add unit and integration tests
7. **Deployment**: Prepare for production deployment

---

## 📝 File Structure After Fixes

```
project-root/
├── .env                          # Frontend environment variables
├── .env.example                  # Example configuration
├── .gitignore                    # Git ignore rules
├── vite.config.js               # (Updated with proxy)
├── src/
│   ├── context/
│   │   ├── EmployeeContext.jsx  # (Fixed: typo corrected)
│   │   ├── AuthContext.jsx
│   │   └── ActivityContext.jsx
│   ├── services/
│   │   └── api.js               # (NEW: API service layer)
│   └── ...
├── backend/
│   ├── middleware/
│   │   └── auth.js              # (NEW: Authentication middleware)
│   ├── server.js                # (Updated with middleware)
│   ├── database/
│   │   └── init.js
│   ├── routes/
│   │   ├── employees.js
│   │   ├── managers.js
│   │   ├── admins.js
│   │   └── auth.js
│   └── ...
└── ...
```

---

## 🛠️ Next Steps

1. ✅ Fixes applied to project structure
2. ⏭️ Update frontend pages to use API service
3. ⏭️ Implement proper authentication flow
4. ⏭️ Test all endpoints with backend
5. ⏭️ Deploy to production
