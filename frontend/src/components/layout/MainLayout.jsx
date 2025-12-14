import { Link, Outlet, useNavigate } from "react-router-dom";

export default function MainLayout() {
  const navigate = useNavigate();

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
        {/* Left: title */}
        <div className="navbar-title">EVENTIA</div>

        {/* Center / left links */}
        <nav className="navbar-links">
          <Link to="/events" className="navbar-link">Events</Link>
          <Link to="/my-registrations" className="navbar-link">My Registrations</Link>
          <Link to="/login" className="navbar-link">Login</Link>
          <Link to="/register" className="navbar-link">Register</Link>
        </nav>

        {/* Right: user profile */}
        <div className="navbar-profile">
          <button
            onClick={() => navigate("/user-profile")}
            className="profile-btn"
            title="User Profile"
          >
            👤
          </button>
        </div>
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
