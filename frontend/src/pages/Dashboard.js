import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const Card = ({ title, value, color }) => (
    <div className={`bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/20`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="flex-1 p-10 bg-gradient-to-br from-indigo-900 to-blue-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-10 capitalize">
        Welcome {role} 🎉
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        <Card
          title="Total Events"
          value={stats.totalEvents || 0}
          color="text-cyan-400"
        />

        <Card
          title="Announcements"
          value={stats.totalAnnouncements || 0}
          color="text-yellow-400"
        />

        <Card
          title="Assignments"
          value={stats.totalAssignments || 0}
          color="text-green-400"
        />

        {role === "admin" && (
          <Card
            title="Pending Bookings"
            value={stats.pendingBookings || 0}
            color="text-red-400"
          />
        )}

        {role === "president" && (
          <Card
            title="Approved Bookings"
            value={stats.approvedBookings || 0}
            color="text-purple-400"
          />
        )}

      </div>
    </div>
  );
}

export default Dashboard;