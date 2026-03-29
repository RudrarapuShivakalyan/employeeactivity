import { useState, useEffect } from "react";

export default function TeamMemberManagement() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const manager = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchTeamMembers();
  }, [manager?.department]);

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/employees?department=${encodeURIComponent(manager?.department)}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTeamMembers(Array.isArray(data) ? data : []);
      } else {
        setTeamMembers(getMockTeamMembers());
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
      setTeamMembers(getMockTeamMembers());
    } finally {
      setLoading(false);
    }
  };

  const getMockTeamMembers = () => [
    { id: 1, name: "John Doe", role: "Senior Developer", email: "john@example.com", status: "Active", joinDate: "2023-01-15", tasksAssigned: 5 },
    { id: 2, name: "Jane Smith", role: "UI/UX Designer", email: "jane@example.com", status: "Active", joinDate: "2023-03-20", tasksAssigned: 3 },
    { id: 3, name: "Mike Johnson", role: "Junior Developer", email: "mike@example.com", status: "On Leave", joinDate: "2024-01-10", tasksAssigned: 2 },
  ];

  const handleAssignTask = (member) => {
    const task = prompt("Enter new task:");
    if (task) {
      alert(`Task "${task}" assigned to ${member.name}`);
    }
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setEditMode(true);
  };

  const handleSaveMember = () => {
    if (selectedMember) {
      setTeamMembers(teamMembers.map((m) => (m.id === selectedMember.id ? selectedMember : m)));
      setEditMode(false);
      setSelectedMember(null);
      alert("Member updated successfully");
    }
  };

  const filteredMembers = filterDepartment === "all" 
    ? teamMembers 
    : teamMembers.filter((m) => m.department === filterDepartment);

  if (loading) {
    return <div className="text-center p-4">Loading team members...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search member..."
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Departments</option>
          <option value="Engineering">Engineering</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
        </select>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Tasks</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3 text-gray-600">{member.role}</td>
                  <td className="px-4 py-3 text-blue-600 text-sm">{member.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      {member.tasksAssigned || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => handleEditMember(member)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleAssignTask(member)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Member Modal */}
      {editMode && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Edit Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedMember.name}
                  onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={selectedMember.role}
                  onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedMember.status}
                  onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveMember}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
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
