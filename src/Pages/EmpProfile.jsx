import { useEffect, useState } from "react";
import AddActivity from "./AddActivity";
import { useActivities } from "../context/ActivityContext";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const { activities } = useActivities();

  // ✅ FETCH USER
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!storedUser.employeeId) {
      console.error("No user found in localStorage");
      return;
    }

    // Get auth token
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    fetch("http://localhost:5000/api/employees/csv", { headers })
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        const emp = data.find(
          (e) => e.employeeId === storedUser.employeeId
        );

        setUser(emp || null);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

  // ✅ FETCH LOANS
  useEffect(() => {
    if (!user?.name) return;

    fetch("http://localhost:5000/api/loans")
      .then((res) => res.json())
      .then((data) => {
        const userLoans = data.filter(
          (loan) => loan.employeeName === user.name
        );
        setLoans(userLoans);
      })
      .catch((err) => console.error(err));
  }, [user]);

  // ✅ PROJECTS
  const userActivities = activities.filter(
    (a) => a.employeeName === user?.name
  );

  const projects = Object.values(
    userActivities.reduce((acc, a) => {
      const key = a.projectName || "No Project";
      if (!acc[key]) acc[key] = { projectName: key, totalHours: 0 };
      acc[key].totalHours += a.hoursWorked || 0;
      return acc;
    }, {})
  );

  // ✅ LOADING
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">

      <h2 className="text-2xl font-bold mb-4">Employee Profile</h2>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <p><b>ID:</b> {user.employee_id}</p>
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
        <p><b>Phone:</b> {user.phone}</p>
        <p><b>Role:</b> {user.role}</p>
        <p><b>Department:</b> {user.department}</p>
        <p><b>Status:</b> {user.status}</p>
        <p><b>Joining Date:</b> {user.joining_date}</p>
      </div>

      {/* PROJECTS */}
      <div className="mb-4">
        <h3 className="font-bold">Projects</h3>
        {projects.length > 0 ? (
          projects.map((p, i) => (
            <p key={i}>
              {p.projectName} - {p.totalHours} hrs
            </p>
          ))
        ) : (
          <p>No projects</p>
        )}
      </div>

      {/* LOANS */}
      <div className="mb-4">
        <h3 className="font-bold">Loans</h3>
        {loans.length > 0 ? (
          loans.map((l) => (
            <p key={l.id}>
              {l.loanType} - ₹{l.loanAmount} ({l.status})
            </p>
          ))
        ) : (
          <p>No loans</p>
        )}
      </div>

      {/* ADD ACTIVITY */}
      <button
        onClick={() => setShowProjectForm(!showProjectForm)}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        {showProjectForm ? "Hide Activity" : "Add Activity"}
      </button>

      {showProjectForm && <AddActivity />}
    </div>
  );
}