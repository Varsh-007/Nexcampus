import { useState, useEffect } from "react";
import axios from "axios";

function BookEvent() {
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [venues, setVenues] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/venues", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVenues(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVenues();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/bookings/book",
        { eventName, venue, date, startTime, endTime },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Booking request submitted!");
      setEventName("");
      setVenue("");
      setDate("");
      setStartTime("");
      setEndTime("");

    } catch (error) {
      alert(error.response?.data?.message || "Error submitting booking");
    }
  };

  return (
    <div className="flex-1 p-10 bg-gradient-to-br from-indigo-900 to-blue-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Book Event Slot</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-indigo-800 p-8 rounded-xl shadow-lg max-w-xl"
      >
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black"
          required
        />

        <select
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black"
          required
        >
          <option value="">Select Venue</option>
          {venues.map((v) => (
            <option key={v._id} value={v._id}>
              {v.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black"
          required
        />

        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full mb-4 p-2 rounded text-black"
          required
        />

        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full mb-6 p-2 rounded text-black"
          required
        />

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded font-semibold"
        >
          Submit Booking
        </button>
      </form>
    </div>
  );
}

export default BookEvent;