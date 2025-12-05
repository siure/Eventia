import { Link } from "react-router-dom";

export default function ParticipantDashboard() {
  // Fake registrations (même base que MyRegistrations, mais utilisée différemment)
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

  const totalRegistrations = registrations.length;
  const totalTickets = registrations.reduce(
    (sum, reg) => sum + reg.quantity,
    0
  );

  // ici on pourrait filtrer par date pour "upcoming", là on garde tout
  const upcoming = registrations.slice(0, 3);

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Participant Dashboard</h2>

      {/* Stats rapides */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "1rem",
            minWidth: "150px",
            backgroundColor: "#111827",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem" }}>Total registrations</p>
          <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold" }}>
            {totalRegistrations}
          </p>
        </div>

        <div
          style={{
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "1rem",
            minWidth: "150px",
            backgroundColor: "#111827",
          }}
        >
          <p style={{ margin: 0, fontSize: "0.9rem" }}>Total tickets</p>
          <p style={{ margin: 0, fontSize: "1.4rem", fontWeight: "bold" }}>
            {totalTickets}
          </p>
        </div>
      </div>

      {/* Aperçu des prochains events */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0 }}>Upcoming events</h3>
        <Link to="/my-registrations" style={{ fontSize: "0.9rem" }}>
          View all registrations
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p>You have no upcoming events.</p>
      ) : (
        upcoming.map((reg) => (
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
            <h4 style={{ marginBottom: "0.4rem" }}>{reg.eventTitle}</h4>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              <strong>Date:</strong> {reg.eventDate} —{" "}
              <strong>Location:</strong> {reg.eventLocation}
            </p>
            <p style={{ margin: "0.2rem 0 0", fontSize: "0.85rem" }}>
              <strong>Ticket:</strong> {reg.ticketTypeName} —{" "}
              <strong>Quantity:</strong> {reg.quantity}
            </p>

            <div
              style={{
                marginTop: "0.5rem",
                display: "flex",
                gap: "1rem",
                fontSize: "0.85rem",
              }}
            >
              <Link to={`/events/${reg.eventId}`} style={{ color: "#3b82f6" }}>
                View event
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
