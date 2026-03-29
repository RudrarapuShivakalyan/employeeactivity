import { useState, useEffect } from "react";

export default function DepartmentAndResourceManagement() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    head: "",
    members: "",
    budget: "",
    status: "Active",
  });

  useEffect(() => {
    const mockDepts = [
      {
        id: 1,
        name: "IT & Technology",
        head: "Sarah Johnson",
        members: 12,
        budget: 2400000,
        allocatedBudget: 1850000,
        status: "Active",
        hires: 3,
        turnover: 0,
      },
      {
        id: 2,
        name: "Human Resources",
        head: "Mike Wilson",
        members: 5,
        budget: 900000,
        allocatedBudget: 750000,
        status: "Active",
        hires: 5,
        turnover: 1,
      },
      {
        id: 3,
        name: "Finance",
        head: "Emily Davis",
        members: 8,
        budget: 1600000,
        allocatedBudget: 1200000,
        status: "Active",
        hires: 2,
        turnover: 0,
      },
      {
        id: 4,
        name: "Sales",
        head: "John Smith",
        members: 10,
        budget: 2000000,
        allocatedBudget: 1500000,
        status: "Active",
        hires: 0,
        turnover: 1,
      },
      {
        id: 5,
        name: "Marketing",
        head: "Lisa Anderson",
        members: 4,
        budget: 800000,
        allocatedBudget: 600000,
        status: "Active",
        hires: 0,
        turnover: 0,
      },
      {
        id: 6,
        name: "Operations",
        head: "David Lee",
        members: 3,
        budget: 600000,
        allocatedBudget: 450000,
        status: "Active",
        hires: 0,
        turnover: 0,
      },
    ];
    setDepartments(mockDepts);
  }, []);

  const handleAddDept = () => {
    if (!newDept.name || !newDept.head) {
      alert("Please fill required fields");
      return;
    }
    alert("✅ Department added successfully!");
    setNewDept({ name: "", head: "", members: "", budget: "", status: "Active" });
    setShowModal(false);
  };

  const totalEmployees = departments.reduce((sum, dept) => sum + dept.members, 0);
  const totalBudget = departments.reduce((sum, dept) => sum + dept.budget, 0);
  const totalAllocated = departments.reduce((sum, dept) => sum + dept.allocatedBudget, 0);
  const totalHires = departments.reduce((sum, dept) => sum + dept.hires, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Total Departments</p>
          <p className="text-3xl font-bold mt-1">{departments.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Total Employees</p>
          <p className="text-3xl font-bold mt-1">{totalEmployees}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Total Budget</p>
          <p className="text-2xl font-bold mt-1">₹{(totalBudget / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">New Hires This Month</p>
          <p className="text-3xl font-bold mt-1">{totalHires}</p>
        </div>
      </div>

      {/* Add Department Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>➕</span> Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map((dept) => {
          const budgetUsage = (dept.allocatedBudget / dept.budget) * 100;
          const perHeadBudget = Math.round(dept.budget / dept.members);

          return (
            <div key={dept.id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{dept.name}</h3>
                  <p className="text-sm text-gray-600">Head: {dept.head}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {dept.status}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Members</p>
                  <p className="text-2xl font-bold text-blue-700">{dept.members}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Per Head</p>
                  <p className="text-sm font-bold text-green-700">₹{perHeadBudget / 1000}K</p>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Hires</p>
                  <p className="text-2xl font-bold text-orange-700">{dept.hires}</p>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Turnover</p>
                  <p className="text-2xl font-bold text-red-700">{dept.turnover}</p>
                </div>
              </div>

              {/* Budget Usage */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
                  <span className="text-sm font-bold text-blue-600">{budgetUsage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    style={{ width: `${budgetUsage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ₹{dept.allocatedBudget.toLocaleString()} / ₹{dept.budget.toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg transition text-sm font-medium">
                  👥 View Team
                </button>
                <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg transition text-sm font-medium">
                  ✏️ Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Budget Overview</h2>
        <div className="space-y-3">
          {departments.map((dept) => {
            const budgetUsage = (dept.allocatedBudget / dept.budget) * 100;
            return (
              <div key={dept.id} className="flex items-center gap-4">
                <span className="w-32 font-medium text-gray-700 text-sm">{dept.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-end pr-2 text-white text-xs font-bold"
                    style={{ width: `${budgetUsage}%` }}
                  >
                    {budgetUsage > 20 && `${budgetUsage.toFixed(0)}%`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Department Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Department</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name *</label>
                <input
                  type="text"
                  value={newDept.name}
                  onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., IT & Technology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Head *</label>
                <input
                  type="text"
                  value={newDept.head}
                  onChange={(e) => setNewDept({ ...newDept, head: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Employee name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Initial Budget</label>
                <input
                  type="number"
                  value={newDept.budget}
                  onChange={(e) => setNewDept({ ...newDept, budget: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Annual budget"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddDept}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
