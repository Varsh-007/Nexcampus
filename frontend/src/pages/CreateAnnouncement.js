import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateAnnouncement() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/announcements",
        { title, message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Announcement created!");
      navigate("/announcements");

    } catch (error) {
      alert(error.response?.data?.message || "Error creating announcement");
    }
  };

  return (
    <div className="flex-1 p-10 bg-gradient-to-br from-indigo-900 to-blue-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Create Announcement</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-xl border border-white/20 max-w-xl"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black"
          required
        />

        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full mb-6 p-2 rounded text-black"
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateAnnouncement;