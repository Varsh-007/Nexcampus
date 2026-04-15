import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateEvent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [venues, setVenues] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
  });

  // Fetch venues for dropdown
  const fetchVenues = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/venues",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVenues(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/events/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Event created successfully!");
      navigate("/events");

    } catch (error) {
      alert(error.response?.data?.message || "Error creating event");
    }
  };

  return (
    <div className="p-8 w-full bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Create Event</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md max-w-lg"
      >
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          required
        />

        <div className="flex gap-4 mb-4">
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-1/2 border p-2 rounded"
            required
          />

          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-1/2 border p-2 rounded"
            required
          />
        </div>

        {/* Venue Dropdown */}
        <select
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
          required
        >
          <option value="">Select Venue</option>
          {venues.map((venue) => (
            <option key={venue._id} value={venue._id}>
              {venue.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;