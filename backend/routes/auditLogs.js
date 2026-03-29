import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Create audit log entry
router.post('/', (req, res) => {
  const { action, userId, userName, resourceType, resourceId, details, status } = req.body;

  if (!action || !userId) {
    return res.status(400).json({ error: 'Action and userId are required' });
  }

  const query = `
    INSERT INTO audit_logs (action, userId, userName, resourceType, resourceId, details, status, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `;

  db.run(query, [action, userId, userName, resourceType, resourceId, JSON.stringify(details || {}), status || 'success'], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ id: this.lastID, message: 'Audit log created' });
  });
});

// Get all audit logs
router.get('/', (req, res) => {
  const { userId, action, resourceType, dateFrom, dateTo, limit = 100 } = req.query;

  let query = 'SELECT * FROM audit_logs WHERE 1=1';
  const params = [];

  if (userId) {
    query += ' AND userId = ?';
    params.push(userId);
  }

  if (action) {
    query += ' AND action = ?';
    params.push(action);
  }

  if (resourceType) {
    query += ' AND resourceType = ?';
    params.push(resourceType);
  }

  if (dateFrom) {
    query += ' AND timestamp >= ?';
    params.push(dateFrom);
  }

  if (dateTo) {
    query += ' AND timestamp <= ?';
    params.push(dateTo);
  }

  query += ' ORDER BY timestamp DESC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Parse JSON fields
    const logs = rows.map(log => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : {}
    }));

    res.json(logs);
  });
});

// Get audit log statistics
router.get('/stats/overview', (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as totalLogs,
      COUNT(DISTINCT userId) as uniqueUsers,
      COUNT(DISTINCT action) as uniqueActions,
      COUNT(DISTINCT resourceType) as uniqueResources,
      SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as successCount,
      SUM(CASE WHEN status = 'error' THEN 1 ELSE 0 END) as errorCount
    FROM audit_logs
  `;

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row || {});
  });
});

// Get audit logs for specific user
router.get('/user/:userId', (req, res) => {
  const { userId } = req.params;
  const { limit = 50 } = req.query;

  const query = `
    SELECT * FROM audit_logs 
    WHERE userId = ? 
    ORDER BY timestamp DESC 
    LIMIT ?
  `;

  db.all(query, [userId, parseInt(limit)], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const logs = rows.map(log => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : {}
    }));

    res.json(logs);
  });
});

// Get audit logs for specific resource
router.get('/resource/:resourceType/:resourceId', (req, res) => {
  const { resourceType, resourceId } = req.params;
  const { limit = 50 } = req.query;

  const query = `
    SELECT * FROM audit_logs 
    WHERE resourceType = ? AND resourceId = ?
    ORDER BY timestamp DESC 
    LIMIT ?
  `;

  db.all(query, [resourceType, resourceId, parseInt(limit)], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const logs = rows.map(log => ({
      ...log,
      details: log.details ? JSON.parse(log.details) : {}
    }));

    res.json(logs);
  });
});

// Delete old audit logs (older than 30 days)
router.delete('/cleanup', (req, res) => {
  const query = `
    DELETE FROM audit_logs 
    WHERE timestamp < datetime('now', '-30 days')
  `;

  db.run(query, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: `Deleted ${this.changes} audit logs older than 30 days` });
  });
});

export default router;
