import { useState, useEffect } from "react";

export default function PayrollAndCompensation() {
  const [payrollData, setPayrollData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("March 2026");

  useEffect(() => {
    const mockPayroll = [
      {
        id: 1,
        employeeName: "Sarah Johnson",
        employeeId: "EMP-2026-001",
        department: "IT",
        baseSalary: 700000,
        bonus: 50000,
        deductions: 115000,
        netPay: 635000,
        status: "Processed",
        processedDate: "2026-03-25",
      },
      {
        id: 2,
        employeeName: "Mike Wilson",
        employeeId: "EMP-2026-002",
        department: "HR",
        baseSalary: 550000,
        bonus: 25000,
        deductions: 92500,
        netPay: 482500,
        status: "Processed",
        processedDate: "2026-03-25",
      },
      {
        id: 3,
        employeeName: "Emily Davis",
        employeeId: "EMP-2026-003",
        department: "Finance",
        baseSalary: 800000,
        bonus: 75000,
        deductions: 137500,
        netPay: 737500,
        status: "Processed",
        processedDate: "2026-03-25",
      },
      {
        id: 4,
        employeeName: "John Smith",
        employeeId: "EMP-2026-004",
        department: "Sales",
        baseSalary: 600000,
        bonus: 100000,
        deductions: 112000,
        netPay: 588000,
        status: "Pending",
        processedDate: null,
      },
      {
        id: 5,
        employeeName: "Lisa Anderson",
        employeeId: "EMP-2026-005",
        department: "Marketing",
        baseSalary: 650000,
        bonus: 40000,
        deductions: 104000,
        netPay: 586000,
        status: "Processed",
        processedDate: "2026-03-25",
      },
    ];
    setPayrollData(mockPayroll);
  }, []);

  const getStatusColor = (status) => {
    return status === "Processed"
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700";
  };

  const totalStats = payrollData.reduce(
    (acc, emp) => ({
      totalBaseSalary: acc.totalBaseSalary + emp.baseSalary,
      totalBonus: acc.totalBonus + emp.bonus,
      totalDeductions: acc.totalDeductions + emp.deductions,
      totalNetPay: acc.totalNetPay + emp.netPay,
      processed: acc.processed + (emp.status === "Processed" ? 1 : 0),
      pending: acc.pending + (emp.status === "Pending" ? 1 : 0),
    }),
    {
      totalBaseSalary: 0,
      totalBonus: 0,
      totalDeductions: 0,
      totalNetPay: 0,
      processed: 0,
      pending: 0,
    }
  );

  return (
    <div className="space-y-6">
      {/* Month Selection */}
      <div className="flex gap-3 flex-wrap">
        {["March 2026", "February 2026", "January 2026"].map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedMonth === month
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {month}
          </button>
        ))}
      </div>

      {/* Payroll Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Total Base Salary</p>
          <p className="text-2xl font-bold mt-1">₹{(totalStats.totalBaseSalary / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Total Bonus</p>
          <p className="text-2xl font-bold mt-1">₹{(totalStats.totalBonus / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Total Deductions</p>
          <p className="text-2xl font-bold mt-1">₹{(totalStats.totalDeductions / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
          <p className="text-xs opacity-90">Total Net Pay</p>
          <p className="text-2xl font-bold mt-1">₹{(totalStats.totalNetPay / 100000).toFixed(1)}L</p>
        </div>
      </div>

      {/* Processing Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <p className="text-green-700 font-medium">✓ Processed</p>
          <p className="text-3xl font-bold text-green-700 mt-2">{totalStats.processed}</p>
          <p className="text-xs text-green-600 mt-2">Employees paid</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <p className="text-orange-700 font-medium">⏳ Pending</p>
          <p className="text-3xl font-bold text-orange-700 mt-2">{totalStats.pending}</p>
          <p className="text-xs text-orange-600 mt-2">Awaiting approval</p>
        </div>
      </div>

      {/* Payroll Details Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Employee</th>
              <th className="px-4 py-3 text-left font-semibold">Department</th>
              <th className="px-4 py-3 text-right font-semibold">Base Salary</th>
              <th className="px-4 py-3 text-right font-semibold">Bonus</th>
              <th className="px-4 py-3 text-right font-semibold">Deductions</th>
              <th className="px-4 py-3 text-right font-semibold">Net Pay</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {payrollData.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">
                  <div>
                    <p className="text-gray-800">{emp.employeeName}</p>
                    <p className="text-xs text-gray-500">{emp.employeeId}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700">{emp.department}</td>
                <td className="px-4 py-3 text-right text-gray-800 font-medium">
                  ₹{emp.baseSalary.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-green-700 font-medium">
                  ₹{emp.bonus.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-red-700 font-medium">
                  ₹{emp.deductions.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right text-blue-700 font-bold">
                  ₹{emp.netPay.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(emp.status)}`}>
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium">
          📥 Download Payroll Report
        </button>
        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium">
          ✓ Process Pending Payroll
        </button>
        <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-medium">
          📊 View Analytics
        </button>
      </div>
    </div>
  );
}
