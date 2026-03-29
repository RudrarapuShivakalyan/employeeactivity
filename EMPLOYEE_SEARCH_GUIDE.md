# Employee Profile Search - Implementation Guide

## Overview
A comprehensive employee profile search and viewing system has been added to the Employee Activity Management System. This feature allows Admin, Manager, and Employee users to search for employee/manager/admin profiles and view their complete personal, professional, and system information.

## Features Implemented

### 1. **Employee Profile Search Component**
- **Location**: `src/Pages/EmployeeProfileSearch.jsx`
- **Search Functionality**: 
  - Search by employee name (case-insensitive)
  - Filter by role (Employee, Manager, Admin)
  - Real-time search suggestions with dropdown
  - Combines data from employees, managers, and admins

### 2. **Comprehensive Profile Details Display**
The profile view shows all the following sections:

#### **Personal Information**
- Name
- Employee ID
- Date of Birth
- Gender
- Marital Status
- Phone
- Emergency Phone
- Personal Email

#### **Address Information**
- Current Address
- Permanent Address

#### **Employment Information**
- Role
- Department
- Employment Type
- Manager
- Joining Date
- Probation Period
- Contract End Date
- Status (Active/Inactive)

#### **Compensation & Benefits**
- Salary (formatted in Indian Rupees)
- Pay Frequency
- Benefits List
- Tax ID (masked)
- Bank Account

#### **Education & Experience**
- Highest Qualification
- Years of Experience
- Certifications
- Previous Employers
- Skills

#### **Project Details** (for employees)
- Project Name
- Project Phase
- Project Description
- Total Hours Worked
- Project Deadline
- Project Status

#### **Activity History** (for employees)
- Recent activity entries
- Date, Hours Worked, Project Phase
- Up to 10 most recent activities

#### **Emergency Contact**
- Emergency Contact Name
- Emergency Contact Relationship

#### **System Information**
- Access Level
- Last Login
- Created Date
- Last Updated
- Permissions

#### **Manager-Specific Information**
- Team Size
- Reports To

### 3. **User Role Integration**

#### **Admin Dashboard**
- New "Search Profile" tab added
- Can search and view any employee, manager, or admin profile
- Tabs: Employee Management | Search Profile | Activity Logs

#### **Manager Dashboard**
- New "Search Profile" tab added
- Can search and view team member profiles
- Tabs: Activity Approvals | Search Profile

#### **Employee Dashboard**
- New "Search Profile" tab added
- Can search and view any employee profile (team members, etc.)
- Tabs: My Profile | Add Activity | My Activities | Search Profile

## How to Use

### For Admin Users:
1. Navigate to Admin Dashboard
2. Click on "Search Profile" tab
3. Enter employee name in the search box OR select a role filter
4. Select from the dropdown suggestions
5. View complete profile details
6. Click "Back to Search" to search for another employee

### For Manager Users:
1. Navigate to Manager Dashboard
2. Click on "Search Profile" tab
3. Search by name or filter by role
4. Select employee from suggestions
5. View profile details

### For Employee Users:
1. Navigate to Employee Dashboard
2. Click on "Search Profile" tab
3. Search for colleagues
4. View available profile information

## Search Features

### Name Search
- Real-time filtering as you type
- Case-insensitive matching
- Shows dropdown with all matching employees
- Displays role badge (Employee/Manager/Admin) with different colors

### Role Filter
- Filter by ALL, Employee, Manager, or Admin
- Can be combined with name search
- Shows associated department and employee ID

### Dropdown Suggestions
- Shows up to all matching results
- Displays: Name, Employee ID, Department, Role
- Color-coded role badges for quick identification
- Hover effects for better UX

## Data Structure

The search component works with data from multiple sources:
- **Employees**: From `localStorage['employees']` and EmployeeContext
- **Managers**: From `localStorage['users']` with role='manager'
- **Admins**: From `localStorage['users']` with role='admin'

