import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../../data/employee_management.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

export const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    // Create users table (base table for all user types)
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employeeId TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        jobTitle TEXT,
        department TEXT,
        role TEXT NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
        joiningDate DATE,
        salary REAL,
        yearsOfExperience INTEGER,
        status TEXT DEFAULT 'Active',
        createdDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
        dateOfBirth DATE,
        gender TEXT,
        maritalStatus TEXT,
        phone TEXT,
        emergencyPhone TEXT,
        personalEmail TEXT,
        address TEXT,
        permanentAddress TEXT,
        employmentType TEXT,
        manager TEXT,
        probationPeriod INTEGER,
        payFrequency TEXT,
        benefits TEXT, -- JSON string
        taxId TEXT,
        bankAccount TEXT,
        highestQualification TEXT,
        certifications TEXT, -- JSON string
        previousEmployers TEXT, -- JSON string
        skills TEXT, -- JSON string
        emergencyContactName TEXT,
        emergencyContactRelation TEXT,
        accessLevel TEXT,
        permissions TEXT -- JSON string
      )
    `, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        reject(err);
        return;
      }
      console.log('Users table created or already exists');

      // Create activities table
      db.run(`
        CREATE TABLE IF NOT EXISTS activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          employeeId TEXT NOT NULL,
          activityType TEXT NOT NULL,
          description TEXT,          projectName TEXT,          startTime DATETIME,
          endTime DATETIME,
          duration INTEGER, -- in minutes
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
          approvedBy TEXT,
          approvedAt DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (employeeId) REFERENCES users(employeeId),
          FOREIGN KEY (approvedBy) REFERENCES users(employeeId)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating activities table:', err.message);
          reject(err);
          return;
        }
        console.log('Activities table created or already exists');

        // Create indexes for better performance
        db.run('CREATE INDEX IF NOT EXISTS idx_users_employeeId ON users(employeeId)');
        db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
        db.run('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
        db.run('CREATE INDEX IF NOT EXISTS idx_users_department ON users(department)');
        db.run('CREATE INDEX IF NOT EXISTS idx_activities_employeeId ON activities(employeeId)');
        db.run('CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status)');

        // Create loans table
        db.run(`
          CREATE TABLE IF NOT EXISTS loans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employeeName TEXT NOT NULL,
            employeeId TEXT NOT NULL,
            department TEXT,
            email TEXT,
            phone TEXT,
            designation TEXT,
            salary REAL,
            loanType TEXT NOT NULL,
            loanAmount REAL NOT NULL,
            loanReason TEXT,
            tenure INTEGER,
            documents TEXT,
            applicationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
            remarks TEXT,
            approvalDate DATETIME,
            rejectionDate DATETIME
          )
        `, (err) => {
          if (err) {
            console.error('Error creating loans table:', err.message);
            reject(err);
            return;
          }
          console.log('Loans table created or already exists');

          // Create audit logs table
          db.run(`
            CREATE TABLE IF NOT EXISTS audit_logs (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              action TEXT NOT NULL,
              userId TEXT NOT NULL,
              userName TEXT,
              resourceType TEXT,
              resourceId TEXT,
              details TEXT, -- JSON string
              status TEXT DEFAULT 'success' CHECK (status IN ('success', 'error', 'warning')),
              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
          `, (err) => {
            if (err) {
              console.error('Error creating audit_logs table:', err.message);
              reject(err);
              return;
            }
            console.log('Audit logs table created or already exists');

            // Create notifications table
            db.run(`
              CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                type TEXT NOT NULL CHECK (type IN ('activity', 'loan', 'approval', 'alert', 'info')),
                message TEXT NOT NULL,
                resourceType TEXT,
                resourceId TEXT,
                actionUrl TEXT,
                isRead INTEGER DEFAULT 0,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                readAt DATETIME
              )
            `, (err) => {
              if (err) {
                console.error('Error creating notifications table:', err.message);
                reject(err);
                return;
              }
              console.log('Notifications table created or already exists');

              // Create index for loans and audit logs and notifications
              db.run('CREATE INDEX IF NOT EXISTS idx_loans_employeeId ON loans(employeeId)');
              db.run('CREATE INDEX IF NOT EXISTS idx_loans_status ON loans(status)');
              db.run('CREATE INDEX IF NOT EXISTS idx_audit_logs_userId ON audit_logs(userId)');
              db.run('CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp)');
              db.run('CREATE INDEX IF NOT EXISTS idx_notifications_userId ON notifications(userId)');
              db.run('CREATE INDEX IF NOT EXISTS idx_notifications_isRead ON notifications(isRead)', (err) => {
                if (err) {
                  console.error('Error creating indexes:', err.message);
                  reject(err);
                  return;
                }
                console.log('Database indexes created');
                
                // ✅ SEED DATA IF EMPTY
                seedDatabaseIfEmpty().then(() => resolve()).catch(reject);
              });  // close indexes callback
            });  // close notifications callback
          });  // close audit_logs callback
        });  // close loans callback
      });  // close activities callback
    });  // close users table callback
  });  // close Promise
};

