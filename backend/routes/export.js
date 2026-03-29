import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Export employees to CSV
router.get('/employees-csv', (req, res) => {
  const { department, status } = req.query;
  
  let query = 'SELECT id, employeeId, name, email, department, role, jobTitle, salary, status, joiningDate FROM users WHERE role = "employee"';
  const params = [];
  const conditions = [];

  if (department) {
    conditions.push('department = ?');
    params.push(department);
  }

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    // Create CSV content
    const fields = ['employeeId', 'name', 'email', 'department', 'jobTitle', 'salary', 'status', 'joiningDate'];
    const csv = convertToCSV(rows, fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="employees.csv"');
    res.send(csv);
  });
});

// Export activities to CSV
router.get('/activities-csv', (req, res) => {
  const { employeeId, status, department } = req.query;

  let query = `
    SELECT a.id, a.employeeId, u.name as employeeName, u.department, a.description, 
           a.startTime, a.duration, a.status, a.createdAt
    FROM activities a
    JOIN users u ON a.employeeId = u.employeeId
  `;
  const params = [];
  const conditions = [];

  if (employeeId) {
    conditions.push('a.employeeId = ?');
    params.push(employeeId);
  }

  if (status) {
    conditions.push('a.status = ?');
    params.push(status);
  }

  if (department) {
    conditions.push('u.department = ?');
    params.push(department);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY a.createdAt DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    const fields = ['id', 'employeeId', 'employeeName', 'department', 'description', 'startTime', 'duration', 'status', 'createdAt'];
    const csv = convertToCSV(rows, fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="activities.csv"');
    res.send(csv);
  });
});

// Export loans to CSV
router.get('/loans-csv', (req, res) => {
  const { status, employeeId } = req.query;

  let query = 'SELECT * FROM loans';
  const params = [];
  const conditions = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (employeeId) {
    conditions.push('employeeId = ?');
    params.push(employeeId);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY applicationDate DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(200).json([]);
    }

    const fields = ['employeeId', 'employeeName', 'loanType', 'loanAmount', 'tenure', 'status', 'applicationDate'];
    const csv = convertToCSV(rows, fields);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="loans.csv"');
    res.send(csv);
  });
});

// Helper function to convert JSON to CSV
function convertToCSV(data, fields) {
  if (!data || data.length === 0) return '';

  // Header
  const header = fields.join(',');

  // Rows
  const rows = data.map(row => {
    return fields.map(field => {
      const value = row[field] || '';
      // Handle fields with commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  return [header, ...rows].join('\n');
}

export default router;
