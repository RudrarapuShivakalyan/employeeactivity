// Data Loader Utility
// This utility loads employee data from JSON files and populates localStorage

export const loadInitialData = async () => {
  try {
    // Load employees data
    const employeesResponse = await fetch('/data/employees.json');
    const employees = await employeesResponse.json();

    // Load managers data
    const managersResponse = await fetch('/data/managers.json');
    const managers = await managersResponse.json();

    // Load admins data
    const adminsResponse = await fetch('/data/admins.json');
    const admins = await adminsResponse.json();

    // Combine all users
    const allUsers = [...employees, ...managers, ...admins];

    // Initialize localStorage if empty
    if (!localStorage.getItem('employees')) {
      localStorage.setItem('employees', JSON.stringify(allUsers));
    }

    if (!localStorage.getItem('users')) {
      // Create simplified user records for authentication
      const authUsers = allUsers.map(user => ({
        name: user.name,
        role: user.role,
        department: user.department,
        employeeId: user.employeeId,
        joiningDate: user.joiningDate,
        salary: user.salary,
        yearsOfExperience: user.yearsOfExperience
      }));
      localStorage.setItem('users', JSON.stringify(authUsers));
    }

    console.log('Initial data loaded successfully:', {
      employees: employees.length,
      managers: managers.length,
      admins: admins.length,
      total: allUsers.length
    });

    return allUsers;
  } catch (error) {
    console.error('Error loading initial data:', error);
    return [];
  }
};

// Export function to manually reload data
export const reloadData = loadInitialData;

// Export function to get data from files (for development)
export const getDataFromFiles = async () => {
  try {
    const [employeesRes, managersRes, adminsRes] = await Promise.all([
      fetch('/data/employees.json'),
      fetch('/data/managers.json'),
      fetch('/data/admins.json')
    ]);

    const employees = await employeesRes.json();
    const managers = await managersRes.json();
    const admins = await adminsRes.json();

    return {
      employees,
      managers,
      admins,
      all: [...employees, ...managers, ...admins]
    };
  } catch (error) {
    console.error('Error fetching data from files:', error);
    return { employees: [], managers: [], admins: [], all: [] };
  }
};