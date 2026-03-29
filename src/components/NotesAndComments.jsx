import { useState, useEffect } from "react";

export default function NotesAndComments() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [selectedMember, setSelectedMember] = useState("team");
  const [teamMembers] = useState([
    { id: "team", name: "Team Notes" },
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mike Johnson" },
  ]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${selectedMember}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [selectedMember]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now(),
      text: newNote,
      createdAt: new Date().toLocaleString(),
      author: "Manager",
      edited: false,
    };

    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${selectedMember}`, JSON.stringify(updatedNotes));
    setNewNote("");
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${selectedMember}`, JSON.stringify(updatedNotes));
  };

  const handleEditNote = (id, newText) => {
    const updatedNotes = notes.map((n) =>
      n.id === id ? { ...n, text: newText, edited: true, lastModified: new Date().toLocaleString() } : n
    );
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${selectedMember}`, JSON.stringify(updatedNotes));
  };

  return (
    <div className="space-y-6">
      {/* Member Selection */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Member/Team:</label>
        <select
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Note Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Add New Note</h3>
        <div className="space-y-3">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write your note here..."
            rows="4"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setNewNote("")}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Clear
            </button>
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <span>📝</span> Add Note
            </button>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-800">
          Recent Notes ({notes.length})
        </h3>
        {notes.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-600">
            <p className="text-lg">No notes yet. Create your first note above.</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-600">{note.author}</p>
                  <p className="text-xs text-gray-500">
                    {note.createdAt}
                    {note.edited && <span className="ml-2">(edited{note.lastModified && ` at ${note.lastModified}`})</span>}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-800 mb-3 whitespace-pre-wrap">{note.text}</p>
              <button
                onClick={() => {
                  const newText = prompt("Edit note:", note.text);
                  if (newText !== null && newText !== note.text) {
                    handleEditNote(note.id, newText);
                  }
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
