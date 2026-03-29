import { useState, useEffect } from "react";

export default function EmployeeOnboardingAndOffboarding() {
  const [onboardingQueue, setOnboardingQueue] = useState([]);
  const [completedTasks, setCompletedTasks] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const mockOnboarding = [
      {
        id: 1,
        employeeName: "John Smith",
        employeeId: "EMP-2026-042",
        startDate: "2026-04-01",
        department: "IT",
        position: "Senior Developer",
        status: "In Progress",
        progress: 65,
        tasks: [
          { id: 1, name: "Background Check", completed: true },
          { id: 2, name: "Document Verification", completed: true },
          { id: 3, name: "System Access Setup", completed: false },
          { id: 4, name: "IT Equipment Provision", completed: false },
          { id: 5, name: "orientation Training", completed: false },
        ],
      },
      {
        id: 2,
        employeeName: "Sarah Lee",
        employeeId: "EMP-2026-041",
        startDate: "2026-03-25",
        department: "HR",
        position: "HR Coordinator",
        status: "In Progress",
        progress: 85,
        tasks: [
          { id: 1, name: "Background Check", completed: true },
          { id: 2, name: "Document Verification", completed: true },
          { id: 3, name: "System Access Setup", completed: true },
          { id: 4, name: "IT Equipment Provision", completed: true },
          { id: 5, name: "Orientation Training", completed: false },
        ],
      },
      {
        id: 3,
        employeeName: "Mike David",
        employeeId: "EMP-2026-040",
        startDate: "2026-03-18",
        department: "Finance",
        position: "Financial Analyst",
        status: "Completed",
        progress: 100,
        tasks: [
          { id: 1, name: "Background Check", completed: true },
          { id: 2, name: "Document Verification", completed: true },
          { id: 3, name: "System Access Setup", completed: true },
          { id: 4, name: "IT Equipment Provision", completed: true },
          { id: 5, name: "Orientation Training", completed: true },
        ],
      },
    ];
    setOnboardingQueue(mockOnboarding);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const onboardingStats = {
    total: onboardingQueue.length,
    completed: onboardingQueue.filter((e) => e.status === "Completed").length,
    inProgress: onboardingQueue.filter((e) => e.status === "In Progress").length,
    avgProgress: Math.round(
      onboardingQueue.reduce((sum, e) => sum + e.progress, 0) / onboardingQueue.length
    ),
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Total Onboarding</p>
          <p className="text-3xl font-bold mt-1">{onboardingStats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Completed</p>
          <p className="text-3xl font-bold mt-1">{onboardingStats.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">In Progress</p>
          <p className="text-3xl font-bold mt-1">{onboardingStats.inProgress}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Avg Progress</p>
          <p className="text-3xl font-bold mt-1">{onboardingStats.avgProgress}%</p>
        </div>
      </div>

      {/* Add New Employee Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>➕</span> Initiate Onboarding
        </button>
      </div>

      {/* Onboarding Cards */}
      <div className="space-y-4">
        {onboardingQueue.map((emp) => (
          <div key={emp.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{emp.employeeName}</h3>
                <p className="text-sm text-gray-600">
                  {emp.position} • {emp.department} • Starts: {emp.startDate}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(emp.status)}`}>
                {emp.status}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-bold text-blue-600">{emp.progress}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                  style={{ width: `${emp.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Task Checklist */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">Onboarding Checklist:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {emp.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      readOnly
                      className="w-4 h-4"
                    />
                    <span className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-700"}`}>
                      {task.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-lg transition text-sm font-medium">
                📋 View Tasks
              </button>
              <button className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 rounded-lg transition text-sm font-medium">
                ✏️ Update Progress
              </button>
              <button className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 py-2 rounded-lg transition text-sm font-medium">
                📧 Send Reminder
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Onboarding Timeline */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Upcoming Onboarding Schedule</h2>
        <div className="space-y-3">
          {[
            { date: "2026-04-01", name: "John Smith", role: "Senior Developer" },
            { date: "2026-04-08", name: "Emma Wilson", role: "Data Analyst" },
            { date: "2026-04-15", name: "Robert Brown", role: "Content Writer" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                {item.date.split("-")[2]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">{item.role}</p>
              </div>
              <span className="text-sm text-gray-500">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
