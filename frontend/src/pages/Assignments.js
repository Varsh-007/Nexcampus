import { useEffect, useState } from "react";
import axios from "axios";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAssignments();
  }, []);

  /* ==============================
     FETCH ASSIGNMENTS
  ============================== */
  const fetchAssignments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/assignments/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  /* ==============================
     CREATE ASSIGNMENT
  ============================== */
  const handleCreateAssignment = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/assignments/create",
        { title, description, department, dueDate },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowCreateModal(false);
      setTitle("");
      setDescription("");
      setDepartment("");
      setDueDate("");
      fetchAssignments();
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  /* ==============================
     DELETE ASSIGNMENT
  ============================== */
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/assignments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  /* ==============================
     SUBMIT ASSIGNMENT (FILE)
  ============================== */
  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      await axios.post(
        `http://localhost:5000/api/assignments/submit/${selectedAssignment}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await fetchAssignments();

      setShowSubmitModal(false);
      setSelectedFile(null);
      setSelectedAssignment(null);

    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  /* ==============================
     VIEW SUBMISSIONS
  ============================== */
  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/assignments/submissions/${assignmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubmissions(res.data);
      setShowSubmissionsModal(true);

    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-indigo-900 p-10 text-white w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Assignments 📚</h1>

        {(role === "admin" || role === "teacher") && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-500 px-4 py-2 rounded-xl hover:bg-green-600"
          >
            + Create
          </button>
        )}
      </div>

      {/* ASSIGNMENT CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        {assignments.map((item) => (
          <div
            key={item._id}
            className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20"
          >
            <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>

            <p className="text-gray-300 mb-3">{item.description}</p>

            <p className="text-sm text-gray-400">
              Department: {item.department}
            </p>

            <p className="text-sm text-gray-400">
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Created by: {item.createdBy?.name}
            </p>

            {/* STUDENT SECTION */}
            {role === "student" && (
              <>
                {item.submitted ? (
                  <span className="mt-4 inline-block bg-green-600 px-3 py-1 rounded-lg text-sm font-semibold">
                    Submitted ✅
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedAssignment(item._id);
                      setShowSubmitModal(true);
                    }}
                    className="mt-4 bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-600"
                  >
                    Submit
                  </button>
                )}
              </>
            )}

            {/* ADMIN / TEACHER */}
            {(role === "admin" || role === "teacher") && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>

                <button
                  onClick={() => fetchSubmissions(item._id)}
                  className="bg-purple-500 px-3 py-1 rounded-lg hover:bg-purple-600"
                >
                  View Submissions
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SUBMIT MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-96">
            <h2 className="text-xl mb-4">Upload Assignment</h2>

            <input
              type="file"
              className="w-full mb-4 p-2 rounded text-white"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMISSIONS MODAL */}
      {showSubmissionsModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-[600px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl mb-4">Student Submissions</h2>

            {submissions.length === 0 ? (
              <p>No submissions yet.</p>
            ) : (
              submissions.map((submission) => (
                <div
                  key={submission._id}
                  className="mb-4 p-4 bg-white/10 rounded-lg"
                >
                  <p><strong>Name:</strong> {submission.student?.name}</p>
                  <p><strong>Email:</strong> {submission.student?.email}</p>
                  <p><strong>Department:</strong> {submission.student?.department}</p>

                  {submission.file && (
                    <a
                      href={`http://localhost:5000/${submission.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 underline block mt-2"
                    >
                      Download File
                    </a>
                  )}
                </div>
              ))
            )}

            <button
              onClick={() => setShowSubmissionsModal(false)}
              className="mt-4 bg-gray-600 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}


      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-900 p-8 rounded-2xl w-[500px]">
            <h2 className="text-2xl mb-6">Create Assignment</h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-2 rounded text-black"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 p-2 rounded text-black"
            />

            <input
              type="text"
              placeholder="Department (e.g., IT, CSE)"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full mb-4 p-2 rounded text-black"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full mb-6 p-2 rounded text-black"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateAssignment}
                className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Assignments;