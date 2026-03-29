import { useState, useEffect } from "react";
import { useEmployees } from "../context/EmployeeContext";
import { useActivities } from "../context/ActivityContext";

const safeParseJSON = (value, fallback = []) => {
  if (value == null || value === '') return fallback;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeUserRecord = (user) => {
  if (!user) return user;
  return {
    ...user,
    benefits: safeParseJSON(user.benefits, []),
    certifications: safeParseJSON(user.certifications, []),
    previousEmployers: safeParseJSON(user.previousEmployers, []),
    skills: safeParseJSON(user.skills, []),
    permissions: safeParseJSON(user.permissions, []),
  };
};

export default function EmployeeProfileSearch() {
  const { employees } = useEmployees();
  const { activities } = useActivities();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);

  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  // ✅ Combine & remove duplicates
  const combinedList = [...employees, ...allUsers].filter(
    (user, index, self) => {
      const name = user.name || user.fullName || "";
      return (
        index ===
        self.findIndex(
          (u) =>
            (u.name || u.fullName || "") === name &&
            u.employeeId === user.employeeId
        )
      );
    }
  );

  // ✅ Get unique roles
  const uniqueRoles = ["ALL", ...new Set(combinedList.map((e) => e.role))];

  // ✅ Search Logic
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      if (searchQuery.trim() || roleFilter !== "ALL") {
        const filtered = combinedList.filter((emp) => {
          const name = emp.name || emp.fullName || "";
          const email = emp.email || emp.personalEmail || "";
          const empId = emp.employeeId || "";

          const matchesSearch =
            name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            empId.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesRole =
            roleFilter === "ALL" || emp.role === roleFilter;

          return matchesSearch && matchesRole;
        });

        setFilteredEmployees(filtered);
      } else {
        setFilteredEmployees([]);
      }
      setIsLoading(false);
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [searchQuery, roleFilter, combinedList]);

  // ✅ Select Employee
  const handleSelectEmployee = (emp) => {
    if (!emp) return;
    setSelectedEmployee(normalizeUserRecord({ ...emp }));
    setSearchQuery("");
  };

  // ✅ Get Activities
  const getUserActivities = () => {
    if (!selectedEmployee) return [];
    const empName = selectedEmployee.name || selectedEmployee.fullName;
    return activities.filter((a) => a.employeeName === empName);
  };

  // ✅ Project Details
  const getProjectDetails = () => {
    const userActivities = getUserActivities();

    return Object.values(
      userActivities.reduce((acc, a) => {
        const key = a.projectName || "(No Project)";

        if (!acc[key]) {
          acc[key] = { ...a, totalHours: 0 };
        }

        acc[key].totalHours += a.hoursWorked || 0;
        return acc;
      }, {})
    );
  };

  // ✅ Salary Format
  const formatSalary = (salary) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(salary) || 0);

  // ✅ Safe skills array
  const safeSkills = Array.isArray(selectedEmployee?.skills)
    ? selectedEmployee.skills
    : [];

  // =========================
  // 🔍 SEARCH UI
  // =========================
  if (!selectedEmployee) {
    return (
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Search Employee Profile</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        />

        {/* Role Filter */}
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
        >
          {uniqueRoles.map((role) => (
            <option key={role} value={role}>
              {role === "ALL" ? "All Roles" : role}
            </option>
          ))}
        </select>

        {/* Loading */}
        {isLoading && (
          <p className="text-center text-gray-500 py-4">Searching...</p>
        )}

        {/* Suggestions */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp, index) => (
              <button
                key={index}
                onClick={() => handleSelectEmployee(emp)}
                className="w-full text-left p-3 border rounded hover:bg-indigo-50 hover:border-indigo-600 transition flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {emp.name || emp.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {emp.employeeId} • {emp.role}
                  </p>
                </div>
                <span className="text-indigo-600">→</span>
              </button>
            ))
          ) : searchQuery || roleFilter !== "ALL" ? (
            <p className="text-center text-gray-500 py-4">
              No employee found
            </p>
          ) : (
            <p className="text-center text-gray-400 py-4">
              Start typing to search...
            </p>
          )}
        </div>
      </div>
    );
  }

  const projects = getProjectDetails();

  // =========================
  // 👤 PROFILE UI
  // =========================
  return (
    <div className="bg-white p-6 rounded shadow max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 border-b pb-4">
        <h2 className="text-3xl font-bold">
          {selectedEmployee.name || selectedEmployee.fullName}
        </h2>
        <p className="text-gray-600">
          {selectedEmployee.employeeId} • {selectedEmployee.role}
        </p>
      </div>

      {/* Personal Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-indigo-600 mb-2">
          Personal Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p><b>Name:</b> {selectedEmployee.name || selectedEmployee.fullName}</p>
          <p><b>Employee ID:</b> {selectedEmployee.employeeId || "N/A"}</p>
          <p><b>Phone:</b> {selectedEmployee.phone || "N/A"}</p>
          <p><b>Marital Status:</b> {selectedEmployee.maritalStatus || "N/A"}</p>
        </div>
      </div>

      {/* More Details */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-indigo-600 mb-2">
          Contact & Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p><b>Email:</b> {selectedEmployee.email || selectedEmployee.personalEmail || "N/A"}</p>
          <p><b>Date of Birth:</b> {selectedEmployee.dateOfBirth || "N/A"}</p>
          <p><b>Gender:</b> {selectedEmployee.gender || "N/A"}</p>
          <p><b>Emergency Contact:</b> {selectedEmployee.emergencyPhone || "N/A"}</p>
        </div>
      </div>

      {/* Employment */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-indigo-600 mb-2">
          Employment Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <p><b>Role:</b> {selectedEmployee.role}</p>
          <p><b>Department:</b> {selectedEmployee.department || "N/A"}</p>
          <p><b>Salary:</b> {formatSalary(selectedEmployee.salary)}</p>
          <p><b>Status:</b> {selectedEmployee.status || "Active"}</p>
        </div>
      </div>

      {/* Address */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-indigo-600 mb-2">
          Address
        </h3>
        <p><b>Current Address:</b> {selectedEmployee.address || "N/A"}</p>
        <p><b>Permanent Address:</b> {selectedEmployee.permanentAddress || "N/A"}</p>
      </div>

      {/* Skills & Education */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="font-semibold text-indigo-600 mb-2">
          Skills & Education
        </h3>
        <p><b>Qualification:</b> {selectedEmployee.highestQualification || "N/A"}</p>
        <p><b>Experience:</b> {selectedEmployee.yearsOfExperience || "0"} years</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {safeSkills.length > 0 ? (
            safeSkills.map((skill, i) => (
              <span
                key={i}
                className="bg-indigo-100 text-indigo-900 px-3 py-1 text-sm rounded-full"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No skills added</span>
          )}
        </div>
      </div>

      {/* Projects */}
      {selectedEmployee.role === "employee" && (
        <div className="mb-6 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold text-indigo-600 mb-2">
            Projects
          </h3>

          {projects.length === 0 ? (
            <p className="text-gray-500">No projects assigned</p>
          ) : (
            <div className="space-y-2">
              {projects.map((p, i) => (
                <div key={i} className="border rounded p-3 bg-white hover:border-indigo-600 transition">
                  <p className="font-semibold">{p.projectName}</p>
                  <p className="text-sm text-gray-600">
                    Total Hours: <b>{p.totalHours}</b>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => setSelectedEmployee(null)}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        ← Back to Search
      </button>
    </div>
  );
}