// ✅ Seed activities for 5 months of showcase for each employee
const seedActivitiesForUsers = (users) => {
  return new Promise((resolve, reject) => {
    const employees = users.filter((u) => u.role === 'employee');
    if (employees.length === 0) {
      resolve();
      return;
    }

    const activityTypes = ['Development', 'Testing', 'Code Review', 'Client Meeting', 'Documentation', 'Deployment', 'Bug Fixing'];
    const statusOptions = ['pending', 'approved', 'rejected'];
    const projectNames = ['E-Commerce Platform', 'Mobile App Redesign', 'Data Analytics Dashboard', 'CRM System Upgrade', 'API Gateway', 'Security Audit Tool', 'Employee Portal'];

    const managerIdByName = new Map(users.filter((u) => u.role === 'manager').map((m) => [m.name, m.employeeId]));

    const activitiesToInsert = [];
    const now = new Date();

    employees.forEach((user) => {
      const managerEmployeeId = managerIdByName.get(user.manager) || null;

      for (let month = 5; month > 0; month--) {
        for (let i = 1; i <= 3; i++) {
          const activityDate = new Date(now);
          activityDate.setMonth(activityDate.getMonth() - month);
          activityDate.setDate(3 + (i * 7));

          const startTime = new Date(activityDate);
          startTime.setHours(9 + i, 0, 0);

          const endTime = new Date(startTime);
          endTime.setHours(startTime.getHours() + 2 + (i % 2));

          const status = statusOptions[(month + i) % statusOptions.length];
          const approvedBy = status === 'approved' ? managerEmployeeId : null;
          const projectName = projectNames[(month + i) % projectNames.length];

          activitiesToInsert.push({
            employeeId: user.employeeId,
            activityType: activityTypes[(month + i) % activityTypes.length],
            description: `${activityTypes[(month + i) % activityTypes.length]} work for ${user.name}`,
            projectName,
            startTime: activityDate.toISOString(),
            endTime: endTime.toISOString(),
            duration: Math.round((endTime - startTime) / 60000),
            status,
            approvedBy,
            approvedAt: approvedBy ? new Date(activityDate).toISOString() : null,
            createdAt: activityDate.toISOString(),
          });
        }
      }
    });

    if (activitiesToInsert.length === 0) {
      resolve();
      return;
    }

    let insertedActivities = 0;

    activitiesToInsert.forEach((a) => {
      db.run(
        `INSERT INTO activities (employeeId, activityType, description, projectName, startTime, endTime, duration, status, approvedBy, approvedAt, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [a.employeeId, a.activityType, a.description, a.projectName, a.startTime, a.endTime, a.duration, a.status, a.approvedBy, a.approvedAt, a.createdAt],
        (err) => {
          if (err) {
            console.warn(`⚠️ Activity insert error for ${a.employeeId}: ${err.message}`);
          }
          insertedActivities++;
          if (insertedActivities === activitiesToInsert.length) {
            console.log(`✅ Seeded ${insertedActivities} activity records for 5-month showcase`);
            resolve();
          }
        }
      );
    });
  });
};

// ✅ SEED DATA FUNCTION
const seedDatabaseIfEmpty = async () => {
  return new Promise((resolve, reject) => {
    // Always delete all existing data and reseed
    db.run('DELETE FROM activities', (err1) => {
      if (err1) console.warn('Warning deleting activities:', err1.message);
      
      db.run('DELETE FROM loans', (err2) => {
        if (err2) console.warn('Warning deleting loans:', err2.message);
        
        db.run('DELETE FROM users', (err3) => {
          if (err3) console.warn('Warning deleting users:', err3.message);
          
          console.log('📥 Seeding database with fresh sample data...');
          
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          const dataPath = path.join(__dirname, '../../data');

          let employees = [];
          let managers = [];
          let admins = [];

          try {
            const employeesFile = path.join(dataPath, 'employees.json');
            const managersFile = path.join(dataPath, 'managers.json');
            const adminsFile = path.join(dataPath, 'admins.json');

            if (fs.existsSync(employeesFile)) {
              employees = JSON.parse(fs.readFileSync(employeesFile, 'utf8'));
              console.log(`  📄 Loaded ${employees.length} employees`);
            }

            if (fs.existsSync(managersFile)) {
              managers = JSON.parse(fs.readFileSync(managersFile, 'utf8'));
              console.log(`  📄 Loaded ${managers.length} managers`);
            }

            if (fs.existsSync(adminsFile)) {
              admins = JSON.parse(fs.readFileSync(adminsFile, 'utf8'));
              console.log(`  📄 Loaded ${admins.length} admins`);
            }
          } catch (error) {
            console.warn('⚠️ Could not read seed data files:', error.message);
            resolve();
            return;
          }

          const allUsers = [...employees, ...managers, ...admins];
          let inserted = 0;

          if (allUsers.length === 0) {
            console.log('⚠️ No seed data found');
            resolve();
            return;
          }

          allUsers.forEach((user) => {
            const userData = [
              user.employeeId || '',
              user.name || '',
              user.email || '',
              user.password || null,
              user.jobTitle || '',
              user.department || '',
              user.role || 'employee',
              user.joiningDate || new Date().toISOString().split('T')[0],
              user.salary || 0,
              user.yearsOfExperience || 0,
              user.status || 'Active',
              new Date().toISOString(),
              new Date().toISOString(),
              user.dateOfBirth || null,
              user.gender || null,
              user.maritalStatus || null,
              user.phone || null,
              user.emergencyPhone || null,
              user.personalEmail || null,
              user.address || null,
              user.permanentAddress || null,
              user.employmentType || 'Full-time',
              user.manager || null,
              user.probationPeriod || 3,
              user.payFrequency || 'Monthly',
              user.benefits ? JSON.stringify(user.benefits) : null,
              user.taxId || null,
              user.bankAccount || null,
              user.highestQualification || null,
              user.certifications ? JSON.stringify(user.certifications) : null,
              user.previousEmployers ? JSON.stringify(user.previousEmployers) : null,
              user.skills ? JSON.stringify(user.skills) : null,
              user.emergencyContactName || null,
              user.emergencyContactRelation || null,
              user.accessLevel || 'Employee',
              user.permissions ? JSON.stringify(user.permissions) : JSON.stringify(['basic_access'])
            ];

            db.run(
              `INSERT INTO users (
                employeeId, name, email, password, jobTitle, department, role, joiningDate,
                salary, yearsOfExperience, status, createdDate, lastUpdated, dateOfBirth,
                gender, maritalStatus, phone, emergencyPhone, personalEmail, address,
                permanentAddress, employmentType, manager, probationPeriod, payFrequency,
                benefits, taxId, bankAccount, highestQualification, certifications,
                previousEmployers, skills, emergencyContactName, emergencyContactRelation,
                accessLevel, permissions
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              userData,
              (err) => {
                if (err && err.message.includes('UNIQUE constraint failed')) {
                  inserted++;
                } else if (err) {
                  console.warn(`⚠️ Error inserting user ${user.name}: ${err.message}`);
                } else {
                  inserted++;
                }

                if (inserted === allUsers.length) {
                  console.log(`✅ Seeded ${inserted} users into database`);
                  seedActivitiesForUsers(allUsers)
                    .then(() => resolve())
                    .catch((err) => reject(err));
                }
              }
            );
          });
        });
      });
    });
  });
};