import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="page-section">
      <h2 className="page-title">Register</h2>

      <div className="card auth-card">
        <form>
          <div className="field">
            <label className="field-label">Name</label>
            <input
              type="text"
              className="input"
              placeholder="Your name"
            />
          </div>

          <div className="field">
            <label className="field-label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div className="field">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="********"
            />
          </div>

          <div className="field">
            <label className="field-label">Confirm password</label>
            <input
              type="password"
              className="input"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Register
          </button>
        </form>

        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <Link to="/login" className="navbar-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
