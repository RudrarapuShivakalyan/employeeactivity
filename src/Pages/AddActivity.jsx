import { useState } from "react";
import { useActivities } from "../context/ActivityContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AddActivity() {
  const { addActivity } = useActivities();
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  if (!user || !user.employeeId) {
    return (
      <div className="bg-red-100 p-4 rounded">
        <p className="text-red-700">Error: User not logged in. Please log in first.</p>
      </div>
    );
  }

  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [projectPhase, setProjectPhase] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date || !desc || !projectName || !hoursWorked) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First save to backend
      const response = await fetch("http://localhost:5000/api/employees/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeId: user.employeeId,
          description: desc,
          date,
          hoursWorked: parseFloat(hoursWorked),
          projectName,
          projectPhase,
          projectDeadline,
        })
      });

      if (!response.ok) {
        throw new Error("Failed to save activity to backend");
      }

      // Also save to context for UI updates
      addActivity({
        employeeName: user.name,
        department: user.department,
        date,
        description: desc,
        projectName,
        projectDescription: projectDesc,
        projectPhase,
        hoursWorked: parseFloat(hoursWorked),
        projectDeadline,
      });

      // Reset form
      setDate("");
      setDesc("");
      setProjectName("");
      setProjectDesc("");
      setProjectPhase("");
      setHoursWorked("");
      setProjectDeadline("");
      alert("Activity submitted successfully!");
    } catch (err) {
      setError(err.message);
      console.error("Error submitting activity:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Add Daily Activity & Project Details</h2>

      <p className="text-sm mb-4">
        Department: <b>{user.department}</b>
      </p>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Date *</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Project Name *</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm mb-1">Project Phase</label>
          <select
            className="w-full border p-2 rounded"
            value={projectPhase}
            onChange={(e) => setProjectPhase(e.target.value)}
          >
            <option value="">Select phase</option>
            <option value="Planning">Planning</option>
            <option value="Development">Development</option>
            <option value="Testing">Testing</option>
            <option value="Deployment">Deployment</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Hours Worked</label>
          <input
            type="number"
            step="0.5"
            min="0"
            className="w-full border p-2 rounded"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
            placeholder="e.g., 8.5"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Project Deadline</label>
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={projectDeadline}
          onChange={(e) => setProjectDeadline(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Project Description</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="3"
          value={projectDesc}
          onChange={(e) => setProjectDesc(e.target.value)}
          placeholder="Describe the project objectives, technologies used, etc."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1">Work Description *</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="3"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="What specific work did you do on this project today?"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded font-medium"
      >
        {loading ? "Submitting..." : "Submit Activity & Project Details"}
      </button>
    </div>
  );
}
