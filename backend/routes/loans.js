import express from 'express';
import { db } from '../database/init.js';

const router = express.Router();

// Apply for loan
router.post('/apply', (req, res) => {
  const {
    employeeName,
    employeeId,
    department,
    email,
    phone,
    designation,
    salary,
    loanType,
    loanAmount,
    loanReason,
    tenure,
    documents,
    applicationDate,
    status
  } = req.body;

  const query = `
    INSERT INTO loans (
      employeeName, employeeId, department, email, phone, designation, salary,
      loanType, loanAmount, loanReason, tenure, documents, applicationDate, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      employeeName, employeeId, department, email, phone, designation, salary,
      loanType, loanAmount, loanReason, tenure, documents, applicationDate, status
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ 
        id: this.lastID,
        message: 'Loan application submitted successfully'
      });
    }
  );
});

// Get all loans
router.get('/', (req, res) => {
  const { status } = req.query;

  let query = 'SELECT * FROM loans ORDER BY applicationDate DESC';
  const params = [];

  if (status) {
    query = 'SELECT * FROM loans WHERE status = ? ORDER BY applicationDate DESC';
    params.push(status);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

// Get loan by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM loans WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Loan not found' });
    }
    res.json(row);
  });
});

// Approve loan
router.put('/:id/approve', (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;

  const query = 'UPDATE loans SET status = ?, remarks = ?, approvalDate = ? WHERE id = ?';
  const approvalDate = new Date().toISOString();

  db.run(query, ['Approved', remarks || '', approvalDate, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    db.get('SELECT * FROM loans WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// Reject loan
router.put('/:id/reject', (req, res) => {
  const { id } = req.params;
  const { remarks } = req.body;

  const query = 'UPDATE loans SET status = ?, remarks = ?, rejectionDate = ? WHERE id = ?';
  const rejectionDate = new Date().toISOString();

  db.run(query, ['Rejected', remarks || '', rejectionDate, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    db.get('SELECT * FROM loans WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(row);
    });
  });
});

// Get loans by employee
router.get('/employee/:employeeId', (req, res) => {
  const { employeeId } = req.params;

  db.all('SELECT * FROM loans WHERE employeeId = ? ORDER BY applicationDate DESC', [employeeId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows || []);
  });
});

export default router;
