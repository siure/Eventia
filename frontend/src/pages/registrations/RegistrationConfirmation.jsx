import { useLocation, Link } from "react-router-dom";

export default function RegistrationConfirmation() {
  const location = useLocation();
  const data = location.state;

  // Cas où on arrive ici sans données
  if (!data) {
    return (
      <div>
        <h2 className="page-title">Registration Confirmation</h2>
        <p>No registration data found.</p>
        <Link to="/events" className="btn btn-primary">
          Back to events
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="page-title">Registration Successful</h2>
      <p className="page-subtitle">
        Your registration has been recorded (fake for now).
      </p>

      {/* Bloc d’info */}
      <div className="success-card">
        <h3 className="success-title">Registration Details</h3>

        <div className="success-info">
          <p>
            <span className="card-label">Event:</span> {data.eventTitle}
          </p>
          <p>
            <span className="card-label">Date:</span> {data.eventDate}
          </p>
          <p>
            <span className="card-label-location">Location:</span>{" "}
            {data.eventLocation}
          </p>
          <p>
            <span className="card-label">Ticket type:</span>{" "}
            {data.ticketTypeName}
          </p>
          <p>
            <span className="card-label-location">Quantity:</span>{" "}
            {data.quantity}
          </p>
          <p>
            <span className="card-label-status">Registration ID:</span>{" "}
            {data.registrationId}
          </p>
        </div>
      </div>

      {/* Boutons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
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
