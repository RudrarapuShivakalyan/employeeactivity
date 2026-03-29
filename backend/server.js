import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase, db } from './database/init.js';
import { verifyToken, verifyRole } from './middleware/auth.js';
import employeeRoutes from './routes/employees.js';
import managerRoutes from './routes/managers.js';
import adminRoutes from './routes/admins.js';
import authRoutes from './routes/auth.js';
import loanRoutes from './routes/loans.js';
import exportRoutes from './routes/export.js';
import auditLogRoutes from './routes/auditLogs.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database
initializeDatabase().then(() => {
  console.log('\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Database initialized successfully');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Routes
  app.use('/api/auth', authRoutes);
  
  // ✅ PROTECTED CSV ENDPOINT - Requires admin role
  app.get('/api/employees/csv', verifyToken, verifyRole(['admin']), (req, res) => {
    console.log('📥 GET /api/employees/csv');
    db.all('SELECT id, employeeId, name, email, department, role, status, joiningDate, salary FROM users ORDER BY name', (err, rows) => {
      if (err) {
        console.error('❌ Error fetching users:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log(`✅ Returned ${rows.length} users (employees, managers, admins)`);
      res.json(rows);
    });
  });

  // ✅ PUBLIC BY-NAME ENDPOINT FOR LOGIN (NO AUTH REQUIRED)
  app.get('/api/employees/by-name/:name', (req, res) => {
    const { name } = req.params;
    console.log(`📥 GET /api/employees/by-name/${name}`);
    db.get('SELECT id, employeeId, name, email, department, role, status, joiningDate, salary, phone, jobTitle, yearsOfExperience, dateOfBirth, gender, address, emergencyContactName, emergencyContact FROM users WHERE name = ? AND role = "employee"', [name], (err, row) => {
      if (err) {
        console.error('❌ Error fetching employee:', err.message);
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        console.warn(`⚠️ Employee not found: ${name}`);
        return res.status(404).json({ error: 'Employee not found' });
      }
      console.log(`✅ Employee found: ${row.name}`);
      res.json(row);
    });
  });

  // ✅ PUBLIC BY-ID ENDPOINT (NO AUTH REQUIRED)
  app.get('/api/employees/id/:id', (req, res) => {
    const { id } = req.params;
    console.log(`📥 GET /api/employees/id/${id}`);
    db.get('SELECT id, employeeId, name, email, department, role, status, joiningDate, salary, phone, jobTitle, yearsOfExperience, dateOfBirth, gender, address, emergencyContactName, emergencyContact FROM users WHERE employeeId = ?', [id], (err, row) => {
      if (err) {
        console.error('❌ Error fetching employee:', err.message);
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        console.warn(`⚠️ Employee not found: ${id}`);
        return res.status(404).json({ error: 'Employee not found' });
      }
      console.log(`✅ Employee found: ${row.name}`);
      res.json(row);
    });
  });

  // ✅ PUBLIC ACTIVITIES ENDPOINT (NO AUTH REQUIRED), supports employeeId/fromDate/toDate filters
  app.get('/api/employees/activities', (req, res) => {
    const { employeeId, fromDate, toDate } = req.query;
    console.log(`📥 GET /api/employees/activities?employeeId=${employeeId || ''}&fromDate=${fromDate || ''}&toDate=${toDate || ''}`);

    let query = `
      SELECT a.*, u.name AS employeeName, u.department
      FROM activities a
      LEFT JOIN users u ON a.employeeId = u.employeeId
    `;
    const params = [];
    const filters = [];

    if (employeeId) {
      filters.push('a.employeeId = ?');
      params.push(employeeId);
    }

    if (fromDate) {
      filters.push("date(a.createdAt) >= date(?)");
      params.push(fromDate);
    }

    if (toDate) {
      filters.push("date(a.createdAt) <= date(?)");
      params.push(toDate);
    }

    // Default 5 months window for dashboard showcase if no explicit range
    if (!fromDate && !toDate) {
      filters.push("date(a.createdAt) >= date('now', '-5 months')");
    }

    if (filters.length > 0) {
      query += ' WHERE ' + filters.join(' AND ');
    }

    query += ' ORDER BY a.createdAt DESC LIMIT 500';

    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('❌ Error fetching activities:', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log(`✅ Returned ${rows.length} activities`);
      res.json(rows);
    });
  });

  // Protected routes - require authentication
  app.use('/api/employees', verifyToken, employeeRoutes);
  app.use('/api/managers', verifyToken, managerRoutes);
  app.use('/api/admins', verifyToken, verifyRole(['admin']), adminRoutes);
  app.use('/api/loans', verifyToken, loanRoutes);
  app.use('/api/export', verifyToken, exportRoutes);
  app.use('/api/audit-logs', verifyToken, verifyRole(['admin']), auditLogRoutes);
  app.use('/api/notifications', verifyToken, notificationRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    console.log('📥 GET /api/health');
    res.json({ status: 'OK', message: 'Employee Management API is running', timestamp: new Date().toISOString() });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('❌ ERROR:', err.stack);
    void next;
    res.status(500).json({ error: 'Something went wrong!' });
  });

  // 404 handler
  app.use('*', (req, res) => {
    console.warn(`⚠️ 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Route not found' });
  });

  app.listen(PORT, () => {
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🚀 BACKEND SERVER RUNNING`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`💾 Database: SQLite (data/employee_management.db)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  });
}).catch((err) => {
  console.error('❌ Failed to initialize database:', err);
  process.exit(1);
});