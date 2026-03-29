import { useState, useEffect } from "react";

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showPayrollStatus, setShowPayrollStatus] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showApprovals, setShowApprovals] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

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
    setSelectedReport(null);
  };

  const handleApproveItems = () => {
    setShowApprovals(true);
  };

  // ✅ REPORT HANDLERS
  const handleHRAnalytics = () => {
    setSelectedReport("hrAnalytics");
  };

  const handleEmployeeDemographics = () => {
    setSelectedReport("demographics");
  };

  const handlePayrollSummary = () => {
    setSelectedReport("payroll");
  };

  const handleDepartmentPerformance = () => {
    setSelectedReport("department");
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
      {showReports && !selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">📋 Available Reports</h3>
            <div className="space-y-2 mb-6">
              <button 
                onClick={handleHRAnalytics}
                className="w-full p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left font-medium text-purple-700 transition active:scale-95">
                📊 HR Analytics Report
              </button>
              <button 
                onClick={handleEmployeeDemographics}
                className="w-full p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left font-medium text-blue-700 transition active:scale-95">
                💼 Employee Demographics
              </button>
              <button 
                onClick={handlePayrollSummary}
                className="w-full p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left font-medium text-green-700 transition active:scale-95">
                💰 Payroll Summary
              </button>
              <button 
                onClick={handleDepartmentPerformance}
                className="w-full p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left font-medium text-orange-700 transition active:scale-95">
                📈 Department Performance
              </button>
            </div>
            <button onClick={() => setShowReports(false)} className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Close</button>
          </div>
        </div>
      )}

      {/* HR Analytics Report */}
      {selectedReport === "hrAnalytics" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-96 overflow-auto">
            <h3 className="text-xl font-bold mb-4">📊 HR Analytics Report</h3>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-3xl font-bold text-blue-600">{stats?.totalEmployees}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-3xl font-bold text-green-600">{stats?.activeEmployees}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Managers</p>
                  <p className="text-3xl font-bold text-purple-600">{stats?.totalManagers}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="text-3xl font-bold text-orange-600">{stats?.totalDepartments}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-700 mb-2">Monthly Trends:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Hired this month: {stats?.hireThisMonth}</li>
                  <li>✓ On leave this month: {stats?.leaveThisMonth}</li>
                  <li>✓ Attrition rate: 2.3%</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedReport(null)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Back</button>
              <button onClick={() => { alert("✅ HR Analytics Report downloaded!"); setShowReports(false); setSelectedReport(null); }} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">📥 Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Employee Demographics Report */}
      {selectedReport === "demographics" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-96 overflow-auto">
            <h3 className="text-xl font-bold mb-4">💼 Employee Demographics</h3>
            <div className="space-y-4 mb-6">
              <div className="border-b pb-3">
                <p className="font-semibold text-gray-700 mb-2">Department Breakdown:</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>IT & Technology</span><span>12 employees</span></div>
                  <div className="flex justify-between"><span>Human Resources</span><span>5 employees</span></div>
                  <div className="flex justify-between"><span>Finance</span><span>8 employees</span></div>
                  <div className="flex justify-between"><span>Sales</span><span>10 employees</span></div>
                  <div className="flex justify-between"><span>Marketing</span><span>4 employees</span></div>
                  <div className="flex justify-between"><span>Operations</span><span>3 employees</span></div>
                </div>
              </div>
              <div className="border-b pb-3">
                <p className="font-semibold text-gray-700 mb-2">Gender Distribution:</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>Male</span><span>58%</span></div>
                  <div className="flex justify-between"><span>Female</span><span>42%</span></div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-2">Experience Level:</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between"><span>0-2 years</span><span>15 employees</span></div>
                  <div className="flex justify-between"><span>2-5 years</span><span>18 employees</span></div>
                  <div className="flex justify-between"><span>5+ years</span><span>9 employees</span></div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedReport(null)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Back</button>
              <button onClick={() => { alert("✅ Demographics Report downloaded!"); setShowReports(false); setSelectedReport(null); }} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">📥 Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Summary Report */}
      {selectedReport === "payroll" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-96 overflow-auto">
            <h3 className="text-xl font-bold mb-4">💰 Payroll Summary Report</h3>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Total Payroll Cost</p>
                  <p className="text-2xl font-bold text-green-600">₹{((stats?.payrollProcessed * stats?.averageSalary) / 10000000).toFixed(1)}Cr</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Employees Paid</p>
                  <p className="text-2xl font-bold text-blue-600">{stats?.payrollProcessed}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-700 mb-2">March 2026 Summary:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✓ Average salary: ₹{(stats?.averageSalary / 100000).toFixed(0)}L</li>
                  <li>✓ Total deductions: ₹4,85,000</li>
                  <li>✓ Gross payout: ₹31.5Cr</li>
                  <li>✓ Status: Processed & Ready for transfer</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedReport(null)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Back</button>
              <button onClick={() => { alert("✅ Payroll Summary Report downloaded!"); setShowReports(false); setSelectedReport(null); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">📥 Download</button>
            </div>
          </div>
        </div>
      )}

      {/* Department Performance Report */}
      {selectedReport === "department" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-96 overflow-auto">
            <h3 className="text-xl font-bold mb-4">📈 Department Performance Report</h3>
            <div className="space-y-3 mb-6">
              {[
                { dept: "IT & Technology", target: 95, actual: 92, status: "On Track" },
                { dept: "Sales", target: 100, actual: 108, status: "Exceeding" },
                { dept: "Finance", target: 90, actual: 88, status: "Below Target" },
                { dept: "HR", target: 85, actual: 86, status: "On Track" },
                { dept: "Marketing", target: 80, actual: 82, status: "On Track" },
                { dept: "Operations", target: 90, actual: 91, status: "Exceeding" },
              ].map((dept, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{dept.dept}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${dept.status === 'On Track' ? 'bg-green-100 text-green-700' : dept.status === 'Exceeding' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {dept.status}
                    </span>
                  </div>
                  <div className="flex gap-2 text-sm text-gray-600">
                    <span>Target: {dept.target}%</span>
                    <span>Actual: {dept.actual}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedReport(null)} className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Back</button>
              <button onClick={() => { alert("✅ Department Performance Report downloaded!"); setShowReports(false); setSelectedReport(null); }} className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">📥 Download</button>
            </div>
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
