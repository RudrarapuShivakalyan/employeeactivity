import { useState, useEffect } from "react";

export default function LoanManagement() {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/loans");
      if (response.ok) {
        const data = await response.json();
        setLoans(data);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (loanId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/loans/${loanId}/approve`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Approved", remarks }),
        }
      );
      if (response.ok) {
        setLoans(loans.map((l) => (l.id === loanId ? { ...l, status: "Approved" } : l)));
        setSelectedLoan(null);
        setRemarks("");
        alert("✅ Loan approved successfully!");
      }
    } catch (error) {
      console.error("Error approving loan:", error);
    }
  };

  const handleReject = async (loanId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/loans/${loanId}/reject`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Rejected", remarks }),
        }
      );
      if (response.ok) {
        setLoans(loans.map((l) => (l.id === loanId ? { ...l, status: "Rejected" } : l)));
        setSelectedLoan(null);
        setRemarks("");
        alert("❌ Loan rejected successfully!");
      }
    } catch (error) {
      console.error("Error rejecting loan:", error);
    }
  };

  const filteredLoans =
    statusFilter === "All"
      ? loans
      : loans.filter((l) => l.status === statusFilter);

  if (loading) {
    return <div className="text-center p-4">Loading loan applications...</div>;
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Loan Applications Management</h2>

      {/* Filter */}
      <div className="mb-4 flex gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <span className="text-gray-600 self-center">
          Total: {filteredLoans.length} applications
        </span>
      </div>

      {/* Loans List */}
      <div className="space-y-3">
        {filteredLoans.length === 0 ? (
          <p className="text-gray-500">No loan applications found</p>
        ) : (
          filteredLoans.map((loan) => (
            <div key={loan.id} className="border p-4 rounded hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{loan.employeeName}</h3>
                  <p className="text-sm text-gray-600">ID: {loan.employeeId}</p>
                  <p className="text-sm">
                    <b>Loan Type:</b> {loan.loanType} | <b>Amount:</b> ₹
                    {Number(loan.loanAmount).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm">
                    <b>Tenure:</b> {loan.tenure} months | <b>Date:</b>{" "}
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold text-white ${
                      loan.status === "Pending"
                        ? "bg-yellow-500"
                        : loan.status === "Approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {loan.status}
                  </span>
                  <button
                    onClick={() => setSelectedLoan(loan)}
                    className="block mt-2 bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Loan Details Modal */}
      {selectedLoan && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded max-w-2xl max-h-96 overflow-y-auto w-full shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Loan Application Details</h3>

            {/* Employee Information */}
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h4 className="font-semibold mb-3">Employee Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold">{selectedLoan.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-semibold">{selectedLoan.employeeId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-semibold">{selectedLoan.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-semibold">{selectedLoan.designation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-sm">{selectedLoan.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-semibold">{selectedLoan.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Salary</p>
                  <p className="font-semibold">
                    ₹{Number(selectedLoan.salary).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-blue-50 p-4 rounded mb-4">
              <h4 className="font-semibold mb-3">Loan Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Loan Type</p>
                  <p className="font-semibold">{selectedLoan.loanType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Loan Amount</p>
                  <p className="font-semibold">
                    ₹{Number(selectedLoan.loanAmount).toLocaleString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tenure</p>
                  <p className="font-semibold">{selectedLoan.tenure} months</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Application Date</p>
                  <p className="font-semibold">
                    {new Date(selectedLoan.applicationDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Loan Reason */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 font-medium">Reason for Loan</p>
              <p className="p-2 bg-gray-50 rounded text-sm">{selectedLoan.loanReason}</p>
            </div>

            {/* Documents */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 font-medium">Documents</p>
              <p className="p-2 bg-gray-50 rounded text-sm">
                {selectedLoan.documents || "None"}
              </p>
            </div>

            {/* Action Buttons */}
            {selectedLoan.status === "Pending" && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Add any remarks..."
                  className="w-full border p-2 rounded text-sm"
                  rows="2"
                />
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setSelectedLoan(null);
                  setRemarks("");
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
              {selectedLoan.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleReject(selectedLoan.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedLoan.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
