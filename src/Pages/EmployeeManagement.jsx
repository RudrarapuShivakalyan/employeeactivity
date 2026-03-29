import { useState, useEffect } from "react";
import { useEmployees } from "../context/EmployeeContext";
import { useAuth } from "../context/AuthContext";

export default function EmployeeManagement() {
  const { employees } = useEmployees();
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [departmentFilter, setDepartmentFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewingDetails, setViewingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [addForm, setAddForm] = useState({
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
    status: "",
    address: "",
    emergencyContact: "",
    emergencyContactName: "",
  });

  const perPage = 10;

  // ✅ Load users from localStorage
  useEffect(() => {
    setIsLoading(true);
    try {
      const usersData = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Merge users and employees
  const merged = [
    ...users.map((u) => ({
      id: u.employeeId || `${u.name}-${u.role}`,
      ...u,
      email: u.email || u.name.toLowerCase().replace(/\s+/g, "") + "@company.com",
    })),
    ...employees.map((e) => ({
      id: e.employeeId || `${e.name}-${e.role}`,
      ...e,
      email: e.email || e.name.toLowerCase().replace(/\s+/g, "") + "@company.com",
      role: e.role || "employee",
    })),
  ].filter((emp, index, self) => index === self.findIndex((e) => e.id === emp.id));

  // ✅ Auth check - admins see all, others see themselves
  const isAdmin = authUser?.role === "admin";
  const visibleUsers = isAdmin
    ? merged
    : merged.filter((u) => (u.name === authUser?.name || u.fullName === authUser?.fullName) && u.role === authUser?.role);

  // ✅ Filter logic
  const filtered = visibleUsers.filter((e) => {
    const s = search.toLowerCase();
    const matchSearch =
      (e.name || e.fullName || "").toLowerCase().includes(s) ||
      (e.department || "").toLowerCase().includes(s) ||
      (e.email || "").toLowerCase().includes(s) ||
      (e.employeeId || "").toLowerCase().includes(s);

    const matchRole = roleFilter === "ALL" || e.role === roleFilter;
    const matchDept = departmentFilter === "ALL" || e.department === departmentFilter;
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;

    return matchSearch && matchRole && matchDept && matchStatus;
  });

  // ✅ Sorting
  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortConfig.key] || "";
    const bVal = b[sortConfig.key] || "";

    if (sortConfig.direction === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice((page - 1) * perPage, page * perPage);

  // ✅ Get unique values
  const departments = ["ALL", ...new Set(merged.map((e) => e.department).filter(Boolean))];
  const roles = ["ALL", ...new Set(merged.map((e) => e.role).filter(Boolean))];
  const statuses = ["ALL", ...new Set(merged.map((e) => e.status).filter(Boolean))];

  // ✅ Role badge colors
  const badge = (role) => {
    const badges = {
      admin: "bg-red-100 text-red-700",
      manager: "bg-blue-100 text-blue-700",
      frontend: "bg-purple-100 text-purple-700",
      backend: "bg-indigo-100 text-indigo-700",
      tester: "bg-green-100 text-green-700",
      employee: "bg-gray-100 text-gray-700",
    };
    return badges[role] || "bg-gray-100 text-gray-700";
  };

  // ✅ Status badge
  const statusBadge = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : status === "Inactive"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";
  };

  // ✅ Save edit - IMPROVED
  const saveEdit = () => {
    try {
      if (!form.name || !form.salary) {
        alert("❌ Name and Salary are required");
        return;
      }

      if (!form.employeeId) {
        alert("❌ Employee ID is required");
        return;
      }

      // Update in users array
      const updatedUsers = users.map((u) =>
        u.employeeId === editing.employeeId || u.id === editing.id 
          ? { ...u, ...form } 
          : u
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      setEditing(null);
      setForm({});
      
      alert(`✅ ${form.name} updated successfully!`);
    } catch (error) {
      console.error("Error saving:", error);
      alert("❌ Error saving employee");
    }
  };

  // ✅ Delete employee - IMPROVED with better confirmation
  const handleDelete = (emp) => {
    const confirmDelete = window.confirm(
      `⚠️ Are you sure you want to delete ${emp.name || emp.fullName}?\n\nEmployee ID: ${emp.employeeId || "N/A"}\nDepartment: ${emp.department || "N/A"}\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const updatedUsers = users.filter(
        (u) => u.employeeId !== emp.employeeId && u.id !== emp.id
      );
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      alert(`✅ ${emp.name || emp.fullName} has been deleted successfully!`);
    } catch (error) {
      console.error("Error deleting:", error);
      alert("❌ Error deleting employee");
    }
  };

  // ✅ Add employee
  const handleAddEmployee = () => {
    try {
      if (!addForm.name && !addForm.fullName) {
        alert("❌ Name is required");
        return;
      }

      if (!addForm.employeeId) {
        alert("❌ Employee ID is required");
        return;
      }

      if (!addForm.salary) {
        alert("❌ Salary is required");
        return;
      }

      if (!addForm.status) {
        alert("❌ Status is required");
        return;
      }

      const newEmployee = {
        ...addForm,
        name: addForm.name || addForm.fullName,
        id: addForm.employeeId,
        createdAt: new Date().toISOString(),
      };

      const updated = [...users, newEmployee];
      localStorage.setItem("users", JSON.stringify(updated));
      setUsers(updated);

      setAddForm({
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
        status: "",
        address: "",
        emergencyContact: "",
        emergencyContactName: "",
      });

      setShowAddModal(false);
      alert(`✅ ${newEmployee.name} added successfully!`);
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("❌ Error adding employee");
    }
  };

  // ✅ Export CSV
  const handleExport = () => {
    try {
      const headers = ["Name", "Employee ID", "Department", "Joining Date", "Salary", "Experience", "Role", "Status", "Email", "Phone"];
      const rows = sorted.map((e) => [
        e.name || e.fullName,
        e.employeeId || "N/A",
        e.department || "N/A",
        e.joiningDate || "N/A",
        e.salary || "0",
        e.yearsOfExperience || "0",
        e.role,
        e.status,
        e.email || "N/A",
        e.phone || "N/A",
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `employees_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(link.href);
      alert("✅ Data exported successfully!");
    } catch (error) {
      console.error("Error exporting:", error);
      alert("❌ Error exporting data");
    }
  };

  // ✅ Format salary
  const formatSalary = (salary) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(Number(salary) || 0);

  // ✅ Auth check
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center p-6">
          <h1 className="text-3xl font-bold text-red-600 mb-2">🔒 Access Denied</h1>
          <p className="text-gray-600">Only admins can manage employees</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">👥 Employee Management</h1>
            <p className="text-gray-600 mt-1">
              Total Employees: <span className="font-semibold text-indigo-600">{merged.length}</span> | Showing:{" "}
              <span className="font-semibold text-indigo-600">{sorted.length}</span>
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2 shadow-md"
          >
            ➕ Add Employee
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search by name, ID, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />

          {/* Department */}
          <select
            value={departmentFilter}
            onChange={(e) => {
              setDepartmentFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "ALL" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          {/* Role */}
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === "ALL" ? "All Roles" : role}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === "ALL" ? "All Status" : status}
              </option>
            ))}
          </select>

          {/* Export */}
          <button
            onClick={handleExport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            📊 Export CSV
          </button>
        </div>

        <p className="text-gray-600 text-sm">
          Showing <span className="font-semibold">{paginated.length}</span> of{" "}
          <span className="font-semibold">{sorted.length}</span> employees
        </p>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-3">Loading employees...</p>
        </div>
      ) : sorted.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-lg">📭 No employees found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
              <tr>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() =>
                    setSortConfig({
                      key: "name",
                      direction: sortConfig.key === "name" && sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                  title="Click to sort"
                >
                  Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-200 transition"
                  onClick={() =>
                    setSortConfig({
                      key: "employeeId",
                      direction: sortConfig.key === "employeeId" && sortConfig.direction === "asc" ? "desc" : "asc",
                    })
                  }
                  title="Click to sort"
                >
                  ID {sortConfig.key === "employeeId" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joining Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Salary</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Experience</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((e, index) => (
                <tr 
                  key={e.id} 
                  className={`border-b hover:bg-indigo-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900">{e.name || e.fullName}</p>
                    <p className="text-xs text-gray-500">{e.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-medium">{e.employeeId || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{e.department || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{e.joiningDate || "N/A"}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-indigo-600">{formatSalary(e.salary)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{e.yearsOfExperience || "0"} years</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${badge(e.role)}`}>
                      {e.role.charAt(0).toUpperCase() + e.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusBadge(e.status)}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        onClick={() => setViewingDetails(e)}
                        className="text-blue-600 text-xs hover:text-blue-800 font-bold hover:underline transition"
                        title="View full details"
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => {
                          setEditing(e);
                          setForm(e);
                        }}
                        className="text-indigo-600 text-xs hover:text-indigo-800 font-bold hover:underline transition"
                        title="Edit employee details"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e)}
                        className="text-red-600 text-xs hover:text-red-800 font-bold hover:underline transition"
                        title="Delete this employee"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-2 rounded-lg border transition font-medium ${
                page === i + 1
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white text-gray-700 border-gray-300 hover:border-indigo-600 hover:text-indigo-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">
                ✏️ Edit Employee: <span className="text-indigo-600">{editing.name || editing.fullName}</span>
              </h3>
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({});
                }}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  value={form.name || form.fullName || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter employee name"
                />
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID *</label>
                <input
                  type="text"
                  value={form.employeeId || ""}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Enter employee ID"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <select
                  value={form.department || ""}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Department</option>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date</label>
                <input
                  type="date"
                  value={form.joiningDate || ""}
                  onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salary (₹) *</label>
                <input
                  type="number"
                  value={form.salary || ""}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="50000"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  value={form.yearsOfExperience || ""}
                  onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="0"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  value={form.role || ""}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Role</option>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                <select
                  value={form.status || ""}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Probation">Probation</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="name@company.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={form.phone || ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="9876543210"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={form.address || ""}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                  rows="2"
                  placeholder="Enter address"
                />
              </div>

              {/* Emergency Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  value={form.emergencyContactName || ""}
                  onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Contact person name"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Number</label>
                <input
                  type="tel"
                  value={form.emergencyContact || ""}
                  onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  placeholder="Emergency contact phone"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => {
                  setEditing(null);
                  setForm({});
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">➕ Add New Employee</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Employee ID *</label>
                <input
                  type="text"
                  placeholder="EMP001"
                  value={addForm.employeeId}
                  onChange={(e) => setAddForm({ ...addForm, employeeId: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                <select
                  value={addForm.department}
                  onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date</label>
                <input
                  type="date"
                  value={addForm.joiningDate}
                  onChange={(e) => setAddForm({ ...addForm, joiningDate: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Salary (₹) *</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={addForm.salary}
                  onChange={(e) => setAddForm({ ...addForm, salary: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Years of Experience</label>
                <input
                  type="number"
                  placeholder="0"
                  value={addForm.yearsOfExperience}
                  onChange={(e) => setAddForm({ ...addForm, yearsOfExperience: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Probation">Probation</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={addForm.dateOfBirth}
                  onChange={(e) => setAddForm({ ...addForm, dateOfBirth: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  value={addForm.gender}
                  onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <textarea
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 resize-none"
                  rows="2"
                  placeholder="Enter address"
                />
              </div>

              {/* Emergency Contact Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Name</label>
                <input
                  type="text"
                  placeholder="Contact person name"
                  value={addForm.emergencyContactName}
                  onChange={(e) => setAddForm({ ...addForm, emergencyContactName: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Emergency Contact Number</label>
                <input
                  type="tel"
                  placeholder="Emergency contact phone"
                  value={addForm.emergencyContact}
                  onChange={(e) => setAddForm({ ...addForm, emergencyContact: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmployee}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
              >
                ➕ Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewingDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">👤 Employee Details</h3>
              <button
                onClick={() => setViewingDetails(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <p className="text-lg font-bold text-gray-900">{viewingDetails.name || viewingDetails.fullName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
                <p className="text-lg font-bold text-blue-600">{viewingDetails.employeeId || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{viewingDetails.email || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{viewingDetails.phone || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                <p className="text-gray-900 font-semibold">{viewingDetails.department || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badge(viewingDetails.role)}`}>
                  {viewingDetails.role}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Joining Date</label>
                <p className="text-gray-900">{viewingDetails.joiningDate || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                <p className="text-gray-900">{viewingDetails.dateOfBirth || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Salary</label>
                <p className="text-lg font-bold text-indigo-600">{formatSalary(viewingDetails.salary)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Experience</label>
                <p className="text-gray-900">{viewingDetails.yearsOfExperience || "0"} years</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                <p className="text-gray-900">{viewingDetails.gender || "N/A"}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${statusBadge(viewingDetails.status)}`}>
                  {viewingDetails.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setViewingDetails(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setEditing(viewingDetails);
                  setForm(viewingDetails);
                  setViewingDetails(null);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium shadow-md"
              >
                ✏️ Edit Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}