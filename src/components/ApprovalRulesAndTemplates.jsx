import { useState, useEffect } from "react";

export default function ApprovalRulesAndTemplates() {
  const [templates, setTemplates] = useState([]);
  const [rules, setRules] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    approvalType: "standard",
    requiresFollowup: false,
    maxHours: 8,
    needsDocumentation: false,
  });
  const [newRule, setNewRule] = useState({
    name: "",
    condition: "",
    action: "notify",
    priority: "medium",
    active: true,
  });

  useEffect(() => {
    loadTemplatesAndRules();
  }, []);

  const loadTemplatesAndRules = () => {
    const mockTemplates = [
      {
        id: 1,
        name: "Standard Project Work",
        description: "For routine project activities",
        approvalType: "standard",
        requiresFollowup: false,
        maxHours: 8,
        needsDocumentation: false,
        usageCount: 23,
      },
      {
        id: 2,
        name: "Client Meeting",
        description: "Travel and client meeting activities",
        approvalType: "standard",
        requiresFollowup: true,
        maxHours: 6,
        needsDocumentation: true,
        usageCount: 15,
      },
      {
        id: 3,
        name: "Training & Development",
        description: "Training and skill enhancement activities",
        approvalType: "special",
        requiresFollowup: true,
        maxHours: 10,
        needsDocumentation: true,
        usageCount: 8,
      },
    ];

    const mockRules = [
      {
        id: 1,
        name: "High Priority Activities",
        condition: "priority >= High",
        action: "fast-track",
        priority: "high",
        active: true,
      },
      {
        id: 2,
        name: "Over-hours Alert",
        condition: "hours > 10",
        action: "notify",
        priority: "high",
        active: true,
      },
      {
        id: 3,
        name: "Budget Limit Check",
        condition: "amount > 5000",
        action: "require-justification",
        priority: "medium",
        active: true,
      },
    ];

    setTemplates(mockTemplates);
    setRules(mockRules);
  };

  const handleAddTemplate = () => {
    if (!newTemplate.name || !newTemplate.description) {
      alert("Please fill all fields");
      return;
    }

    const template = {
      ...newTemplate,
      id: Date.now(),
      usageCount: 0,
    };

    setTemplates([...templates, template]);
    setNewTemplate({
      name: "",
      description: "",
      approvalType: "standard",
      requiresFollowup: false,
      maxHours: 8,
      needsDocumentation: false,
    });
    setShowTemplateModal(false);
    alert("✅ Template created successfully!");
  };

  const handleAddRule = () => {
    if (!newRule.name || !newRule.condition) {
      alert("Please fill all fields");
      return;
    }

    const rule = {
      ...newRule,
      id: Date.now(),
    };

    setRules([...rules, rule]);
    setNewRule({
      name: "",
      condition: "",
      action: "notify",
      priority: "medium",
      active: true,
    });
    setShowRuleModal(false);
    alert("✅ Rule created successfully!");
  };

  const handleDeleteTemplate = (id) => {
    if (confirm("Delete this template?")) {
      setTemplates(templates.filter((t) => t.id !== id));
    }
  };

  const handleDeleteRule = (id) => {
    if (confirm("Delete this rule?")) {
      setRules(rules.filter((r) => r.id !== id));
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-orange-100 text-orange-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Approval Templates */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Approval Templates</h2>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>➕</span> New Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 my-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{template.approvalType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Max Hours:</span>
                  <span className="font-medium">{template.maxHours}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Follow-up Needed:</span>
                  <span className="font-medium">{template.requiresFollowup ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Documentation:</span>
                  <span className="font-medium">{template.needsDocumentation ? "Required" : "Optional"}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button className="flex-1 bg-blue-100 text-blue-700 py-2 rounded hover:bg-blue-200 transition text-sm font-medium">
                  📋 Use Template
                </button>
                <button className="flex-1 bg-purple-100 text-purple-700 py-2 rounded hover:bg-purple-200 transition text-sm font-medium">
                  ✏️ Edit
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-2">Used {template.usageCount} times</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Rules */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Approval Rules</h2>
          <button
            onClick={() => setShowRuleModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>➕</span> New Rule
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Rule Name</th>
                <th className="px-4 py-3 text-left font-semibold">Condition</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
                <th className="px-4 py-3 text-left font-semibold">Priority</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium">{rule.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{rule.condition}</td>
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium capitalize">
                      {rule.action.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${getPriorityColor(rule.priority)}`}>
                      {rule.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setRules(
                          rules.map((r) =>
                            r.id === rule.id ? { ...r, active: !r.active } : r
                          )
                        );
                      }}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        rule.active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {rule.active ? "✓ Active" : "✗ Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Template</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Standard Project Work"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Brief description of this template"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Hours</label>
                <input
                  type="number"
                  value={newTemplate.maxHours}
                  onChange={(e) => setNewTemplate({ ...newTemplate, maxHours: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTemplate.requiresFollowup}
                  onChange={(e) => setNewTemplate({ ...newTemplate, requiresFollowup: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Requires Follow-up</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTemplate.needsDocumentation}
                  onChange={(e) => setNewTemplate({ ...newTemplate, needsDocumentation: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium">Needs Documentation</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddTemplate}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Create New Rule</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., High Priority Activities"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <input
                  type="text"
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., priority >= High"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={newRule.action}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="notify">Notify</option>
                  <option value="fast-track">Fast Track</option>
                  <option value="require-justification">Require Justification</option>
                  <option value="escalate">Escalate</option>
                  <option value="auto-approve">Auto Approve</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newRule.priority}
                  onChange={(e) => setNewRule({ ...newRule, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddRule}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowRuleModal(false)}
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
