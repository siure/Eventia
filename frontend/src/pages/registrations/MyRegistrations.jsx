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
      <div className="page-section">
        <h2 className="page-title">My Registrations</h2>
        <p>You have no registrations yet.</p>
        <Link to="/events" className="btn btn-primary">
          Browse events
        </Link>
      </div>
    );
  }

  return (
    <div className="page-section">
      <h2 className="page-title">My Registrations</h2>

      {registrations.map((reg) => (
        <div key={reg.id} className="card registration-card">
          <h3 className="registration-title">{reg.eventTitle}</h3>

          <div className="registration-grid">
            <p>
              <span className="card-label">Event date:</span> {reg.eventDate}
            </p>

            <p>
              <span className="card-label-location">Location:</span>{" "}
              {reg.eventLocation}
            </p>

            <p>
              <span className="card-label">Ticket type:</span>{" "}
              {reg.ticketTypeName}
            </p>

            <p>
              <span className="card-label-location">Quantity:</span>{" "}
              {reg.quantity}
            </p>

            <p>
              <span className="card-label-status">Registration date:</span>{" "}
              {reg.registrationDate}
            </p>

            <p>
              <span className="card-label-status">Status:</span>{" "}
              <span
                className={
                  reg.status === "confirmed"
                    ? "status-published"
                    : "status-draft"
                }
              >
                {reg.status}
              </span>
            </p>
          </div>

          <div className="registration-actions">
            <Link to={`/events/${reg.eventId}`} className="btn btn-primary">
              View
            </Link>

            <button
              className="btn btn-danger"
              onClick={() => handleCancel(reg.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
