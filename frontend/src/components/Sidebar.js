import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("role")?.toLowerCase();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const linkClass = (path) =>
    `block px-3 py-2 rounded-lg transition ${
      location.pathname === path
        ? "bg-white/20 text-cyan-300"
        : "hover:text-cyan-400"
    }`;

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-white p-6 flex flex-col justify-between shadow-2xl">

      {/* Top Section */}
      <div>
        <h2 className="text-2xl font-bold mb-10 tracking-wide">
          NexCampus 💙
        </h2>

        <nav className="space-y-4 text-sm font-medium">

          <Link to="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/announcements" className={linkClass("/announcements")}>
            Announcements
          </Link>

          <Link to="/assignments" className={linkClass("/assignments")}>
            Assignments
          </Link>

          <Link to="/events" className={linkClass("/events")}>
            Events
          </Link>

          {/* Admin Only */}
          {role === "admin" && (
            <Link to="/manage-bookings" className={linkClass("/manage-bookings")}>
              Manage Bookings
            </Link>
          )}

          {/* President Only */}
          {role === "president" && (
            <Link to="/book-event" className={linkClass("/book-event")}>
              Book Event Slot
            </Link>
          )}
        </nav>
      </div>

      {/* Bottom Section */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 transition p-2 rounded-lg text-white w-full font-medium shadow-md"
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;