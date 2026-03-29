import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.js';

const router = express.Router();

// Get all admins
router.get('/', (req, res) => {
  const { department, status, search } = req.query;

  let query = 'SELECT * FROM users WHERE role = "admin"';
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
    res.json(rows);
  });
});

// Get admin by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM users WHERE id = ? AND role = "admin"', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(row);
  });
});

// Get admin by employeeId
router.get('/by-employee-id/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  db.get('SELECT * FROM users WHERE employeeId = ? AND role = "admin"', [employeeId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.json(row);
  });
});

// Create new admin
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

  const adminData = {
    ...req.body,
    role: 'admin',
    createdDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };

  const columns = Object.keys(adminData);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map(col => {
    if (Array.isArray(adminData[col])) {
      return JSON.stringify(adminData[col]);
    }
    return adminData[col];
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
      res.status(201).json(row);
    });
  });
});

// Update admin
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

  const query = `UPDATE users SET ${setClause} WHERE id = ? AND role = "admin"`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// Delete admin
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ? AND role = "admin"', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ message: 'Admin deleted successfully' });
  });
});

// Get system statistics (admin only)
router.get('/stats/system', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as totalUsers FROM users',
    'SELECT role, COUNT(*) as count FROM users GROUP BY role',
    'SELECT department, COUNT(*) as count FROM users GROUP BY department',
    'SELECT status, COUNT(*) as count FROM users GROUP BY status',
    'SELECT COUNT(*) as totalActivities FROM activities',
    'SELECT status, COUNT(*) as count FROM activities GROUP BY status'
  ];

  Promise.all(queries.map(query => {
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  })).then(results => {
    const [totalUsers, roleStats, deptStats, statusStats, totalActivities, activityStats] = results;

    res.json({
      totalUsers: totalUsers[0].totalUsers,
      byRole: roleStats,
      byDepartment: deptStats,
      byStatus: statusStats,
      totalActivities: totalActivities[0].totalActivities,
      activitiesByStatus: activityStats
    });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

export default router;