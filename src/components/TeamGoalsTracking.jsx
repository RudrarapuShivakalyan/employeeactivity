import { useState, useEffect } from "react";

export default function TeamGoalsTracking() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "In Progress",
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem("teamGoals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(getMockGoals());
    }
  }, []);

  const getMockGoals = () => [
    {
      id: 1,
      title: "Q1 Sales Target",
      description: "Achieve 150% of quarterly sales target",
      progress: 85,
      dueDate: "2026-03-31",
      priority: "High",
      status: "In Progress",
      assignedTo: "Alice Johnson",
    },
    {
      id: 2,
      title: "Product Launch",
      description: "Launch new product version with enhanced features",
      progress: 60,
      dueDate: "2026-04-15",
      priority: "High",
      status: "In Progress",
      assignedTo: "Bob Smith",
    },
    {
      id: 3,
      title: "Team Training",
      description: "Complete advanced skills training program",
      progress: 40,
      dueDate: "2026-05-30",
      priority: "Medium",
      status: "In Progress",
      assignedTo: "Team",
    },
    {
      id: 4,
      title: "System Upgrade",
      description: "Upgrade infrastructure and security systems",
      progress: 100,
      dueDate: "2026-02-28",
      priority: "High",
      status: "Completed",
      assignedTo: "Carol White",
    },
  ];

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.dueDate) {
      alert("Please fill required fields");
      return;
    }

    const goal = {
      ...newGoal,
      id: Date.now(),
      progress: 0,
      assignedTo: "Team",
    };

    const updatedGoals = [...goals, goal];
    setGoals(updatedGoals);
    localStorage.setItem("teamGoals", JSON.stringify(updatedGoals));
    setNewGoal({ title: "", description: "", dueDate: "", priority: "Medium", status: "In Progress" });
    setShowModal(false);
  };

  const handleUpdateProgress = (id, progress) => {
    const updatedGoals = goals.map((g) =>
      g.id === id ? { ...g, progress: Math.min(progress, 100) } : g
    );
    setGoals(updatedGoals);
    localStorage.setItem("teamGoals", JSON.stringify(updatedGoals));
  };

  const handleDeleteGoal = (id) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      const updatedGoals = goals.filter((g) => g.id !== id);
      setGoals(updatedGoals);
      localStorage.setItem("teamGoals", JSON.stringify(updatedGoals));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "On Hold":
        return "bg-orange-100 text-orange-700";
      case "Not Started":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const daysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = due - today;
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Team Goals & Objectives</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <span>➕</span> Add New Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const daysLeft = daysUntilDue(goal.dueDate);
          const isOverdue = daysLeft < 0;

          return (
            <div key={goal.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{goal.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(goal.priority)}`}>
                  {goal.priority} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(goal.status)}`}>
                  {goal.status}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isOverdue ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>
                  {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-blue-600">{goal.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={goal.progress}
                  onChange={(e) => handleUpdateProgress(goal.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Goal Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Assigned To</p>
                  <p className="font-medium">{goal.assignedTo}</p>
                </div>
                <div>
                  <p className="text-gray-600">Due Date</p>
                  <p className="font-medium">{new Date(goal.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium">Just now</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Team Goal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Enter goal title"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Enter goal description"
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={newGoal.dueDate}
                    onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add Goal
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
