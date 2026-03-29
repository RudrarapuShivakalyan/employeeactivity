import { useState, useEffect } from "react";

export default function EmployeeProjectsAndWork() {
  const [projects, setProjects] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        name: "E-Commerce Platform Redesign",
        description: "Complete redesign of the e-commerce platform UI/UX",
        role: "Lead Frontend Developer",
        team: ["Alice Johnson", "Bob Smith", "Carol Davis"],
        status: "Completed",
        progress: 100,
        startDate: "2025-09-01",
        endDate: "2026-02-28",
        technologies: ["React", "Tailwind CSS", "Node.js"],
        contribution: "Led frontend development, designed component architecture",
      },
      {
        id: 2,
        name: "Mobile App Development",
        description: "Native mobile app for iOS and Android",
        role: "Senior Developer",
        team: ["David Lee", "Emma Wilson"],
        status: "In Progress",
        progress: 65,
        startDate: "2025-12-01",
        endDate: "2026-06-30",
        technologies: ["React Native", "Firebase", "Redux"],
        contribution: "Architecture design, code reviews, mentoring junior developers",
      },
      {
        id: 3,
        name: "API Integration & Optimization",
        description: "Integrate third-party APIs and optimize database queries",
        role: "Backend Developer",
        team: ["Frank Miller"],
        status: "In Progress",
        progress: 45,
        startDate: "2026-01-15",
        endDate: "2026-05-31",
        technologies: ["Python", "FastAPI", "PostgreSQL"],
        contribution: "API integration, performance optimization",
      },
    ];

    const mockWorkHistory = [
      {
        id: 1,
        company: "Tech Solutions Inc.",
        position: "Senior Developer",
        duration: "2 years 3 months",
        fromDate: "2023-12",
        toDate: "Present",
        location: "San Francisco, CA",
        description: "Led development of core platform features, mentored 3 junior developers",
        achievements: ["Led 5+ major projects", "Improved system performance by 40%", "Established coding standards"],
      },
      {
        id: 2,
        company: "Digital Innovations Ltd",
        position: "Full Stack Developer",
        duration: "1 year 8 months",
        fromDate: "2022-04",
        toDate: "2023-11",
        location: "New York, NY",
        description: "Developed and maintained web applications for multiple clients",
        achievements: ["Built 8+ client projects", "Zero-downtime deployments", "Client satisfaction rating 4.8/5"],
      },
      {
        id: 3,
        company: "StartUp Ventures",
        position: "Junior Developer",
        duration: "1 year 5 months",
        fromDate: "2020-11",
        toDate: "2022-03",
        location: "Austin, TX",
        description: "Built features for SaaS platform, learned agile methodologies",
        achievements: ["Reduced bug count by 35%", "Implemented CI/CD pipeline", "Won 'Developer of Quarter' award"],
      },
    ];

    setProjects(mockProjects);
    setWorkHistory(mockWorkHistory);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "On Hold":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-3 font-medium transition ${
            activeTab === "projects"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          💼 Current Projects
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-3 font-medium transition ${
            activeTab === "history"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          📜 Work History
        </button>
      </div>

      {/* Current Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          {projects.map((project) => {
            const start = new Date(project.startDate);
            const end = project.status === "Completed" ? new Date(project.endDate) : new Date();
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            const totalDuration = Math.ceil((new Date(project.endDate) - start) / (1000 * 60 * 60 * 24));

            return (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{project.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-xs text-gray-600">Your Role</p>
                    <p className="font-medium text-gray-800">{project.role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="font-medium text-gray-800">{Math.ceil(duration / 30)} months</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Progress</p>
                    <p className="font-medium text-blue-600">{project.progress}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Project Progress</span>
                    <span className="text-sm font-bold text-blue-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team Members */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Team Members ({project.team.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {project.team.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                          {member.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contribution */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Your Contribution</p>
                  <p className="text-sm text-gray-700">{project.contribution}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Work History Tab */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="relative">
            {workHistory.map((job, idx) => (
              <div key={job.id} className="relative pl-8 pb-8">
                {/* Timeline dot */}
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 border-4 border-white"></div>

                {/* Timeline line */}
                {idx !== workHistory.length - 1 && (
                  <div className="absolute left-1.5 top-4 w-0.5 h-20 bg-gray-300"></div>
                )}

                {/* Job Card */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{job.position}</h3>
                      <p className="text-md font-semibold text-gray-700">{job.company}</p>
                    </div>
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{job.duration}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    📍 {job.location} • {job.fromDate} to {job.toDate}
                  </p>

                  <p className="text-gray-700 mb-4">{job.description}</p>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Achievements:</p>
                    <ul className="space-y-1">
                      {job.achievements.map((achievement, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-500 mt-1">✓</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
