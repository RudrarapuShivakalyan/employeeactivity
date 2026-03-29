import { useState, useEffect } from "react";

export default function CareerDevelopment() {
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Beginner",
    yearsOfExperience: 0,
    endorsements: 0,
  });

  useEffect(() => {
    const mockSkills = [
      { id: 1, name: "JavaScript", level: "Advanced", yearsOfExperience: 5, endorsements: 12, proficiency: 85 },
      { id: 2, name: "React", level: "Advanced", yearsOfExperience: 3, endorsements: 8, proficiency: 80 },
      { id: 3, name: "Python", level: "Intermediate", yearsOfExperience: 2, endorsements: 5, proficiency: 65 },
      { id: 4, name: "Project Management", level: "Intermediate", yearsOfExperience: 4, endorsements: 7, proficiency: 70 },
    ];
    setSkills(mockSkills);

    const mockCerts = [
      { id: 1, title: "AWS Certified Solutions Architect", issuer: "Amazon", date: "2025-06-15", status: "Active" },
      { id: 2, title: "Google Professional Cloud Architect", issuer: "Google", date: "2024-12-10", status: "Active" },
      { id: 3, title: "Scrum Master Certification", issuer: "Scrum Alliance", date: "2024-09-20", status: "Expiring Soon" },
    ];
    setCertifications(mockCerts);
  }, []);

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700";
      case "Intermediate":
        return "bg-blue-100 text-blue-700";
      case "Advanced":
        return "bg-purple-100 text-purple-700";
      case "Expert":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name) {
      alert("Please enter skill name");
      return;
    }
    setSkills([...skills, { ...newSkill, id: Date.now(), endorsements: 0, proficiency: 50 }]);
    setNewSkill({ name: "", level: "Beginner", yearsOfExperience: 0, endorsements: 0 });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Skills Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">💼 Professional Skills</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>➕</span> Add Skill
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{skill.name}</h3>
                  <p className="text-sm text-gray-600">{skill.yearsOfExperience} years experience</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
              </div>

              {/* Proficiency Bar */}
              <div className="mb-3">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">Proficiency</span>
                  <span className="text-xs font-bold text-blue-600">{skill.proficiency}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">👍 {skill.endorsements} endorsements</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium">Requests</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">🎓 Certifications</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
            <span>➕</span> Add Certification
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Certification</th>
                <th className="px-4 py-3 text-left font-semibold">Issuer</th>
                <th className="px-4 py-3 text-left font-semibold">Date Obtained</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {certifications.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{cert.title}</td>
                  <td className="px-4 py-3 text-gray-600">{cert.issuer}</td>
                  <td className="px-4 py-3 text-gray-600">{new Date(cert.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      cert.status === "Active" ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add New Skill</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Python, Leadership"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                <input
                  type="number"
                  value={newSkill.yearsOfExperience}
                  onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddSkill}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add Skill
                </button>
                <button
                  onClick={() => setShowModal(false)}
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
