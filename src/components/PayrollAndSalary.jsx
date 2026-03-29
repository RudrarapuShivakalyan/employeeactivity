import { useState, useEffect } from "react";

export default function PayrollAndSalary() {
  const [payrollData, setPayrollData] = useState(null);
  const [filterYear, setFilterYear] = useState(2026);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const mockPayroll = {
      currentSalary: 750000,
      baseSalary: 700000,
      payFrequency: "Monthly",
      lastPaymentDate: "2026-03-25",
      nextPaymentDate: "2026-04-25",
      paymentMethod: "Bank Transfer",
      bankName: "Central Bank",
      accountNumber: "****1234",
      taxFileNumber: "123456789",
      payHistory: [
        {
          date: "2026-03-25",
          month: "March",
          gross: 62500,
          netPay: 51000,
          deductions: 11500,
          breakdown: {
            baseSalary: 58333,
            bonus: 4167,
            incomeTax: 9500,
            socialSecurity: 2000,
          },
        },
        {
          date: "2026-02-25",
          month: "February",
          gross: 62500,
          netPay: 51000,
          deductions: 11500,
          breakdown: {
            baseSalary: 58333,
            bonus: 4167,
            incomeTax: 9500,
            socialSecurity: 2000,
          },
        },
        {
          date: "2026-01-25",
          month: "January",
          gross: 62500,
          netPay: 51000,
          deductions: 11500,
          breakdown: {
            baseSalary: 58333,
            bonus: 4167,
            incomeTax: 9500,
            socialSecurity: 2000,
          },
        },
      ],
    };
    setPayrollData(mockPayroll);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading payroll information...</div>;
  }

  const handleDownloadPayslip = () => {
    setDownloading("payslip");
    setTimeout(() => {
      const payslip = `PAYSLIP - March 2026\n\nEmployee: Demo User\nNet Pay: ₹51,000\nGross: ₹62,500\nDeductions: ₹11,500\n\nGenerated: ${new Date().toLocaleDateString()}`;
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(payslip));
      element.setAttribute("download", `payslip-march-2026.txt`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(null);
      alert("✅ Latest payslip downloaded!");
    }, 500);
  };

  const handleDownloadAnnualSummary = () => {
    setDownloading("annual");
    setTimeout(() => {
      const summary = `ANNUAL SALARY SUMMARY - 2026\n\nAnnual Salary: ₹750,000\nMonthly Average: ₹62,500\nTotal Gross: ₹187,500 (3 months)\nTotal Deductions: ₹34,500\nTotal Net Pay: ₹153,000\n\nGenerated: ${new Date().toLocaleDateString()}`;
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(summary));
      element.setAttribute("download", `annual-summary-2026.txt`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setDownloading(null);
      alert("✅ Annual summary downloaded!");
    }, 500);
  };

  const handleEmailPayslip = () => {
    const emailBody = `Hi,\n\nPlease find your March 2026 payslip details below:\n\nGross Pay: ₹62,500\nNet Pay: ₹51,000\nDeductions: ₹11,500\n\nThank you`;
    window.location.href = `mailto:employee@company.com?subject=Your%20Payslip%20-%20March%202026&body=${encodeURIComponent(emailBody)}`;
    alert("📧 Opening email client to send payslip...");
  };

  return (
    <div className="space-y-6">
      {/* Salary Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-90">Current Monthly Salary</p>
          <p className="text-4xl font-bold mt-2">₹{(payrollData.currentSalary / 12).toLocaleString()}</p>
          <p className="text-xs opacity-80 mt-1">Gross Amount</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-90">Last Net Payment</p>
          <p className="text-4xl font-bold mt-2">₹{payrollData.payHistory[0].netPay.toLocaleString()}</p>
          <p className="text-xs opacity-80 mt-1">{payrollData.payHistory[0].date}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md">
          <p className="text-sm opacity-90">Next Payment</p>
          <p className="text-2xl font-bold mt-2">{payrollData.nextPaymentDate}</p>
          <p className="text-xs opacity-80 mt-1">{payrollData.payFrequency}</p>
        </div>
      </div>

      {/* Salary Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">💰 Salary Information</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Base Salary</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">₹{payrollData.baseSalary.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Annual Salary</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">₹{payrollData.currentSalary.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Pay Frequency</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{payrollData.payFrequency}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{payrollData.paymentMethod}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Bank Name</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{payrollData.bankName}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Account</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{payrollData.accountNumber}</p>
          </div>
        </div>
      </div>

      {/* Pay History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📊 Recent Payslips</h2>
        <div className="space-y-4">
          {payrollData.payHistory.map((pay, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{pay.month}</p>
                  <p className="text-lg font-bold text-gray-800">{pay.date}</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <p className="text-xs text-gray-600">Gross</p>
                  <p className="text-lg font-bold text-green-700">₹{pay.gross.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <p className="text-xs text-gray-600">Deductions</p>
                  <p className="text-lg font-bold text-red-700">₹{pay.deductions.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded">
                  <p className="text-xs text-gray-600">Net Pay</p>
                  <p className="text-lg font-bold text-blue-700">₹{pay.netPay.toLocaleString()}</p>
                </div>
              </div>

              {/* Breakdown Details */}
              <details className="mt-3 pt-3 border-t">
                <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-blue-600">
                  View Details
                </summary>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Base Salary</p>
                    <p className="text-sm font-bold">₹{pay.breakdown.baseSalary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Bonus</p>
                    <p className="text-sm font-bold">₹{pay.breakdown.bonus.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Income Tax</p>
                    <p className="text-sm font-bold">₹{pay.breakdown.incomeTax.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Social Security</p>
                    <p className="text-sm font-bold">₹{pay.breakdown.socialSecurity.toLocaleString()}</p>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Information */}
      <div className="bg-yellow-50 p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h2 className="text-lg font-bold text-gray-800 mb-3">🔐 Tax Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Tax File Number</p>
            <p className="text-lg font-bold text-gray-800">{payrollData.taxFileNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">YTD Tax Paid</p>
            <p className="text-lg font-bold text-gray-800">₹2,850</p>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleDownloadPayslip}
          disabled={downloading === "payslip"}
          className="flex-1 min-w-40 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 transition flex items-center justify-center gap-2 font-medium"
        >
          📥 {downloading === "payslip" ? "Downloading..." : "Download Latest Payslip"}
        </button>
        <button
          onClick={handleDownloadAnnualSummary}
          disabled={downloading === "annual"}
          className="flex-1 min-w-40 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-green-800 transition flex items-center justify-center gap-2 font-medium"
        >
          📊 {downloading === "annual" ? "Downloading..." : "Download Annual Summary"}
        </button>
        <button
          onClick={handleEmailPayslip}
          className="flex-1 min-w-40 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 font-medium"
        >
          📧 Email Payslip
        </button>
      </div>
    </div>
  );
}
