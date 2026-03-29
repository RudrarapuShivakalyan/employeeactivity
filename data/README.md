# Employee Data Storage

This folder contains structured data files for storing employee, manager, and admin details.

## 📁 File Structure

### `employees.json`
Contains regular employee records with the following fields:
- `id`: Unique identifier
- `employeeId`: Employee ID (e.g., "EMP001")
- `name`: Full name
- `email`: Company email
- `department`: Department (IT, HR, Sales, Support)
- `role`: Always "employee"
- `joiningDate`: Date of joining (YYYY-MM-DD)
- `salary`: Annual salary in USD
- `yearsOfExperience`: Years of professional experience
- `status`: "Active" or "Inactive"
- `phone`: Contact phone number
- `address`: Residential address

### `managers.json`
Contains manager records with additional fields:
- All employee fields plus:
- `teamSize`: Number of team members
- `reportingTo`: Who they report to

### `admins.json`
Contains admin records with additional fields:
- All employee fields plus:
- `accessLevel`: Admin level (Super Admin, HR Admin, etc.)
- `permissions`: Array of permission strings
- `lastLogin`: Last login timestamp

## 🔄 Data Synchronization

The application automatically:
1. Loads data from these JSON files on startup
2. Merges with localStorage data
3. Saves changes back to localStorage
4. Can export data back to these files

## 📊 Sample Data

The files contain sample data for testing:
- 3 employees across different departments
- 3 managers with team information
- 2 admins with different access levels

## 🚀 Usage

To add new employees/managers/admins:
1. Edit the respective JSON file
2. Add new record with required fields
3. Restart the application to load new data

Or use the admin interface to add employees through the UI, which will update localStorage automatically.