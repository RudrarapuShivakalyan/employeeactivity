import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useActivities } from "../context/ActivityContext";
import AddActivity from "./AddActivity";
import MyActivities from "./MyActivities";
import LoanApplication from "./LoanApplication";
import EmployeeDashboard from "../components/EmployeeDashboard";
import CareerDevelopment from "../components/CareerDevelopment";
import EmployeePerformance from "../components/EmployeePerformance";
import LeaveAndBenefits from "../components/LeaveAndBenefits";
import PayrollAndSalary from "../components/PayrollAndSalary";
import EmployeeGoalsAndObjectives from "../components/EmployeeGoalsAndObjectives";
import EmployeeProjectsAndWork from "../components/EmployeeProjectsAndWork";

export default function Employee() {
  const { user } = useAuth();
  const { activities } = useActivities();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ FETCH USER DATA
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
      setIsLoading(false);
      return;
    }

    if (!user.employeeId) {
      setUserData(user);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    fetch(`http://localhost:5000/api/employees/by-employee-id/${encodeURIComponent(user.employeeId)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load profile: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setUserData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        if (isMounted) {
          setUserData(user);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  // ✅ FETCH LOANS
  useEffect(() => {
    if (!userData?.name) return;

    fetch("http://localhost:5000/api/loans")
      .then((res) => res.json())
      .then((data) => {
        const userLoans = data.filter(
          (loan) => loan.employeeName === userData.name || loan.employeeId === userData.employeeId
        );
        setLoans(userLoans);
      })
      .catch((err) => console.error("Error fetching loans:", err));
  }, [userData]);

  // ✅ GET USER ACTIVITIES
  const userActivities = activities.filter(
    (a) => a.employeeName === userData?.name || a.employeeId === userData?.employeeId
  );

  // ✅ CALCULATE PROJECTS
  const projects = Object.values(
    userActivities.reduce((acc, a) => {
      const key = a.projectName || "No Project";
      if (!acc[key]) acc[key] = { projectName: key, totalHours: 0, count: 0 };
      acc[key].totalHours += a.hoursWorked || 0;
      acc[key].count += 1;
      return acc;
    }, {})
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <p className="text-lg font-semibold text-red-600">No user data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 shadow-lg">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold">👤 Employee Portal</h1>
            <p className="text-indigo-100 mt-1">Welcome, {userData.name || userData.fullName}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto p-6">
        {/* TAB NAVIGATION */}
        <div className="flex gap-2 bg-white p-4 rounded-lg shadow-md mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "dashboard"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📋 My Profile
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "performance"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ⭐ Performance
          </button>
          <button
            onClick={() => setActiveTab("career")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "career"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            💼 Career
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "projects"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🏢 Projects & Work
          </button>
          <button
            onClick={() => setActiveTab("goals")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "goals"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🎯 Goals
          </button>
          <button
            onClick={() => setActiveTab("activities")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "activities"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📝 Activities
          </button>
          <button
            onClick={() => setActiveTab("leave")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "leave"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            📅 Leave & Benefits
          </button>
          <button
            onClick={() => setActiveTab("payroll")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "payroll"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            💰 Payroll
          </button>
          <button
            onClick={() => setActiveTab("addActivity")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "addActivity"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ➕ Add Activity
          </button>
          <button
            onClick={() => setActiveTab("loans")}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              activeTab === "loans"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            🏦 Loans
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Employee Profile</h2>

              {/* PERSONAL INFO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    👤 Personal Information
                  </h3>
                  <div className="space-y-3">
                    <p>
                      <span className="font-semibold text-gray-700">Name:</span>{" "}
                      {userData.name || userData.fullName}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Employee ID:</span>{" "}
                      {userData.employeeId || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Email:</span>{" "}
                      {userData.email || userData.personalEmail || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Phone:</span> {userData.phone || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Gender:</span> {userData.gender || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Date of Birth:</span>{" "}
                      {userData.dateOfBirth || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    💼 Employment Information
                  </h3>
                  <div className="space-y-3">
                    <p>
                      <span className="font-semibold text-gray-700">Department:</span>{" "}
                      {userData.department || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Role:</span> {userData.role || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Joining Date:</span>{" "}
                      {userData.joiningDate || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Status:</span>{" "}
                      <span className="text-green-600 font-semibold">{userData.status || "Active"}</span>
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Salary:</span>{" "}
                      ₹{Number(userData.salary || 0).toLocaleString("en-IN")}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">Experience:</span>{" "}
                      {userData.yearsOfExperience || "0"} years
                    </p>
                  </div>
                </div>
              </div>

              {/* ADDRESS & EMERGENCY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-4">📍 Address</h3>
                  <p>{userData.address || "N/A"}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-4">🆘 Emergency Contact</h3>
                  <p>
                    <span className="font-semibold">Name:</span> {userData.emergencyContactName || userData.emergencyContact || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {userData.emergencyPhone || userData.emergencyContact || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DASHBOARD TAB */}
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">📊 Employee Dashboard</h2>
              <EmployeeDashboard />
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {activeTab === "performance" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">⭐ Performance</h2>
              <EmployeePerformance />
            </div>
          )}

          {/* CAREER TAB */}
          {activeTab === "career" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">💼 Career Development</h2>
              <CareerDevelopment />
            </div>
          )}

          {/* PROJECTS & WORK TAB */}
          {activeTab === "projects" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">🏢 Projects & Work History</h2>
              <EmployeeProjectsAndWork />
            </div>
          )}

          {/* GOALS TAB */}
          {activeTab === "goals" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">🎯 Goals & Objectives</h2>
              <EmployeeGoalsAndObjectives />
            </div>
          )}

          {/* ACTIVITIES TAB */}
          {activeTab === "activities" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">📝 My Activities</h2>
              
              {/* PROJECTS SUMMARY */}
              {projects.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Projects Working On</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map((p, i) => (
                      <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-indigo-200">
                        <p className="font-semibold text-indigo-700">{p.projectName}</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Total Hours: <span className="font-bold text-indigo-600">{p.totalHours}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Activities: <span className="font-bold text-indigo-600">{p.count}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIVITIES LIST */}
              <MyActivities />
            </div>
          )}

          {/* LEAVE & BENEFITS TAB */}
          {activeTab === "leave" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">📅 Leave & Benefits</h2>
              <LeaveAndBenefits />
            </div>
          )}

          {/* PAYROLL TAB */}
          {activeTab === "payroll" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 Payroll & Salary</h2>
              <PayrollAndSalary />
            </div>
          )}

          {/* ADD ACTIVITY TAB */}
          {activeTab === "addActivity" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">➕ Add New Activity</h2>
              <AddActivity />
            </div>
          )}

          {/* LOANS TAB */}
          {activeTab === "loans" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">💰 Loans</h2>

              {/* LOAN APPLICATION FORM */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Apply for New Loan</h3>
                <LoanApplication />
              </div>

              {/* MY LOANS */}
              {loans.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">My Loan Applications</h3>
                  <div className="space-y-4">
                    {loans.map((loan) => (
                      <div key={loan.id} className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">{loan.loanType}</p>
                            <p className="text-sm text-gray-600">Amount: ₹{Number(loan.loanAmount || 0).toLocaleString("en-IN")}</p>
                            <p className="text-sm text-gray-600">Applied Date: {loan.appliedDate || "N/A"}</p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              loan.status === "Approved"
                                ? "bg-green-200 text-green-800"
                                : loan.status === "Rejected"
                                ? "bg-red-200 text-red-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {loan.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {loans.length === 0 && (
                <p className="text-center text-gray-500 py-8">No loan applications yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}