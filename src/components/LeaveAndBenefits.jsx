import { useState, useEffect } from "react";

export default function LeaveAndBenefits() {
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [benefits, setBenefits] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    type: "Annual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    const mockLeaveBalance = {
      annualLeave: 12,
      annualLeaveUsed: 4,
      sickLeave: 5,
      sickLeaveUsed: 1,
      maternityLeave: 0,
      maternityLeaveUsed: 0,
      casualLeave: 3,
      casualLeaveUsed: 1,
    };

    const mockBenefits = [
      { id: 1, name: "Health Insurance", status: "Active", provider: "XYZ Insurance Co.", coverage: "Comprehensive" },
      { id: 2, name: "Dental Coverage", status: "Active", provider: "Dental Plus", coverage: "Basic + Specialist" },
      { id: 3, name: "Pension Plan", status: "Active", contribution: "5% + Employer match" },
      { id: 4, name: "Life Insurance", status: "Active", coverage: "2x Annual Salary" },
      { id: 5, name: "Wellness Program", status: "Active", benefits: "Gym membership + Health checkups" },
    ];

    const mockRequests = [
      { id: 1, type: "Annual Leave", from: "2026-04-10", to: "2026-04-15", days: 5, status: "Approved", reason: "Personal holiday" },
      { id: 2, type: "Sick Leave", from: "2026-03-25", to: "2026-03-26", days: 2, status: "Approved", reason: "Medical appointment" },
      { id: 3, type: "Casual Leave", from: "2026-03-20", to: "2026-03-20", days: 1, status: "Pending", reason: "Family emergency" },
    ];

    setLeaveBalance(mockLeaveBalance);
    setBenefits(mockBenefits);
    setLeaveRequests(mockRequests);
  }, []);

  const handleRequestLeave = () => {
    if (!newLeaveRequest.fromDate || !newLeaveRequest.toDate) {
      alert("Please select from and to dates");
      return;
    }

    const from = new Date(newLeaveRequest.fromDate);
    const to = new Date(newLeaveRequest.toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const request = {
      id: Date.now(),
      ...newLeaveRequest,
      days,
      status: "Pending",
    };

    setLeaveRequests([request, ...leaveRequests]);
    setNewLeaveRequest({ type: "Annual Leave", fromDate: "", toDate: "", reason: "" });
    setShowLeaveModal(false);
    alert("✅ Leave request submitted!");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const LeaveBalance = ({ type, used, total }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
      <p className="text-sm text-gray-600">{type}</p>
      <p className="text-2xl font-bold text-gray-800 mt-2">{total - used} days</p>
      <div className="mt-2 bg-gray-300 rounded-full h-2">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          style={{ width: `${(used / total) * 100}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-600 mt-1">{used} of {total} used</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Leave Balance Section */}
      {leaveBalance && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">📅 Leave Balance</h2>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>➕</span> Request Leave
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <LeaveBalance type="Annual Leave" used={leaveBalance.annualLeaveUsed} total={leaveBalance.annualLeave} />
            <LeaveBalance type="Sick Leave" used={leaveBalance.sickLeaveUsed} total={leaveBalance.sickLeave} />
            <LeaveBalance type="Casual Leave" used={leaveBalance.casualLeaveUsed} total={leaveBalance.casualLeave} />
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
              <p className="text-sm text-gray-600">Total Available</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                {leaveBalance.annualLeave + leaveBalance.sickLeave + leaveBalance.casualLeave - 
                 leaveBalance.annualLeaveUsed - leaveBalance.sickLeaveUsed - leaveBalance.casualLeaveUsed} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Leave Requests */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Leave Requests</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">From Date</th>
                <th className="px-4 py-3 text-left font-semibold">To Date</th>
                <th className="px-4 py-3 text-left font-semibold">Days</th>
                <th className="px-4 py-3 text-left font-semibold">Reason</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leaveRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{request.type}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(request.from).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(request.to).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-bold">{request.days}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{request.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits Section */}
      {benefits && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💎 Your Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-gray-800">{benefit.name}</h3>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                    ✓ {benefit.status}
                  </span>
                </div>
                {benefit.provider && <p className="text-sm text-gray-600">Provider: {benefit.provider}</p>}
                {benefit.coverage && <p className="text-sm text-gray-600">Coverage: {benefit.coverage}</p>}
                {benefit.contribution && <p className="text-sm text-gray-600">Contribution: {benefit.contribution}</p>}
                {benefit.benefits && <p className="text-sm text-gray-600">Benefits: {benefit.benefits}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave Request Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Request Leave</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={newLeaveRequest.type}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={newLeaveRequest.fromDate}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, fromDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={newLeaveRequest.toDate}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, toDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={newLeaveRequest.reason}
                  onChange={(e) => setNewLeaveRequest({ ...newLeaveRequest, reason: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide reason for leave"
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleRequestLeave}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Request
                </button>
                <button
                  onClick={() => setShowLeaveModal(false)}
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
