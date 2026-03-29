import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/employee_management.db');
const db = new sqlite3.Database(dbPath);

console.log('Checking database at:', dbPath);

db.all('SELECT COUNT(*) as count FROM users', (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Total users in database:', rows[0].count);
  }

  db.all('SELECT name, department, role FROM users WHERE role="employee" LIMIT 3', (err, rows) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Sample employees:', rows);
    }
    db.close();
  });
});