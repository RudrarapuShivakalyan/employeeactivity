import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../database/init.js';

const router = express.Router();

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

// Get all managers
router.get('/', (req, res) => {
  const { department, status, search } = req.query;

  let query = 'SELECT * FROM users WHERE role = "manager"';
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

// Get manager by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM users WHERE id = ? AND role = "manager"', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.json(normalizeUserRecord(row));
  });
});

// Get manager by employeeId
router.get('/by-employee-id/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  db.get('SELECT * FROM users WHERE employeeId = ? AND role = "manager"', [employeeId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Manager not found' });
    }
    res.json(normalizeUserRecord(row));
  });
});

// Create new manager
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

  const managerData = {
    ...req.body,
    role: 'manager',
    createdDate: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };

  const columns = Object.keys(managerData);
  const placeholders = columns.map(() => '?').join(', ');
  const values = columns.map(col => {
    if (Array.isArray(managerData[col])) {
      return JSON.stringify(managerData[col]);
    }
    return managerData[col];
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

// Update manager
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

  const query = `UPDATE users SET ${setClause} WHERE id = ? AND role = "manager"`;

  db.run(query, values, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// Delete manager
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ? AND role = "manager"', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    res.json({ message: 'Manager deleted successfully' });
  });
});

// Get employees under a manager
router.get('/:id/employees', (req, res) => {
  const { id } = req.params;

  // First get the manager's name
  db.get('SELECT name FROM users WHERE id = ? AND role = "manager"', [id], (err, manager) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!manager) {
      return res.status(404).json({ error: 'Manager not found' });
    }

    // Get employees who report to this manager
    db.all('SELECT * FROM users WHERE role = "employee" AND manager = ?', [manager.name], (err, employees) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(employees.map(normalizeUserRecord));
    });
  });
});

export default router;