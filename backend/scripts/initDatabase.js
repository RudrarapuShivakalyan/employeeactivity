import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../database/init.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the data folder
const dataPath = path.join(__dirname, '../../data');

const migrateData = async () => {
  try {
    console.log('Starting data migration...');

    // Check if data already exists
    db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
      if (err) {
        console.error('Error checking existing data:', err);
        return;
      }

      if (row.count > 0) {
        console.log('Data already exists in database. Skipping migration.');
        return;
      }

      // Read JSON files
      const employeesPath = path.join(dataPath, 'employees.json');
      const managersPath = path.join(dataPath, 'managers.json');
      const adminsPath = path.join(dataPath, 'admins.json');

      let employees = [];
      let managers = [];
      let admins = [];

      try {
        if (fs.existsSync(employeesPath)) {
          employees = JSON.parse(fs.readFileSync(employeesPath, 'utf8'));
          console.log(`Loaded ${employees.length} employees`);
        }

        if (fs.existsSync(managersPath)) {
          managers = JSON.parse(fs.readFileSync(managersPath, 'utf8'));
          console.log(`Loaded ${managers.length} managers`);
        }

        if (fs.existsSync(adminsPath)) {
          admins = JSON.parse(fs.readFileSync(adminsPath, 'utf8'));
          console.log(`Loaded ${admins.length} admins`);
        }
      } catch (error) {
        console.error('Error reading JSON files:', error);
        return;
      }

      // Insert data into database
      const allUsers = [...employees, ...managers, ...admins];

      let inserted = 0;
      const total = allUsers.length;

      allUsers.forEach((user, index) => {
        // Prepare user data for database
        const userData = {
          employeeId: user.employeeId,
          name: user.name,
          email: user.email,
          jobTitle: user.jobTitle,
          department: user.department,
          role: user.role,
          joiningDate: user.joiningDate,
          salary: user.salary,
          yearsOfExperience: user.yearsOfExperience,
          status: user.status || 'Active',
          createdDate: user.createdDate || new Date().toISOString(),
          lastUpdated: user.lastUpdated || new Date().toISOString(),
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          maritalStatus: user.maritalStatus,
          phone: user.phone,
          emergencyPhone: user.emergencyPhone,
          personalEmail: user.personalEmail,
          address: user.address,
          permanentAddress: user.permanentAddress,
          employmentType: user.employmentType,
          manager: user.manager,
          probationPeriod: user.probationPeriod,
          payFrequency: user.payFrequency,
          benefits: Array.isArray(user.benefits) ? JSON.stringify(user.benefits) : user.benefits,
          taxId: user.taxId,
          bankAccount: user.bankAccount,
          highestQualification: user.highestQualification,
          certifications: Array.isArray(user.certifications) ? JSON.stringify(user.certifications) : user.certifications,
          previousEmployers: Array.isArray(user.previousEmployers) ? JSON.stringify(user.previousEmployers) : user.previousEmployers,
          skills: Array.isArray(user.skills) ? JSON.stringify(user.skills) : user.skills,
          emergencyContactName: user.emergencyContactName,
          emergencyContactRelation: user.emergencyContactRelation,
          accessLevel: user.accessLevel,
          permissions: Array.isArray(user.permissions) ? JSON.stringify(user.permissions) : user.permissions,
          password: null // No password for migrated users
        };

        const columns = Object.keys(userData);
        const placeholders = columns.map(() => '?').join(', ');
        const values = columns.map(col => userData[col]);

        const query = `INSERT OR IGNORE INTO users (${columns.join(', ')}) VALUES (${placeholders})`;

        db.run(query, values, function(err) {
          if (err) {
            console.error(`Error inserting user ${user.employeeId}:`, err);
          } else if (this.changes > 0) {
            inserted++;
          }

          // Check if this is the last user
          if (index === total - 1) {
            console.log(`Migration completed. Inserted ${inserted} users.`);
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err);
              } else {
                console.log('Database connection closed.');
              }
            });
          }
        });
      });
    });
  } catch (error) {
    console.error('Migration failed:', error);
    db.close();
  }
};

// Run migration
migrateData();