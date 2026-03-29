import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoanApplication() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    loanType: "Personal",
    loanAmount: "",
    loanReason: "",
    tenure: 12,
    documents: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/loans/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeName: user.name,
          employeeId: user.employeeId,
          department: user.department,
          email: user.personalEmail || user.email,
          phone: user.phone,
          designation: user.jobTitle,
          salary: user.salary,
          ...formData,
          applicationDate: new Date().toISOString(),
          status: "Pending",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`✅ Loan application submitted successfully! Request ID: ${result.id || 'n/a'}`);
        setFormData({
          loanType: "Personal",
          loanAmount: "",
          loanReason: "",
          tenure: 12,
          documents: "",
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error submitting application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Apply for Loan</h2>

      {message && (
        <div
          className={`p-4 rounded mb-4 ${
            message.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Info Display */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
          <h3 className="font-semibold mb-3">Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="font-semibold">{user.employeeId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Department</p>
              <p className="font-semibold">{user.department}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Designation</p>
              <p className="font-semibold">{user.jobTitle || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Salary</p>
              <p className="font-semibold">
                ₹{Number(user.salary || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-sm">{user.personalEmail || user.email}</p>
            </div>
          </div>
        </div>

        {/* Loan Details */}
        <div>
          <label className="block text-sm font-medium mb-2">Loan Type</label>
          <select
            name="loanType"
            value={formData.loanType}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option>Personal</option>
            <option>Home</option>
            <option>Auto</option>
            <option>Education</option>
            <option>Medical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Loan Amount (₹)
          </label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
            placeholder="Enter loan amount"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            min="10000"
            step="1000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tenure (Months)</label>
          <select
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
            <option value="24">24 Months</option>
            <option value="36">36 Months</option>
            <option value="48">48 Months</option>
            <option value="60">60 Months</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Reason for Loan</label>
          <textarea
            name="loanReason"
            value={formData.loanReason}
            onChange={handleChange}
            placeholder="Describe the purpose of the loan"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Documents/Attachments
          </label>
          <input
            type="text"
            name="documents"
            value={formData.documents}
            onChange={handleChange}
            placeholder="List attached documents (e.g., Salary slip, Bank statement)"
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Loan Application"}
        </button>
      </form>
    </div>
  );
}
