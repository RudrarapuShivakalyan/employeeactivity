import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password - support both hashed and plain text (for migration)
    let isValidPassword = false;
    
    if (user.password && user.password.startsWith('$2')) {
      // Hashed password - use bcrypt
      isValidPassword = await bcrypt.compare(password, user.password);
    } else {
      // Plain text password - direct comparison (only for dev/test data)
      isValidPassword = password === user.password;
    }

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        employeeId: user.employeeId,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Remove password from response and normalize JSON fields
    const { password: _, ...userWithoutPassword } = user;
    const userPayload = normalizeUserRecord(userWithoutPassword);

    res.json({
      token,
      user: userPayload
    });
  });
});

// Register new user (admin only)
router.post('/register', [
  body('employeeId').notEmpty().withMessage('Employee ID is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['employee', 'manager', 'admin']).withMessage('Invalid role'),
  body('department').notEmpty().withMessage('Department is required'),
  body('jobTitle').notEmpty().withMessage('Job title is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { password, ...userData } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      ...userData,
      password: hashedPassword,
      status: 'Active',
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    const columns = Object.keys(newUser);
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map(col => {
      if (Array.isArray(newUser[col])) {
        return JSON.stringify(newUser[col]);
      }
      return newUser[col];
    });

    const query = `INSERT INTO users (${columns.join(', ')}) VALUES (${placeholders})`;

    db.run(query, values, function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: 'Employee ID or email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }

      db.get('SELECT id, employeeId, name, email, role, department, jobTitle, status, createdDate FROM users WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json(row);
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Change password
router.post('/change-password', [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // This would typically use middleware to get user from JWT token
  // For now, we'll assume user ID is passed in body
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  db.get('SELECT * FROM users WHERE id = ?', [userId], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValidPassword = user.password
      ? await bcrypt.compare(currentPassword, user.password)
      : currentPassword === 'defaultpassword';

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    db.run('UPDATE users SET password = ?, lastUpdated = ? WHERE id = ?',
      [hashedNewPassword, new Date().toISOString(), userId],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Password changed successfully' });
      }
    );
  });
});

// Verify token (middleware helper)
router.get('/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      db.get('SELECT * FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const userPayload = normalizeUserRecord(user);
      const { password, ...userWithoutPassword } = userPayload;
      res.json({ user: userWithoutPassword });
    });
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;