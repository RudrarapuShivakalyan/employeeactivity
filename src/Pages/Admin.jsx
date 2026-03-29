import { useState } from "react";
import ActivityLogs from "./ActivityLogs";
import EmployeeManagement from "./EmployeeManagement";
import EmployeeProfileSearch from "./EmployeeProfileSearch";
import LoanManagement from "./LoanManagement";
import AdminDashboardOverview from "../components/AdminDashboardOverview";
import SystemAuditAndCompliance from "../components/SystemAuditAndCompliance";
import PayrollAndCompensation from "../components/PayrollAndCompensation";
import DepartmentAndResourceManagement from "../components/DepartmentAndResourceManagement";
import EmployeeOnboardingAndOffboarding from "../components/EmployeeOnboardingAndOffboarding";
import AdminReportsAndAnalytics from "../components/AdminReportsAndAnalytics";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    fullName: "",
    department: "IT",
    role: "employee",
    employeeId: "",
    joiningDate: "",
    dateOfBirth: "",
    gender: "",
    salary: "",
    yearsOfExperience: "",
    email: "",
    phone: "",
    status: "Active",
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    window.location.href = "/";
  };

  // ✅ Handle Edit from Search or Management Tab
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEditForm({
      name: employee.name || employee.fullName || "",
      fullName: employee.fullName || employee.name || "",
      department: employee.department || "IT",
      role: employee.role || "employee",
      employeeId: employee.employeeId || "",
      joiningDate: employee.joiningDate || "",
      dateOfBirth: employee.dateOfBirth || "",
      gender: employee.gender || "",
      salary: employee.salary || "",
      yearsOfExperience: employee.yearsOfExperience || "",
      email: employee.email || "",
      phone: employee.phone || "",
      status: employee.status || "Active",
    });
    setShowEditModal(true);
  };

  // ✅ Save Employee Changes
  const handleSaveEmployee = () => {
    try {
      if (!editForm.name || !editForm.salary) {
        alert("❌ Name and Salary are required");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.map((u) =>
        u.employeeId === editingEmployee.employeeId
          ? { ...u, ...editForm }
          : u
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      
      setShowEditModal(false);
      setEditingEmployee(null);
      setEditForm({
        name: "",
        fullName: "",
        department: "IT",
        role: "employee",
        employeeId: "",
        joiningDate: "",
        dateOfBirth: "",
        gender: "",
        salary: "",
        yearsOfExperience: "",
        email: "",
        phone: "",
        status: "Active",
      });

      alert(`✅ ${editForm.name} updated successfully!`);
      window.location.reload(); // Refresh to show changes
    } catch (error) {
      console.error("Error saving:", error);
      alert("❌ Error saving employee");
    }
  };

  // ✅ Handle Delete Employee
  const handleDeleteEmployee = (employee) => {
    const confirmDelete = window.confirm(
      `⚠️ Are you sure you want to delete ${employee.name || employee.fullName}?\n\nEmployee ID: ${employee.employeeId || "N/A"}\nDepartment: ${employee.department || "N/A"}\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const updatedUsers = users.filter(
        (u) => u.employeeId !== employee.employeeId && u.id !== employee.id
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      alert(`✅ ${employee.name || employee.fullName} has been deleted successfully!`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting:", error);
      alert("❌ Error deleting employee");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 shadow-lg">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl font-bold">👨‍💼 Professional Admin Dashboard</h1>
            <p className="text-indigo-100 mt-2">Complete system management, payroll, compliance & advanced analytics</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition font-semibold flex items-center gap-2 shadow-md"
            >
              📊 Analytics
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition font-semibold flex items-center gap-2 shadow-md"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-b-4 border-indigo-600">
          <div className="flex gap-0 flex-wrap">
            <button
              onClick={() => {
                setActiveTab("overview");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">📊</span> Dashboard
            </button>

            <button
              onClick={() => {
                setActiveTab("management");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "management"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">👥</span> Employees
            </button>

            <button
              onClick={() => {
                setActiveTab("departments");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "departments"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">🏢</span> Departments
            </button>

            <button
              onClick={() => {
                setActiveTab("payroll");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "payroll"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">💰</span> Payroll
            </button>

            <button
              onClick={() => {
                setActiveTab("onboarding");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "onboarding"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">🎯</span> Onboarding
            </button>

            <button
              onClick={() => {
                setActiveTab("audit");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "audit"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">🔒</span> Audit
            </button>

            <button
              onClick={() => {
                setActiveTab("reports");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "reports"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">📈</span> Reports
            </button>

            <button
              onClick={() => {
                setActiveTab("search");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "search"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">🔍</span> Search
            </button>

            <button
              onClick={() => {
                setActiveTab("activities");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "activities"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-r"
              }`}
            >
              <span className="text-xl">📝</span> Activities
            </button>

            <button
              onClick={() => {
                setActiveTab("loans");
                setShowEditModal(false);
              }}
              className={`px-6 py-4 font-semibold text-center transition flex items-center justify-center gap-2 ${
                activeTab === "loans"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">🏦</span> Loans
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {activeTab === "overview" && <AdminDashboardOverview />}

          {activeTab === "management" && (
            <EmployeeManagement
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}

          {activeTab === "departments" && <DepartmentAndResourceManagement />}

          {activeTab === "payroll" && <PayrollAndCompensation />}

          {activeTab === "onboarding" && <EmployeeOnboardingAndOffboarding />}

          {activeTab === "audit" && <SystemAuditAndCompliance />}

          {activeTab === "reports" && <AdminReportsAndAnalytics />}

          {activeTab === "search" && (
            <EmployeeProfileSearch
              onEdit={handleEditEmployee}
              onDelete={handleDeleteEmployee}
            />
          )}

          {activeTab === "activities" && <ActivityLogs />}

          {activeTab === "loans" && <LoanManagement />}
        </div>
      </div>

      {/* Edit Modal - Global Access */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 flex justify-between items-center sticky top-0">
              <div>
                <h3 className="text-2xl font-bold">✏️ Edit Employee</h3>
                <p className="text-indigo-100 text-sm mt-1">
                  ID: {editingEmployee.employeeId || "N/A"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingEmployee(null);
                }}
                className="text-white hover:text-indigo-100 text-4xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    placeholder="Enter employee name"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  />
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={editForm.employeeId}
                    disabled
                    className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed text-gray-600 font-medium"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={editForm.department}
                    onChange={(e) =>
                      setEditForm({ ...editForm, department: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  >
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Sales">Sales</option>
                    <option value="Support">Support</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Joining Date
                  </label>
                  <input
                    type="date"
                    value={editForm.joiningDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, joiningDate: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary (₹) *
                  </label>
                  <input
                    type="number"
                    value={editForm.salary}
                    onChange={(e) =>
                      setEditForm({ ...editForm, salary: e.target.value })
                    }
                    placeholder="50000"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={editForm.yearsOfExperience}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        yearsOfExperience: e.target.value,
                      })
                    }
                    placeholder="0"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="tester">Tester</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                    placeholder="name@company.com"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    placeholder="9876543210"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={editForm.dateOfBirth}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        dateOfBirth: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={editForm.gender}
                    onChange={(e) =>
                      setEditForm({ ...editForm, gender: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingEmployee(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
                >
                  ✕ Cancel
                </button>

                <button
                  onClick={() => handleDeleteEmployee(editingEmployee)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition font-medium flex items-center gap-2"
                >
                  🗑️ Delete Employee
                </button>

                <button
                  onClick={handleSaveEmployee}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium flex items-center gap-2 shadow-md"
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}