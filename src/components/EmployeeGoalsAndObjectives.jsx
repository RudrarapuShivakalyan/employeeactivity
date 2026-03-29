import { useState, useEffect } from "react";

export default function EmployeeGoalsAndObjectives() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "Professional",
    dueDate: "",
    priority: "Medium",
    status: "Not Started",
  });

  useEffect(() => {
    const mockGoals = [
      {
        id: 1,
        title: "Complete Advanced React Course",
        description: "Learn React Hooks and State Management",
        category: "Learning",
        progress: 75,
        dueDate: "2026-04-30",
        priority: "High",
        status: "In Progress",
        createdDate: "2026-03-01",
      },
      {
        id: 2,
        title: "Lead Project X to Completion",
        description: "Successfully deliver Project X on time",
        category: "Professional",
        progress: 60,
        dueDate: "2026-05-15",
        priority: "High",
        status: "In Progress",
        createdDate: "2026-02-15",
      },
      {
        id: 3,
        title: "Improve Code Quality",
        description: "Reduce code issues and improve testing coverage to 85%",
        category: "Professional",
        progress: 45,
        dueDate: "2026-06-30",
        priority: "Medium",
        status: "In Progress",
        createdDate: "2026-01-20",
      },
      {
        id: 4,
        title: "Mentor Junior Developer",
        description: "Guide and mentor a junior team member",
        category: "Leadership",
        progress: 30,
        dueDate: "2026-08-31",
        priority: "Low",
        status: "In Progress",
        createdDate: "2026-03-10",
      },
    ];
    setGoals(mockGoals);
  }, []);

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.dueDate) {
      alert("Please fill required fields");
      return;
    }

    const goal = {
      ...newGoal,
      id: Date.now(),
      progress: 0,
      createdDate: new Date().toISOString().split('T')[0],
    };

    setGoals([goal, ...goals]);
    setNewGoal({ title: "", description: "", category: "Professional", dueDate: "", priority: "Medium", status: "Not Started" });
    setShowModal(false);
    alert("✅ Goal added successfully!");
  };

  const handleUpdateProgress = (id, progress) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, progress: Math.min(progress, 100) } : g)));
  };

  const handleDeleteGoal = (id) => {
    if (confirm("Delete this goal?")) {
      setGoals(goals.filter((g) => g.id !== id));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-orange-100 text-orange-700";
      case "Low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "On Hold": return "bg-orange-100 text-orange-700";
      case "Not Started": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const daysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = due - today;
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const stats = {
    totalGoals: goals.length,
    completed: goals.filter((g) => g.status === "Completed").length,
    inProgress: goals.filter((g) => g.status === "In Progress").length,
    onHold: goals.filter((g) => g.status === "On Hold").length,
    avgProgress: goals.length > 0 ? Math.round(goals.reduce((a, b) => a + b.progress, 0) / goals.length) : 0,
  };

  return (
    <div className="space-y-6">
      {/* Goals Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-700">Total Goals</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{stats.totalGoals}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-700">Completed</p>
          <p className="text-3xl font-bold text-green-700 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-700">In Progress</p>
          <p className="text-3xl font-bold text-purple-700 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg text-center">
          <p className="text-sm text-gray-700">On Hold</p>
          <p className="text-3xl font-bold text-orange-700 mt-1">{stats.onHold}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-lg text-center">
          <p className="text-sm opacity-90">Avg Progress</p>
          <p className="text-3xl font-bold mt-1">{stats.avgProgress}%</p>
        </div>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-end">
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
            <div key={goal.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(goal.priority)}`}>
                  {goal.priority} Priority
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(goal.status)}`}>
                  {goal.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {goal.category}
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
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="font-medium">{new Date(goal.createdDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="font-medium">{new Date(goal.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium">{goal.category}</p>
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
            <h2 className="text-xl font-bold mb-4">Add New Goal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What do you want to achieve?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Briefly describe your goal"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Professional">Professional</option>
                    <option value="Learning">Learning</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Personal">Personal</option>
                  </select>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  value={newGoal.dueDate}
                  onChange={(e) => setNewGoal({ ...newGoal, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
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
