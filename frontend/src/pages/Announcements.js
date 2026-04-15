import { useEffect, useState } from "react";
import axios from "axios";

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/announcements",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleCreateAnnouncement = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/announcements",
        { title, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTitle("");
      setMessage("");
      setShowModal(false);
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/announcements/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 p-10 text-white w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold tracking-wide">
            Announcements 📢
          </h1>
          <p className="text-gray-300 mt-2">
            Stay updated with the latest campus news.
          </p>
        </div>

        {(role === "admin" || role === "teacher") && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:scale-105 transition transform px-5 py-2 rounded-xl shadow-lg"
          >
            + Create
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {announcements.length === 0 ? (
        <div className="text-center mt-20 text-gray-300">
          <h2 className="text-2xl mb-3">No announcements yet 🚀</h2>
          <p>Be the first to share something important.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {announcements.map((item) => (
            <div
              key={item._id}
              className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl hover:scale-[1.02] transition transform"
            >
              <h2 className="text-2xl font-semibold mb-3">
                {item.title}
              </h2>

              <p className="text-gray-300 mb-4">
                {item.message}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>
                  Posted by {item.postedBy?.name}
                </span>

                <span>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              {role === "admin" && (
                <button
                  onClick={() => handleDelete(item._id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">

          <div className="bg-gray-900 p-8 rounded-2xl w-96 shadow-2xl animate-fadeIn">

            <h2 className="text-2xl font-bold mb-6">
              Create Announcement
            </h2>

            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-3 rounded-lg bg-gray-200 text-black"
            />

            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full mb-6 p-3 rounded-lg bg-gray-200 text-black"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateAnnouncement}
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
              >
                Post
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Announcements;