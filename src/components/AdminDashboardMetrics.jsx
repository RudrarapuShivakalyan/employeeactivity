import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalManagers: 0,
    totalAdmins: 0,
    activeEmployees: 0,
    totalActivities: 0,
    pendingActivities: 0,
    approvedActivities: 0,
    totalLoans: 0,
    approvedLoans: 0,
    pendingLoans: 0,
    departments: [],
    recentActivities: [],
    recentLoans: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  // ✅ FETCH STATISTICS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch employees
        const empRes = await fetch("http://localhost:5000/api/employees", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const employees = await empRes.json();

        // Fetch managers
        const managerRes = await fetch("http://localhost:5000/api/managers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const managers = await managerRes.json();

        // Fetch activities
        const actRes = await fetch("http://localhost:5000/api/employees/activities", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const activities = await actRes.json();

        // Fetch loans
        const loanRes = await fetch("http://localhost:5000/api/loans", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const loans = await loanRes.json();

        // Calculate statistics
        const activeEmps = employees.filter(e => e.status === "Active").length;
        const deptMap = {};
        employees.forEach(emp => {
          if (!deptMap[emp.department]) {
            deptMap[emp.department] = 0;
          }
          deptMap[emp.department]++;
        });

        const pendingActs = activities.filter(a => a.status === "pending").length;
        const approvedActs = activities.filter(a => a.status === "approved").length;
        const pendingL = loans.filter(l => l.status === "Pending").length;
        const approvedL = loans.filter(l => l.status === "Approved").length;

        setStats({
          totalEmployees: employees.length,
          totalManagers: managers.length,
          totalAdmins: 1,
          activeEmployees: activeEmps,
          totalActivities: activities.length,
          pendingActivities: pendingActs,
          approvedActivities: approvedActs,
          totalLoans: loans.length,
          approvedLoans: approvedL,
          pendingLoans: pendingL,
          departments: Object.entries(deptMap).map(([dept, count]) => ({ name: dept, count })),
          recentActivities: activities.slice(0, 5),
          recentLoans: loans.slice(0, 5)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Employee Card */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Employees</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</h3>
              <p className="text-sm text-green-600 mt-2">
                {stats.activeEmployees} Active
              </p>
            </div>
            <div className="text-4xl text-blue-500">👥</div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Activities</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalActivities}</h3>
              <p className="text-sm text-orange-600 mt-2">
                {stats.pendingActivities} Pending
              </p>
            </div>
            <div className="text-4xl text-orange-500">📋</div>
          </div>
        </div>

        {/* Loans Card */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Loans</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalLoans}</h3>
              <p className="text-sm text-purple-600 mt-2">
                {stats.pendingLoans} Pending
              </p>
            </div>
            <div className="text-4xl text-purple-500">💰</div>
          </div>
        </div>

        {/* Managers Card */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Team Managers</p>
              <h3 className="text-3xl font-bold text-gray-900">{stats.totalManagers}</h3>
              <p className="text-sm text-indigo-600 mt-2">
                Managing teams
              </p>
            </div>
            <div className="text-4xl text-indigo-500">🔧</div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Activities Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-900 mb-4">Activity Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved</span>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-green-500 w-32 rounded"></div>
                <span className="font-bold text-green-600">{stats.approvedActivities}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-orange-500 w-16 rounded"></div>
                <span className="font-bold text-orange-600">{stats.pendingActivities}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loans Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-900 mb-4">Loan Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Approved</span>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-green-500 w-24 rounded"></div>
                <span className="font-bold text-green-600">{stats.approvedLoans}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <div className="flex items-center gap-2">
                <div className="h-2 bg-purple-500 w-20 rounded"></div>
                <span className="font-bold text-purple-600">{stats.pendingLoans}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="font-bold text-gray-900 mb-4">Departments</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {stats.departments.map((dept, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{dept.name}</span>
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-semibold">
                  {dept.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button
          onClick={() => navigate('/admin?tab=employees')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition"
        >
          👥 Manage Employees
        </button>
        <button
          onClick={() => navigate('/admin?tab=activities')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition"
        >
          📋 View Activities
        </button>
        <button
          onClick={() => navigate('/admin?tab=loans')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition"
        >
          💰 Manage Loans
        </button>
        <button
          onClick={() => {
            const token = localStorage.getItem("token");
            const link = document.createElement("a");
            link.href = `http://localhost:5000/api/export/employees-csv`;
            link.setAttribute("Authorization", `Bearer ${token}`);
            link.setAttribute("target", "_blank");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition"
        >
          📥 Export Data
        </button>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> Recent Activities
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.recentActivities.length === 0 ? (
              <p className="text-gray-500 text-sm">No activities yet</p>
            ) : (
              stats.recentActivities.map((act, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 px-4 py-2 bg-gray-50 rounded">
                  <p className="text-sm font-bold text-gray-900">{act.description}</p>
                  <p className="text-xs text-gray-500">
                    {act.startTime} • Status: {act.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Loans Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💰</span> Recent Loan Applications
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.recentLoans.length === 0 ? (
              <p className="text-gray-500 text-sm">No loans yet</p>
            ) : (
              stats.recentLoans.map((loan, idx) => (
                <div key={idx} className="border-l-4 border-purple-500 px-4 py-2 bg-gray-50 rounded">
                  <p className="text-sm font-bold text-gray-900">
                    {loan.employeeName} - ₹{loan.loanAmount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {loan.loanType} • Status: {loan.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
