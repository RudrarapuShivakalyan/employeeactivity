import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const safeParseJSON = (value, fallback = []) => {
  if (value == null || value === '') return fallback;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeUserRecord = (user) => {
  if (!user) return user;
  return {
    ...user,
    benefits: safeParseJSON(user.benefits, []),
    certifications: safeParseJSON(user.certifications, []),
    previousEmployers: safeParseJSON(user.previousEmployers, []),
    skills: safeParseJSON(user.skills, []),
    permissions: safeParseJSON(user.permissions, []),
  };
};

const router = express.Router();

// Get all employees
router.get('/', (req, res) => {
  const { department, status, search } = req.query;

  let query = 'SELECT * FROM users WHERE role = "employee"';
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

  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ? OR employeeId LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  if (conditions.length > 0) {
    query += ' AND ' + conditions.join(' AND ');
  }

  query += ' ORDER BY name';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows.map(normalizeUserRecord));
  });
});

// Get employee by name
router.get('/by-name/:name', (req, res) => {
  const { name } = req.params;

  db.get('SELECT * FROM users WHERE name = ? AND role = "employee"', [name], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(normalizeUserRecord(row));
  });
});

// Update employee by name (for profile edits)
router.put('/update-by-name/:name', (req, res) => {
  const { name } = req.params;
  const updateData = {
    ...req.body,
    lastUpdated: new Date().toISOString()
  };

  // Remove fields that shouldn't be updated
  delete updateData.id;
  delete updateData.role;
  delete updateData.createdDate;
  delete updateData.employeeId;

  const columns = Object.keys(updateData);
  const setClause = columns.map(col => `${col} = ?`).join(', ');
  const values = columns.map(col => {
    if (Array.isArray(updateData[col]) || typeof updateData[col] === 'object') {
      return JSON.stringify(updateData[col]);
    }
    return updateData[col];
  });
  values.push(name);

  const query = `UPDATE users SET ${setClause} WHERE name = ? AND role = "employee"`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.get('SELECT * FROM users WHERE name = ?', [name], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});


// Get employee by employeeId
router.get('/by-employee-id/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  db.get('SELECT * FROM users WHERE employeeId = ? AND role = "employee"', [employeeId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(normalizeUserRecord(row));
  });
});

// Create new employee
router.post('/', [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('department').notEmpty().withMessage('Department is required'),
  body('jobTitle').notEmpty().withMessage('Job title is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const employeeData = {
    ...req.body,
    role: 'employee',
    createdDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };

  const columns = Object.keys(employeeData);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map(col => {
    if (Array.isArray(employeeData[col])) {
      return JSON.stringify(employeeData[col]);
    }
    return employeeData[col];
  });

  const query = `INSERT INTO users (${columns.join(', ')}) VALUES (${placeholders})`;

  db.run(query, values, function(err) {
    if (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: 'Employee ID or email already exists' });
      }
      return res.status(500).json({ error: err.message });
    }

    db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(normalizeUserRecord(row));
    });
  });
});

// Update employee
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updateData = {
    ...req.body,
    lastUpdated: new Date().toISOString()
  };

  // Remove id and role from update data
  delete updateData.id;
  delete updateData.role;
  delete updateData.createdDate;

  const columns = Object.keys(updateData);
  const setClause = columns.map(col => `${col} = ?`).join(', ');
  const values = columns.map(col => {
    if (Array.isArray(updateData[col])) {
      return JSON.stringify(updateData[col]);
    }
    return updateData[col];
  });
  values.push(id);

  const query = `UPDATE users SET ${setClause} WHERE id = ? AND role = "employee"`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(normalizeUserRecord(row));
    });
  });
});

// Delete employee
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ? AND role = "employee"', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  });
});

// Get employee statistics
router.get('/stats/overview', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as total FROM users WHERE role = "employee"',
    'SELECT COUNT(*) as active FROM users WHERE role = "employee" AND status = "Active"',
    'SELECT department, COUNT(*) as count FROM users WHERE role = "employee" GROUP BY department',
    'SELECT AVG(salary) as avgSalary FROM users WHERE role = "employee" AND salary IS NOT NULL'
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  })).then(results => {
    const [totalResult, activeResult, departmentResult, salaryResult] = results;

    res.json({
      total: totalResult[0].total,
      active: activeResult[0].active,
      byDepartment: departmentResult,
      averageSalary: salaryResult[0].avgSalary
    });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

// Create new activity
router.post('/activities', [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('description').notEmpty().withMessage('Activity description is required'),
  body('date').notEmpty().withMessage('Activity date is required'),
  body('hoursWorked').isNumeric().withMessage('Hours worked must be numeric')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { employeeId, description, date, hoursWorked, projectName, projectPhase, projectDeadline } = req.body;

  // Insert into activities table
  const query = `
    INSERT INTO activities (employeeId, description, startTime, duration, status, createdAt)
    VALUES (?, ?, ?, ?, 'pending', datetime('now'))
  `;

  db.run(query, [employeeId, description, date, hoursWorked], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Return created activity
    db.get('SELECT * FROM activities WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(row);
    });
  });
});

// Get all activities (with filters)
router.get('/activities', (req, res) => {
  const { employeeId, status, department } = req.query;

  let query = `
    SELECT a.*, u.name as employeeName, u.department 
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

  query += ' ORDER BY a.createdAt DESC LIMIT 100';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Get single activity
router.get('/activities/:id', (req, res) => {
  const { id } = req.params;

  db.get(`
    SELECT a.*, u.name as employeeName, u.department 
    FROM activities a
    JOIN users u ON a.employeeId = u.employeeId
    WHERE a.id = ?
  `, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(row);
  });
});

// Approve activity
router.put('/activities/:id/approve', [
  body('remarks').optional()
], (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;
  const approvedBy = req.user?.id || 'admin'; // From JWT token

  const query = `
    UPDATE activities 
    SET status = 'approved', approvedBy = ?, approvedAt = datetime('now'), remarks = ?
    WHERE id = ?
  `;

  db.run(query, [approvedBy, remarks || '', id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    db.get('SELECT * FROM activities WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Activity approved', activity: row });
    });
  });
});

// Reject activity
router.put('/activities/:id/reject', [
  body('remarks').optional()
], (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;
  const rejectedBy = req.user?.id || 'admin';

  const query = `
    UPDATE activities 
    SET status = 'rejected', approvedBy = ?, approvedAt = datetime('now'), remarks = ?
    WHERE id = ?
  `;

  db.run(query, [rejectedBy, remarks || '', id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    db.get('SELECT * FROM activities WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Activity rejected', activity: row });
    });
  });
});

// Get all activities from all employees (fallback for dashboard)
router.get('/activities-dashboard', (req, res) => {
  try {
    const employeesPath = dirname(__dirname) + '/data/employees.json';
    const data = fs.readFileSync(employeesPath, 'utf-8');
    const employees = JSON.parse(data);
    
    // Extract all activities
    const allActivities = [];
    let activityId = 1;
    
    employees.forEach(emp => {
      if (emp.activityHistory && Array.isArray(emp.activityHistory)) {
        emp.activityHistory.forEach(activity => {
          allActivities.push({
            id: activityId++,
            employeeName: emp.name,
            employeeId: emp.employeeId,
            department: emp.department,
            ...activity
          });
        });
      }
    });
    
    res.json(allActivities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;