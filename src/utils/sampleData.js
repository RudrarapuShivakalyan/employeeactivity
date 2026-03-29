// Sample employee data for initialization
export const initializeSampleData = () => {
  try {
    const sampleEmployees = [
      {
        id: "EMP001",
        employeeId: "E001",
        name: "John Smith",
        email: "john.smith@company.com",
        phone: "555-0101",
        department: "IT",
        joiningDate: "2022-01-15",
        dateOfBirth: "1990-05-20",
        gender: "Male",
        salary: "75000",
        yearsOfExperience: "5",
        role: "employee",
        status: "Active",
        address: "123 Main St, New York, NY 10001",
        emergencyContact: "555-0102",
        emergencyContactName: "Sarah Smith",
      },
      {
        id: "EMP002",
        employeeId: "E002",
        name: "Emma Johnson",
        email: "emma.johnson@company.com",
        phone: "555-0103",
        department: "HR",
        joiningDate: "2021-03-20",
        dateOfBirth: "1992-07-15",
        gender: "Female",
        salary: "65000",
        yearsOfExperience: "4",
        role: "manager",
        status: "Active",
        address: "456 Oak Ave, Boston, MA 02101",
        emergencyContact: "555-0104",
        emergencyContactName: "Michael Johnson",
      },
      {
        id: "EMP003",
        employeeId: "E003",
        name: "David Chen",
        email: "david.chen@company.com",
        phone: "555-0105",
        department: "IT",
        joiningDate: "2023-06-10",
        dateOfBirth: "1995-11-30",
        gender: "Male",
        salary: "70000",
        yearsOfExperience: "2",
        role: "employee",
        status: "Active",
        address: "789 Pine Rd, San Francisco, CA 94102",
        emergencyContact: "555-0106",
        emergencyContactName: "Lisa Chen",
      },
      {
        id: "EMP004",
        employeeId: "E004",
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
        phone: "555-0107",
        department: "Finance",
        joiningDate: "2020-09-05",
        dateOfBirth: "1988-02-14",
        gender: "Female",
        salary: "80000",
        yearsOfExperience: "7",
        role: "manager",
        status: "Active",
        address: "321 Elm St, Chicago, IL 60601",
        emergencyContact: "555-0108",
        emergencyContactName: "Robert Williams",
      },
      {
        id: "EMP005",
        employeeId: "E005",
        name: "Michael Brown",
        email: "michael.brown@company.com",
        phone: "555-0109",
        department: "Sales",
        joiningDate: "2022-11-12",
        dateOfBirth: "1993-08-25",
        gender: "Male",
        salary: "72000",
        yearsOfExperience: "3",
        role: "employee",
        status: "Active",
        address: "654 Maple Dr, Houston, TX 77001",
        emergencyContact: "555-0110",
        emergencyContactName: "Jennifer Brown",
      },
    ];

    const sampleManagers = [
      {
        id: "MGR001",
        employeeId: "M001",
        name: "Emma Johnson",
        email: "emma.johnson@company.com",
        department: "HR",
        role: "manager",
        status: "Active",
      },
      {
        id: "MGR002",
        employeeId: "M002",
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
        department: "Finance",
        role: "manager",
        status: "Active",
      },
    ];

    const sampleAdmins = [
      {
        id: "ADMIN001",
        employeeId: "ADMIN001",
        name: "Admin User",
        email: "admin@company.com",
        role: "admin",
        status: "Active",
      },
    ];

    const sampleUsers = [
      {
        id: "USER001",
        employeeId: "E001",
        username: "john.smith",
        email: "john.smith@company.com",
        password: "password123", // In production, this should be hashed
        role: "employee",
        status: "Active",
      },
      {
        id: "USER002",
        employeeId: "E002",
        username: "emma.johnson",
        email: "emma.johnson@company.com",
        password: "password123",
        role: "manager",
        status: "Active",
      },
      {
        id: "USER003",
        employeeId: "ADMIN001",
        username: "admin",
        email: "admin@company.com",
        password: "admin123",
        role: "admin",
        status: "Active",
      },
    ];

    // Check if data already exists
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(sampleEmployees));
      console.log("✅ Sample employees initialized");
    }

    if (!localStorage.getItem("managers")) {
      localStorage.setItem("managers", JSON.stringify(sampleManagers));
      console.log("✅ Sample managers initialized");
    }

    if (!localStorage.getItem("admins")) {
      localStorage.setItem("admins", JSON.stringify(sampleAdmins));
      console.log("✅ Sample admins initialized");
    }

    if (!localStorage.getItem("authUsers")) {
      localStorage.setItem("authUsers", JSON.stringify(sampleUsers));
      console.log("✅ Sample auth users initialized");
    }

    return true;
  } catch (error) {
    console.error("❌ Error initializing sample data:", error);
    return false;
  }
};
