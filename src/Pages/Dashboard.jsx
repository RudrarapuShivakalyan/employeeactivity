import { useState, useEffect, useCallback } from "react";
import { useEmployees } from "../context/EmployeeContext";

export default function Dashboard() {
  const { employees } = useEmployees();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    onLeave: 0,
    byDepartment: {},
    byRole: {},
    byStatus: {},
    recentActivities: [],
  });

  // 📊 Calculate statistics
  const calculateStats = useCallback((data) => {
    const merged = [
      ...data,
      ...employees.filter(
        (e) => !data.find((u) => u.employeeId === e.employeeId)
      ),
    ];

    const byDept = {};
    const byRole = {};
    const byStatus = { Active: 0, Inactive: 0, "On Leave": 0, Permanent: 0, Contract: 0, Probation: 0, Resigned: 0, Retired: 0 };

    let active = 0,
      inactive = 0,
      onLeave = 0;

    merged.forEach((emp) => {
      const dept = emp.department || "Unassigned";
      const role = emp.role || "employee";
      const status = emp.status || "Active";

      byDept[dept] = (byDept[dept] || 0) + 1;
      byRole[role] = (byRole[role] || 0) + 1;
      byStatus[status] = (byStatus[status] || 0) + 1;

      if (status === "Active") active++;
      else if (status === "Inactive") inactive++;
      else if (status === "On Leave") onLeave++;
    });

    setStats({
      totalEmployees: merged.length,
      activeEmployees: active,
      inactiveEmployees: inactive,
      onLeave: onLeave,
      byDepartment: byDept,
      byRole: byRole,
      byStatus: byStatus,
      recentActivities: merged.slice(-5).reverse(),
    });
  }, [employees]);

  useEffect(() => {
    try {
      const usersData = JSON.parse(localStorage.getItem("users") || "[]");
      setUsers(usersData);
      calculateStats(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  }, [calculateStats]);

  // 🎨 Metric Card Component
  const MetricCard = ({ title, value, icon, color, subtext }) => (
    <div
      className={`${color} p-6 rounded-lg shadow-md text-white flex items-center justify-between`}
    >
      <div>
        <p className="text-sm font-semibold opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-2">{value}</p>
        {subtext && <p className="text-xs opacity-80 mt-1">{subtext}</p>}
      </div>
      <div className="text-4xl opacity-30">{icon}</div>
    </div>
  );

  // 📈 Chart Bar Component
  const ChartBar = ({ label, value, max, color }) => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const maxDept = Math.max(...Object.values(stats.byDepartment), 1);
  const maxRole = Math.max(...Object.values(stats.byRole), 1);

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">📊 Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Real-time employee management overview • Last updated:{" "}
          <span className="font-semibold">{new Date().toLocaleString()}</span>
        </p>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon="👥"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          subtext={`${stats.activeEmployees} active`}
        />
        <MetricCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon="✅"
          color="bg-gradient-to-br from-green-500 to-green-600"
          subtext={`${((stats.activeEmployees / stats.totalEmployees) * 100).toFixed(1)}% of total`}
        />
        <MetricCard
          title="Inactive Employees"
          value={stats.inactiveEmployees}
          icon="⛔"
          color="bg-gradient-to-br from-red-500 to-red-600"
          subtext={`${((stats.inactiveEmployees / stats.totalEmployees) * 100).toFixed(1)}% of total`}
        />
        <MetricCard
          title="On Leave"
          value={stats.onLeave}
          icon="🏖️"
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          subtext="Currently away"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📍 Department Distribution
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.byDepartment)
              .sort((a, b) => b[1] - a[1])
              .map(([dept, count]) => (
                <ChartBar
                  key={dept}
                  label={dept}
                  value={count}
                  max={maxDept}
                  color="bg-gradient-to-r from-indigo-500 to-indigo-600"
                />
              ))}
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            👔 Role Distribution
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.byRole)
              .sort((a, b) => b[1] - a[1])
              .map(([role, count]) => (
                <ChartBar
                  key={role}
                  label={role.charAt(0).toUpperCase() + role.slice(1)}
                  value={count}
                  max={maxRole}
                  color="bg-gradient-to-r from-purple-500 to-purple-600"
                />
              ))}
          </div>
        </div>
      </div>

      {/* STATUS OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Status Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📋 Status Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.byStatus)
              .filter(([, count]) => count > 0)
              .map(([status, count]) => (
                <div
                  key={status}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200"
                >
                  <p className="text-sm font-semibold text-gray-600">{status}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {count}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((count / stats.totalEmployees) * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            ⚡ Quick Stats
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Avg Salary</span>
              <span className="font-bold text-gray-900">
                ₹
                {(
                  (users.reduce((sum, e) => sum + (Number(e.salary) || 0), 0) /
                    stats.totalEmployees) ||
                  0
                ).toFixed(0)}
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Avg Experience</span>
              <span className="font-bold text-gray-900">
                {(
                  users.reduce(
                    (sum, e) => sum + (Number(e.yearsOfExperience) || 0),
                    0
                  ) / stats.totalEmployees || 0
                ).toFixed(1)}{" "}
                yrs
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Departments</span>
              <span className="font-bold text-gray-900">
                {Object.keys(stats.byDepartment).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT EMPLOYEES */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          👤 Recently Added Employees
        </h2>
        {stats.recentActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No employees added yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Employee ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivities.map((emp, index) => (
                  <tr
                    key={emp.employeeId || index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {emp.name || emp.fullName}
                        </p>
                        <p className="text-xs text-indigo-600 font-bold">
                          ID: {emp.employeeId || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {emp.employeeId || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {emp.department || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          emp.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : emp.status === "Inactive"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {emp.status || "Active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER STATS */}
      <div className="mt-8 text-center text-gray-600 text-sm">
        <p>
          📊 Dashboard showing{" "}
          <span className="font-bold text-gray-800">
            {stats.totalEmployees}
          </span>{" "}
          employees across{" "}
          <span className="font-bold text-gray-800">
            {Object.keys(stats.byDepartment).length}
          </span>{" "}
          departments
        </p>
      </div>
    </div>
  );
}
