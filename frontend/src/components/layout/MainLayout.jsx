import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-title">EVENTIA</div>

          <nav className="navbar-links">
            <Link to="/events" className="navbar-link">Events</Link>
            <Link to="/dashboard/organizer" className="navbar-link">Organizer Dashboard</Link>
            <Link to="/dashboard/participant" className="navbar-link">Participant Dashboard</Link>
            <Link to="/my-registrations" className="navbar-link">My Registrations</Link>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </nav>
        </div>
      </header>

      {/*centrage global */}
      <main className="app-container">
        <div className="page-section">
          <Outlet />
        </div>
      </main>
    </>
  );
}
