import express from 'express';
import { db } from '../database/init.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Create notification
router.post('/', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('type').isIn(['activity', 'loan', 'approval', 'alert', 'info']).withMessage('Invalid notification type'),
  body('message').notEmpty().withMessage('Message is required'),
  body('resourceType').optional(),
  body('resourceId').optional()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, type, message, resourceType, resourceId, actionUrl } = req.body;

  const query = `
    INSERT INTO notifications (userId, type, message, resourceType, resourceId, actionUrl, isRead, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'))
  `;

  db.run(query, [userId, type, message, resourceType || null, resourceId || null, actionUrl || null], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({ id: this.lastID, message: 'Notification created' });
  });
});

// Get notifications for current user
router.get('/', (req, res) => {
  const userId = req.query.userId || req.user?.id;
  const { unreadOnly = false, limit = 50 } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  let query = 'SELECT * FROM notifications WHERE userId = ?';
  const params = [userId];

  if (unreadOnly === 'true') {
    query += ' AND isRead = 0';
  }

  query += ' ORDER BY createdAt DESC LIMIT ?';
  params.push(parseInt(limit));

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows || []);
  });
});

// Get unread notification count
router.get('/unread/count', (req, res) => {
  const userId = req.query.userId || req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = 'SELECT COUNT(*) as unreadCount FROM notifications WHERE userId = ? AND isRead = 0';

  db.get(query, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ unreadCount: row?.unreadCount || 0 });
  });
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  const { id } = req.params;

  const query = 'UPDATE notifications SET isRead = 1, readAt = datetime("now") WHERE id = ?';

  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read' });
  });
});

// Mark all notifications as read for user
router.put('/user/read-all', (req, res) => {
  const userId = req.body.userId || req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = 'UPDATE notifications SET isRead = 1, readAt = datetime("now") WHERE userId = ? AND isRead = 0';

  db.run(query, [userId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: `Marked ${this.changes} notifications as read` });
  });
});

// Delete notification
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM notifications WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  });
});

// Delete old notifications (older than 30 days)
router.delete('/cleanup/old', (req, res) => {
  const query = `
    DELETE FROM notifications 
    WHERE createdAt < datetime('now', '-30 days')
  `;

  db.run(query, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: `Deleted ${this.changes} old notifications` });
  });
});

// Get notification statistics
router.get('/stats/overview', (req, res) => {
  const userId = req.query.userId || req.user?.id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const query = `
    SELECT 
      COUNT(*) as totalNotifications,
      SUM(CASE WHEN isRead = 0 THEN 1 ELSE 0 END) as unreadCount,
      SUM(CASE WHEN type = 'activity' THEN 1 ELSE 0 END) as activityNotifications,
      SUM(CASE WHEN type = 'loan' THEN 1 ELSE 0 END) as loanNotifications,
      SUM(CASE WHEN type = 'approval' THEN 1 ELSE 0 END) as approvalNotifications
    FROM notifications 
    WHERE userId = ?
  `;

  db.get(query, [userId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(row || {});
  });
});

export default router;
