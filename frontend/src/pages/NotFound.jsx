import { Link } from "react-router-dom";
import "../styles/pages/NotFound.css";

export default function NotFound() {
  return (
    <div className="page-section">
      <div className="not-found-container">
        <h2 className="page-title not-found-title">
          404 - Page Not Found
        </h2>
        <div className="card not-found-card">
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary not-found-link">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}