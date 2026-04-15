import { useEffect, useState } from "react";
import axios from "axios";

function Events() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 p-10 bg-gradient-to-br from-indigo-900 to-blue-900 min-h-screen text-white">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Events 🎉</h1>
        <p className="text-gray-300 mt-2">
          Explore approved campus events.
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {events.length === 0 && (
          <p className="text-gray-300">No events available.</p>
        )}

        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20 hover:scale-[1.02] transition"
          >
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>

            <p className="text-gray-300 mb-4">
              {event.description || "No description provided"}
            </p>

            <div className="space-y-1 text-gray-200">
              <p>
                <span className="font-semibold">Date:</span>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Time:</span>{" "}
                {event.startTime} - {event.endTime}
              </p>
              <p>
                <span className="font-semibold">Venue:</span>{" "}
                {event.venue?.name || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;