### Supported Data Fields:
```javascript
{
  id: number,
  employeeId: string,
  name: string,
  email: string,
  department: string,
  role: string, // 'employee', 'manager', 'admin'
  joiningDate: string,
  salary: number,
  yearsOfExperience: number,
  status: string, // 'Active', 'Inactive'
  dateOfBirth: string,
  gender: string,
  maritalStatus: string,
  phone: string,
  emergencyPhone: string,
  personalEmail: string,
  address: string,
  permanentAddress: string,
  employmentType: string,
  manager: string,
  probationPeriod: number,
  contractEndDate: string,
  payFrequency: string,
  benefits: string[],
  taxId: string,
  bankAccount: string,
  highestQualification: string,
  certifications: string[],
  previousEmployers: string[],
  skills: string[],
  emergencyContactName: string,
  emergencyContactRelation: string,
  accessLevel: string,
  permissions: string[],
  lastLogin: string (ISO format),
  createdDate: string (ISO format),
  lastUpdated: string (ISO format),
  // Manager specific fields
  teamSize: number,
  reportingTo: string
}
```

## Technical Details

### Files Modified:
1. `src/Pages/EmployeeProfileSearch.jsx` - **NEW** - Main search component
2. `src/Pages/Admin.jsx` - Added tab navigation with search
3. `src/Pages/Manager.jsx` - Added tab navigation with search
4. `src/Pages/Employee.jsx` - Added tab navigation with search

### Dependencies:
- React hooks (useState, useEffect)
- EmployeeContext (useEmployees)
- ActivityContext (useActivities)
- Tailwind CSS for styling

### Component States:
- `searchQuery`: Current search input
- `selectedEmployee`: Currently viewed employee
- `filteredEmployees`: Search results
- `showSuggestions`: Show/hide dropdown
- `roleFilter`: Selected role filter

## Features & Benefits

✅ Real-time search with suggestions
✅ Role-based filtering (Employee, Manager, Admin)
✅ Comprehensive profile view
✅ Salary formatting in Indian Rupees
✅ Masked sensitive information (Tax ID, Bank Account)
✅ Project history for employees
✅ Activity tracking for employees
✅ Role-specific information (managers show team size)
✅ Responsive design with Tailwind CSS
✅ Accessible UI with proper color coding

## Usage Examples

### Example 1: Admin searching for employee
1. Go to Admin Dashboard → Search Profile
2. Type "rahul" in search box
3. Select "rahul" from dropdown
4. View complete profile including:
   - Personal details (DOB, Gender, etc.)
   - Employment info (Department, Joining Date, etc.)
   - Project details from their activity records
   - System information

### Example 2: Manager viewing team member profile
1. Go to Manager Dashboard → Search Profile
2. Use role filter to show employees only
3. Type team member's name
4. View their profile and project assignments

### Example 3: Employee viewing colleague profile
1. Go to Employee Dashboard → Search Profile
2. Search by colleague name
3. View available information (based on role permissions)

## Security Considerations

- Sensitive Information Masking:
  - Tax ID shows only last 4 characters (****1234)
  - Bank Account shows only last 4 characters (****-****-****-1234)
- Role-based visibility (manager-specific fields only show for managers)
- All data stored securely in localStorage (production should use backend)

## Future Enhancements

Potential improvements for future versions:
1. **Export Profile**: Download profile as PDF
2. **Print Functionality**: Print profile details
3. **Role-Based Permissions**: Limit what each role can view
4. **Activity Timeline**: Visual timeline of employee activities
5. **Comparison**: Compare profiles side-by-side
6. **Advanced Filters**: Filter by department, salary range, etc.
7. **Backend API**: Connect to actual database instead of localStorage
8. **Audit Trail**: Track who viewed which profiles
9. **Batch Operations**: View multiple profiles at once
10. **Reports**: Generate employee reports

## Troubleshooting

### Search returns no results
- Check spelling of employee name
- Try using different role filter
- Ensure data is loaded in localStorage

### Profile shows "Not specified" for many fields
- Data may not be entered for that employee
- Update employee record in Employee Management to add missing information
- Fields will populate once data is saved

### Suggestions not showing
- Ensure search query is typed in the search box
- Click on the search box to trigger focus
- Try selecting a role filter first

## Support

For issues or questions:
1. Check that data is properly loaded in localStorage
2. Ensure you have the correct user role to access the feature
3. Verify the EmployeeProfileSearch component is imported in the dashboard pages
4. Check browser console for any error messages

## Version History

- **v1.0** - Initial implementation with full profile view, search, and role filters
