import { Link, Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div>
      <header
        style={{
          padding: "1rem",
          borderBottom: "1px solid #ddd",
          marginBottom: "1rem",
        }}
      >
        <h1>Eventia</h1>
        <nav style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <Link to="/events">Events</Link>
          <Link to="/dashboard/organizer">Organizer Dashboard</Link>
          <Link to="/dashboard/participant">Participant Dashboard</Link>
          <Link to="/my-registrations">My Registrations</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </nav>
      </header>

      <main style={{ padding: "0 1rem" }}>
        {/* Ici React va afficher la page correspondant à l’URL */}
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
