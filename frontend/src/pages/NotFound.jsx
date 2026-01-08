import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page-section">
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        maxWidth: "600px",
        margin: "0 auto"
      }}>
        <h2 className="page-title" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          404 - Page Not Found
        </h2>
        <div className="card" style={{ width: "100%", textAlign: "center" }}>
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: " 1rem", display: "inline-block" }}>
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}