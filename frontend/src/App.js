import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Announcements from "./pages/Announcements";
import Assignments from "./pages/Assignments";
import Events from "./pages/Events";
import BookEvent from "./pages/BookEvent";
import ManageBookings from "./pages/ManageBookings";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import CreateAnnouncement from "./pages/CreateAnnouncement";

function App() {
  const token = localStorage.getItem("token");

  const Layout = (Component) => (
    <div className="flex">
      <Sidebar />
      <Component />
    </div>
  );

  return (
    <Router>
      <Routes>

        {/* Default route */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            token ? Layout(Dashboard) : <Navigate to="/login" />
          }
        />

        {/* Announcements */}
        <Route
          path="/announcements"
          element={
            token ? Layout(Announcements) : <Navigate to="/login" />
          }
        />

        <Route
          path="/create-announcement"
          element={
            token ? Layout(CreateAnnouncement) : <Navigate to="/login" />
          }
        />

        

        {/* Assignments */}
        <Route
          path="/assignments"
          element={
            token ? Layout(Assignments) : <Navigate to="/login" />
          }
        />

        {/* Events */}
        <Route
          path="/events"
          element={
            token ? Layout(Events) : <Navigate to="/login" />
          }
        />

        {/* President Booking Page */}
        <Route
          path="/book-event"
          element={
            token ? Layout(BookEvent) : <Navigate to="/login" />
          }
        />

        {/* Admin Manage Bookings */}
        <Route
          path="/manage-bookings"
          element={
            token ? Layout(ManageBookings) : <Navigate to="/login" />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;