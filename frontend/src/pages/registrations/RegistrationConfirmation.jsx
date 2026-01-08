import { useLocation, Link } from "react-router-dom";
import "../../styles/pages/RegistrationConfirmation.css";

export default function RegistrationConfirmation() {
  const location = useLocation();
  const data = location.state;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  
  if (!data) {
    return (
      <div className="page-section">
        <h2 className="page-title">Registration Confirmation</h2>
        <div className="card">
          <p>No registration data found.</p>
          <Link to="/events" className="btn btn-primary registration-confirmation-back-btn">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <h2 className="page-title">Registration Successful!</h2>
      <p className="page-subtitle">
        Your registration has been confirmed.
      </p>

      {/* Info block */}
      <div className="card registration-confirmation-details-card">
        <h3 className="registration-confirmation-details-title">
          Registration Details
        </h3>

        <div className="registration-confirmation-details-grid">
          <p>
            <span className="card-label">Event:</span> {data.eventTitle || "N/A"}
          </p>
          <p>
            <span className="card-label">Date:</span> {formatDate(data.eventDate)}
          </p>
          <p>
            <span className="card-label-location">Location:</span>{" "}
            {data.eventLocation || "N/A"}
          </p>
          <p>
            <span className="card-label">Ticket type:</span>{" "}
            {data.ticketTypeName || "N/A"}
          </p>
          <p>
            <span className="card-label-location">Quantity:</span>{" "}
            {data.quantity || 1}
          </p>
          {data.registrationId && (
            <p>
              <span className="card-label-status">Registration ID:</span>{" "}
              {data.registrationId}
            </p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="registration-confirmation-actions">
        <Link to="/events" className="btn btn-primary">
          Back to Events
        </Link>

        <Link to="/my-registrations" className="btn">
          My Registrations
        </Link>
      </div>
    </div>
  );
}
