import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="page-section">
      <h2 className="page-title">Login</h2>

      <div className="card auth-card">
        <form>
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: "0.75rem", fontSize: "0.9rem" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="navbar-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
