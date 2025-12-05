import { useLocation, Link } from "react-router-dom";

export default function RegistrationConfirmation() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    // Si quelqu'un arrive ici sans passer par le formulaire
    return (
      <div>
        <h2>Registration Confirmation</h2>
        <p>No registration data found.</p>
        <Link to="/events">Back to events</Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Registration Confirmed ✅</h2>

      <p>Your registration has been recorded (fake for now).</p>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "8px",
          padding: "1rem",
          margin: "1rem 0",
          backgroundColor: "#111827",
        }}
      >
        <h3>{data.eventTitle}</h3>
        <p>
          <strong>Date:</strong> {data.eventDate}
        </p>
        <p>
          <strong>Location:</strong> {data.eventLocation}
        </p>
        <p>
          <strong>Ticket type:</strong> {data.ticketTypeName}
        </p>
        <p>
          <strong>Quantity:</strong> {data.quantity}
        </p>
        <p>
          <strong>Registration ID:</strong> {data.registrationId}
        </p>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/events">⬅ Back to events</Link>
        <Link to="/my-registrations">Go to My Registrations</Link>
      </div>
    </div>
  );
}
