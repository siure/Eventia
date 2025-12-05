import { Link } from "react-router-dom";

export default function MyRegistrations() {
  // Fake registrations pour l'instant
  const registrations = [
    {
      id: "r1",
      eventId: 1,
      eventTitle: "Tech Meetup Paris",
      eventDate: "2025-02-10",
      eventLocation: "Paris, France",
      ticketTypeName: "Standard",
      quantity: 2,
      registrationDate: "2025-01-10",
      status: "confirmed",
    },
    {
      id: "r2",
      eventId: 2,
      eventTitle: "Online React Workshop",
      eventDate: "2025-03-01",
      eventLocation: "Online",
      ticketTypeName: "Regular",
      quantity: 1,
      registrationDate: "2025-02-01",
      status: "confirmed",
    },
  ];

  const handleCancel = (registrationId) => {
    // Plus tard : appel API DELETE /registrations/:id
    alert(`Cancel registration ${registrationId} (fake for now)`);
  };

  if (registrations.length === 0) {
    return (
      <div>
        <h2>My Registrations</h2>
        <p>You have no registrations yet.</p>
        <Link to="/events">Browse events</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>My Registrations</h2>

      {registrations.map((reg) => (
        <div
          key={reg.id}
          style={{
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "#111827",
          }}
        >
          <h3>{reg.eventTitle}</h3>

          <p>
            <strong>Event date:</strong> {reg.eventDate}
          </p>
          <p>
            <strong>Location:</strong> {reg.eventLocation}
          </p>
          <p>
            <strong>Ticket type:</strong> {reg.ticketTypeName}
          </p>
          <p>
            <strong>Quantity:</strong> {reg.quantity}
          </p>
          <p>
            <strong>Registration date:</strong> {reg.registrationDate}
          </p>
          <p>
            <strong>Status:</strong> {reg.status}
          </p>

          <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem" }}>
            <Link
              to={`/events/${reg.eventId}`}
              style={{ color: "#3b82f6" }}
            >
              View event
            </Link>

            <button
              onClick={() => handleCancel(reg.id)}
              style={{
                background: "none",
                border: "none",
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              Cancel registration
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
