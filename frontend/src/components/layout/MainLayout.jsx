import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* EVENTIA renvoie vers /events */}
          <Link to="/events" className="navbar-title">
            EVENTIA
          </Link>

          <nav className="navbar-links">
            {/* Tu peux garder ou enlever ces liens plus tard si tu veux */}
            <Link to="/dashboard/organizer" className="navbar-link">
              Organizer Dashboard
            </Link>
            <Link to="/dashboard/participant" className="navbar-link">
              Participant Dashboard
            </Link>
            <Link to="/my-registrations" className="navbar-link">
              My Registrations
            </Link>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </nav>
        </div>
      </header>

      {/* 🔹 Bouton "Profile" flottant en haut à droite */}
      <Link to="/dashboard-switch" className="profile-button">
        Profile
      </Link>

      <main className="app-container">
        <div className="page-section">
          <Outlet />
        </div>
      </main>
    </>
  );
}
