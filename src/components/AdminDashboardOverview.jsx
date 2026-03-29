import { useState, useEffect } from "react";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showPayrollStatus, setShowPayrollStatus] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showApprovals, setShowApprovals] = useState(false);

  useEffect(() => {
    const mockStats = {
      totalEmployees: 42,
      activeEmployees: 38,
      inactiveEmployees: 4,
      totalDepartments: 6,
      totalManagers: 8,
      hireThisMonth: 5,
      leaveThisMonth: 2,
      pendingApprovals: 12,
      totalLoans: 15,
      approvedLoans: 10,
      pendingLoans: 5,
      payrollProcessed: 42,
      averageSalary: 750000,
    };
    setStats(mockStats);
  }, []);

  // ✅ HANDLER FUNCTIONS
  const handleAddEmployee = () => {
    setShowAddEmployee(true);
  };

  const handleProcessPayroll = () => {
    setShowPayrollStatus(true);
  };

  const handleViewReports = () => {
    setShowReports(true);
  };

  const handleApproveItems = () => {
    setShowApprovals(true);
  };

  const StatCard = ({ icon, label, value, trend, color }) => (
    <div className={`bg-gradient-to-br ${color} text-white p-6 rounded-lg shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl opacity-80">{icon}</span>
      </div>
      {trend && <p className="text-xs opacity-90 mt-2">📈 {trend}</p>}
    </div>
  );

  if (!stats) return <div className="text-center p-8">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Total Employees"
          value={stats.totalEmployees}
          trend={`${stats.activeEmployees} active`}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon="🏢"
          label="Departments"
          value={stats.totalDepartments}
          trend={`${stats.totalManagers} managers`}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon="📋"
          label="Pending Approvals"
          value={stats.pendingApprovals}
          trend="Require action"
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          icon="💰"
          label="Loans"
          value={stats.totalLoans}
          trend={`${stats.approvedLoans} approved`}
          color="from-green-500 to-green-600"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <p className="text-gray-600 text-sm">Hired This Month</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{stats.hireThisMonth}</p>
          <p className="text-xs text-gray-500 mt-2">👤 New employees onboarded</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <p className="text-gray-600 text-sm">Payroll Status</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{stats.payrollProcessed}</p>
          <p className="text-xs text-gray-500 mt-2">✓ All processed</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
          <p className="text-gray-600 text-sm">Average Salary</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">₹{(stats.averageSalary / 100000).toFixed(1)}L</p>
          <p className="text-xs text-gray-500 mt-2">Per employee annually</p>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Department Overview</h2>
        <div className="space-y-3">
          {[
            { dept: "IT", count: 12, color: "bg-blue-500" },
            { dept: "HR", count: 5, color: "bg-purple-500" },
            { dept: "Finance", count: 8, color: "bg-green-500" },
            { dept: "Sales", count: 10, color: "bg-orange-500" },
            { dept: "Marketing", count: 4, color: "bg-pink-500" },
            { dept: "Operations", count: 3, color: "bg-indigo-500" },
          ].map((dept, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-24 font-medium text-gray-700">{dept.dept}</span>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <div
                  className={`h-full ${dept.color} flex items-center justify-end pr-3 text-white text-sm font-bold`}
                  style={{ width: `${(dept.count / 12) * 100}%` }}
                >
                  {dept.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={handleAddEmployee}
            className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition active:scale-95">
            <p className="text-2xl mb-2">➕</p>
            <p className="text-sm font-medium text-blue-700">Add Employee</p>
          </button>
          <button 
            onClick={handleProcessPayroll}
            className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition active:scale-95">
            <p className="text-2xl mb-2">📝</p>
            <p className="text-sm font-medium text-green-700">Process Payroll</p>
          </button>
          <button 
            onClick={handleViewReports}
            className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition active:scale-95">
            <p className="text-2xl mb-2">📋</p>
            <p className="text-sm font-medium text-purple-700">View Reports</p>
          </button>
          <button 
            onClick={handleApproveItems}
            className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition active:scale-95">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-sm font-medium text-orange-700">Approve Items</p>
          </button>
        </div>
      </div>

      {/* MODALS */}

      {/* Add Employee Modal */}
      {showAddEmployee && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">➕ Add New Employee</h3>
            <div className="space-y-3 mb-6">
              <input type="text" placeholder="Employee Name" className="w-full p-2 border rounded-lg" />
              <input type="email" placeholder="Email" className="w-full p-2 border rounded-lg" />
              <input type="text" placeholder="Department" className="w-full p-2 border rounded-lg" />
              <input type="number" placeholder="Salary" className="w-full p-2 border rounded-lg" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAddEmployee(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancel</button>
              <button onClick={() => { alert("✅ Employee added!"); setShowAddEmployee(false); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Status Modal */}
      {showPayrollStatus && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">📝 Payroll Processing Status</h3>
            <div className="space-y-3 mb-6 text-gray-700">
              <p>✅ {stats?.payrollProcessed} employees - Salary processed</p>
              <p>💰 Total amount: ₹{((stats?.payrollProcessed * stats?.averageSalary) / 100000).toFixed(1)}L</p>
              <p>📅 Current month: March 2026</p>
              <p>🔄 Status: Ready for bank transfer</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPayrollStatus(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Close</button>
              <button onClick={() => { alert("✅ Payroll processed!"); setShowPayrollStatus(false); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Process</button>
            </div>
          </div>
        </div>
      )}

      {/* Reports Modal */}
      {showReports && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">📋 Available Reports</h3>
            <div className="space-y-2 mb-6">
              <button className="w-full p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left">📊 HR Analytics Report</button>
              <button className="w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left">💼 Employee Demographics</button>
              <button className="w-full p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left">💰 Payroll Summary</button>
              <button className="w-full p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left">📈 Department Performance</button>
            </div>
            <button onClick={() => setShowReports(false)} className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Close</button>
          </div>
        </div>
      )}

      {/* Approvals Modal */}
      {showApprovals && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">✅ Pending Approvals ({stats?.pendingApprovals})</h3>
            <div className="space-y-3 mb-6 text-sm">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-medium">Loan Application - John Smith</p>
                <p className="text-xs text-gray-600">Amount: ₹500,000</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-medium">Leave Request - Sarah Johnson</p>
                <p className="text-xs text-gray-600">Duration: 5 days</p>
              </div>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-medium">Project Allocation - Mike Wilson</p>
                <p className="text-xs text-gray-600">Project: New System Development</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowApprovals(false)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Close</button>
              <button onClick={() => { alert("✅ All approvals reviewed!"); setShowApprovals(false); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
