import React, { useEffect, useState } from "react";
import axios from "axios";

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const approveBooking = async (id) => {
    try {
      setLoadingId(id);

      const res = await axios.put(
        `http://localhost:5000/api/bookings/approve/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchBookings();

    } catch (error) {
      alert(error.response?.data?.message || "Approval failed");
    } finally {
      setLoadingId(null);
    }
  };

  const rejectBooking = async (id) => {
    try {
      setLoadingId(id);

      const res = await axios.delete(
        `http://localhost:5000/api/bookings/reject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message);
      fetchBookings();

    } catch (error) {
      alert(error.response?.data?.message || "Rejection failed");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Approved")
      return "bg-green-500 text-white";
    if (status === "Pending")
      return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#1e1b4b] via-[#2e2a78] to-[#312e81] text-white p-10">
      <h2 className="text-4xl font-bold mb-8">Manage Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-300">No booking requests available.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl"
            >
              <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {booking.startTime} - {booking.endTime}</p>
              <p><strong>Venue:</strong> {booking.venue?.name}</p>
              <p><strong>Requested By:</strong> {booking.requestedBy?.name}</p>

              <div className="mt-3">
                <span className={`px-3 py-1 rounded text-sm ${getStatusBadge(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              {booking.status === "Pending" && (
                <div className="mt-4 space-x-4">
                  <button
                    disabled={loadingId === booking._id}
                    onClick={() => approveBooking(booking._id)}
                    className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg transition"
                  >
                    {loadingId === booking._id ? "Processing..." : "Approve"}
                  </button>

                  <button
                    disabled={loadingId === booking._id}
                    onClick={() => rejectBooking(booking._id)}
                    className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
                  >
                    {loadingId === booking._id ? "Processing..." : "Reject"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageBookings;