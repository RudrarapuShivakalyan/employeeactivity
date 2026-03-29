import { useState, useEffect } from "react";

export default function AdvancedActivityApprovals() {
  const [teamActivities, setTeamActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // list, detail, workflow, riskassessment
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [approvalModal, setApprovalModal] = useState(false);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const manager = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchTeamActivities();
  }, [manager?.department, filterStatus]);

  const fetchTeamActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/employees/activities?department=${encodeURIComponent(manager?.department)}&status=${filterStatus}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTeamActivities(Array.isArray(data) ? data : []);
      } else {
        setTeamActivities(getMockActivities());
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setTeamActivities(getMockActivities());
    } finally {
      setLoading(false);
    }
  };

  const getMockActivities = () => [
    {
      id: 1,
      employeeName: "John Doe",
      department: "Engineering",
      description: "Database optimization project",
      projectName: "Project Alpha",
      startTime: "2026-03-20",
      priority: "High",
      status: "pending",
      riskScore: 2,
      hours: 8,
      approvalLevel: 1,
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      department: "Engineering",
      description: "API development tasks",
      projectName: "Project Beta",
      startTime: "2026-03-21",
      priority: "Medium",
      status: "pending",
      riskScore: 1,
      hours: 6,
      approvalLevel: 1,
    },
    {
      id: 3,
      employeeName: "Mike Johnson",
      department: "Engineering",
      description: "Client presentation preparation",
      projectName: "Project Gamma",
      startTime: "2026-03-22",
      priority: "Low",
      status: "pending",
      riskScore: 0,
      hours: 4,
      approvalLevel: 1,
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-700";
      case "Medium": return "bg-orange-100 text-orange-700";
      case "Low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 3) return { level: "High Risk", color: "bg-red-100 text-red-700", icon: "🔴" };
    if (score >= 1) return { level: "Medium Risk", color: "bg-orange-100 text-orange-700", icon: "🟠" };
    return { level: "Low Risk", color: "bg-green-100 text-green-700", icon: "🟢" };
  };

  const handleSelectActivity = (id) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(filteredActivities.map((a) => a.id));
    }
  };

  const handleBulkApprove = async (conditions = null) => {
    try {
      const token = localStorage.getItem("token");
      for (const id of selectedActivities) {
        await fetch(`http://localhost:5000/api/employees/activities/${id}/approve`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ conditions, approvedBy: manager.name }),
        });
      }

      setTeamActivities((prev) =>
        prev.map((a) =>
          selectedActivities.includes(a.id) ? { ...a, status: "approved" } : a
        )
      );
      setSelectedActivities([]);
      alert(`✅ ${selectedActivities.length} activities approved!`);
    } catch (error) {
      console.error("Error bulk approving:", error);
    }
  };

  const handleBulkReject = async (reason = "") => {
    try {
      const token = localStorage.getItem("token");
      for (const id of selectedActivities) {
        await fetch(`http://localhost:5000/api/employees/activities/${id}/reject`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ remarks: reason, rejectedBy: manager.name }),
        });
      }

      setTeamActivities((prev) =>
        prev.map((a) =>
          selectedActivities.includes(a.id) ? { ...a, status: "rejected", remarks: reason } : a
        )
      );
      setSelectedActivities([]);
      alert(`❌ ${selectedActivities.length} activities rejected!`);
    } catch (error) {
      console.error("Error bulk rejecting:", error);
    }
  };

  const handleApproveWithConditions = (activity) => {
    setSelectedActivity(activity);
    setApprovalModal(true);
  };

  const filteredActivities = teamActivities
    .filter((a) => filterPriority === "all" || a.priority === filterPriority)
    .filter((a) => a.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   a.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityMap = { High: 3, Medium: 2, Low: 1 };
        return priorityMap[b.priority] - priorityMap[a.priority];
      }
      if (sortBy === "risk") return b.riskScore - a.riskScore;
      return new Date(b.startTime) - new Date(a.startTime);
    });

  const stats = {
    pending: teamActivities.filter((a) => a.status === "pending").length,
    approved: teamActivities.filter((a) => a.status === "approved").length,
    rejected: teamActivities.filter((a) => a.status === "rejected").length,
    highRisk: teamActivities.filter((a) => a.riskScore >= 3).length,
  };

  if (loading) {
    return <div className="text-center p-8">Loading approvals...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-700">Pending</p>
          <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-700">Approved</p>
          <p className="text-3xl font-bold text-green-700">{stats.approved}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-700">Rejected</p>
          <p className="text-3xl font-bold text-red-700">{stats.rejected}</p>
        </div>
        <div className="bg-red-200 p-4 rounded-lg shadow">
          <p className="text-sm text-gray-700">High Risk</p>
          <p className="text-3xl font-bold text-red-800">{stats.highRisk}</p>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white p-4 rounded-lg shadow flex gap-2 overflow-x-auto">
        {[
          { id: "list", label: "📋 List View", icon: "📋" },
          { id: "workflow", label: "🔄 Workflow", icon: "🔄" },
          { id: "riskassessment", label: "⚠️ Risk Assessment", icon: "⚠️" },
          { id: "detail", label: "🔍 Detail Analysis", icon: "🔍" },
        ].map((mode) => (
          <button
            key={mode.id}
            onClick={() => setViewMode(mode.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
              viewMode === mode.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Status</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="risk">Sort by Risk</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedActivities.length > 0 && (
          <div className="flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="font-medium text-blue-900">{selectedActivities.length} selected</span>
            <button
              onClick={() => handleBulkApprove()}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
            >
              ✅ Approve All
            </button>
            <button
              onClick={() => {
                const reason = prompt("Enter rejection reason:");
                if (reason) handleBulkReject(reason);
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
            >
              ❌ Reject All
            </button>
            <button
              onClick={() => setSelectedActivities([])}
              className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500 transition"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <input
              type="checkbox"
              checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-700">Select All</span>
          </div>

          {filteredActivities.map((activity) => {
            const riskInfo = getRiskLevel(activity.riskScore);
            return (
              <div
                key={activity.id}
                className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition"
              >
                <div className="flex gap-4 items-start">
                  <input
                    type="checkbox"
                    checked={selectedActivities.includes(activity.id)}
                    onChange={() => handleSelectActivity(activity.id)}
                    className="w-4 h-4 mt-1 cursor-pointer"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{activity.employeeName}</h3>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${riskInfo.color}`}>
                          {riskInfo.icon} {riskInfo.level}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600 my-2">
                      <div>Project: {activity.projectName}</div>
                      <div>Hours: {activity.hours}h</div>
                      <div>Date: {new Date(activity.startTime).toLocaleDateString()}</div>
                      <div>Level: {activity.approvalLevel}</div>
                    </div>

                    {activity.status === "pending" && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleApproveWithConditions(activity)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition flex items-center gap-1"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt("Enter rejection reason:");
                            if (reason) {
                              setTeamActivities((prev) =>
                                prev.map((a) =>
                                  a.id === activity.id ? { ...a, status: "rejected", remarks: reason } : a
                                )
                              );
                            }
                          }}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition flex items-center gap-1"
                        >
                          ❌ Reject
                        </button>
                        <button
                          onClick={() => {
                            setSelectedActivity(activity);
                            setViewMode("workflow");
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition flex items-center gap-1"
                        >
                          🔄 Workflow
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Workflow View */}
      {viewMode === "workflow" && (
        <ApprovalWorkflowView activities={filteredActivities} selectedActivity={selectedActivity} />
      )}

      {/* Risk Assessment View */}
      {viewMode === "riskassessment" && (
        <RiskAssessmentView activities={filteredActivities} onApprove={handleBulkApprove} />
      )}

      {/* Approval with Conditions Modal */}
      {approvalModal && selectedActivity && (
        <ApprovalConditionsModal
          activity={selectedActivity}
          onApprove={(conditions) => {
            handleBulkApprove(conditions);
            setApprovalModal(false);
          }}
          onClose={() => setApprovalModal(false)}
        />
      )}
    </div>
  );
}

// Approval Workflow Component
function ApprovalWorkflowView({ activities, selectedActivity }) {
  const [currentActivity, setCurrentActivity] = useState(selectedActivity || activities[0]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Activity List */}
      <div className="col-span-1 bg-white rounded-lg shadow p-4 max-h-96 overflow-y-auto">
        <h3 className="font-bold mb-3 text-gray-800">Activities</h3>
        <div className="space-y-2">
          {activities.map((a) => (
            <button
              key={a.id}
              onClick={() => setCurrentActivity(a)}
              className={`w-full p-3 rounded text-left text-sm transition ${
                currentActivity?.id === a.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              <p className="font-medium">{a.employeeName}</p>
              <p className="text-xs opacity-75">{a.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Timeline */}
      <div className="col-span-2 bg-white rounded-lg shadow p-6">
        <h3 className="font-bold text-lg mb-6 text-gray-800">Approval Workflow</h3>

        {currentActivity && (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <p className="font-medium text-gray-800">{currentActivity.employeeName}</p>
              <p className="text-sm text-gray-600">{currentActivity.description}</p>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {[
                { stage: 1, name: "Submitted", status: "completed", time: "2 hours ago" },
                { stage: 2, name: "Manager Review", status: "current", time: "In Progress" },
                { stage: 3, name: "Director Approval", status: "pending", time: "Waiting" },
                { stage: 4, name: "Final Approval", status: "pending", time: "Waiting" },
              ].map((item) => (
                <div key={item.stage} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        item.status === "completed"
                          ? "bg-green-500 text-white"
                          : item.status === "current"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {item.stage}
                    </div>
                    {item.stage < 4 && (
                      <div
                        className={`w-1 h-8 ${
                          item.status !== "pending" ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                  <div className="pt-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                ✅ Approve & Forward
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                ❌ Reject with Feedback
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Risk Assessment Component
function RiskAssessmentView({ activities, onApprove }) {
  const highRiskActivities = activities.filter((a) => a.riskScore >= 3);
  const mediumRiskActivities = activities.filter((a) => a.riskScore >= 1 && a.riskScore < 3);
  const lowRiskActivities = activities.filter((a) => a.riskScore < 1);

  const RiskGroup = ({ risk, title, color, activities: items }) => (
    <div className={`${color} p-6 rounded-lg shadow-md`}>
      <h3 className="font-bold text-lg mb-4">{title} ({items.length})</h3>
      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="bg-white p-3 rounded">
            <p className="font-medium text-gray-800">{a.employeeName}</p>
            <p className="text-sm text-gray-600">{a.description}</p>
            <p className="text-xs text-gray-500 mt-1">Risk Score: {a.riskScore}/10</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <RiskGroup
        risk="high"
        title="🔴 High Risk"
        color="bg-red-50 border-l-4 border-red-500"
        activities={highRiskActivities}
      />
      <RiskGroup
        risk="medium"
        title="🟠 Medium Risk"
        color="bg-orange-50 border-l-4 border-orange-500"
        activities={mediumRiskActivities}
      />
      <RiskGroup
        risk="low"
        title="🟢 Low Risk"
        color="bg-green-50 border-l-4 border-green-500"
        activities={lowRiskActivities}
      />
    </div>
  );
}

// Approval with Conditions Modal
function ApprovalConditionsModal({ activity, onApprove, onClose }) {
  const [conditions, setConditions] = useState({
    requiresFollowup: false,
    hoursLimit: 8,
    needsDocumentation: false,
    requiresSignoff: false,
    scheduleDate: "",
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Approving with Conditions</h2>
        <p className="text-gray-600 mb-4">{activity.employeeName} - {activity.description}</p>

        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={conditions.requiresFollowup}
              onChange={(e) => setConditions({ ...conditions, requiresFollowup: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Requires Follow-up</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hours Limit</label>
            <input
              type="number"
              value={conditions.hoursLimit}
              onChange={(e) => setConditions({ ...conditions, hoursLimit: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={conditions.needsDocumentation}
              onChange={(e) => setConditions({ ...conditions, needsDocumentation: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Needs Documentation</span>
          </label>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={conditions.requiresSignoff}
              onChange={(e) => setConditions({ ...conditions, requiresSignoff: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Requires Executive Sign-off</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Schedule for Date (Optional)</label>
            <input
              type="date"
              value={conditions.scheduleDate}
              onChange={(e) => setConditions({ ...conditions, scheduleDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-6 mt-6 border-t">
          <button
            onClick={() => onApprove(conditions)}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
          >
            ✅ Approve with Conditions
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
