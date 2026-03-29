import { createContext, useContext, useEffect, useState } from "react";

const EmployeeContext = createContext();
export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("employees");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("employees", JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (emp) => {
    setEmployees((prev) => [
      ...prev,
      {
        ...emp,
        id: Date.now(),
        employeeId: emp.employeeId || `EMP${Date.now()}`,
        joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0],
        salary: emp.salary || 0,
        yearsOfExperience: emp.yearsOfExperience || 0,
        status: "Active",
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        // Personal Information
        dateOfBirth: emp.dateOfBirth || '',
        gender: emp.gender || '',
        maritalStatus: emp.maritalStatus || '',
        phone: emp.phone || '',
        emergencyPhone: emp.emergencyPhone || '',
        personalEmail: emp.personalEmail || '',
        address: emp.address || '',
        permanentAddress: emp.permanentAddress || '',
        // Employment Details
        employmentType: emp.employmentType || 'Full-time',
        manager: emp.manager || '',
        probationPeriod: emp.probationPeriod || 3,
        contractEndDate: emp.contractEndDate || '',
        // Compensation & Benefits
        payFrequency: emp.payFrequency || 'Monthly',
        benefits: emp.benefits || [],
        taxId: emp.taxId || '',
        bankAccount: emp.bankAccount || '',
        // Education & Experience
        highestQualification: emp.highestQualification || '',
        certifications: emp.certifications || [],
        previousEmployers: emp.previousEmployers || [],
        skills: emp.skills || [],
        // Emergency Contact
        emergencyContactName: emp.emergencyContactName || '',
        emergencyContactRelation: emp.emergencyContactRelation || '',
        // System
        accessLevel: emp.accessLevel || 'Employee',
        permissions: emp.permissions || ['basic_access']
      },
    ]);
  };

  const toggleStatus = (id) => {
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" }
          : e
      )
    );
  };

  return (
    <EmployeeContext.Provider
      value={{ employees, addEmployee, toggleStatus }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};
