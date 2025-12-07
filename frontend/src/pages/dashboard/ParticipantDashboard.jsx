import { Link } from "react-router-dom";

export default function ParticipantDashboard() {
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

  const upcoming = registrations.slice(0, 3);

  return (
    <div>
      <h2 className="page-title">Participant Dashboard</h2>

      {/* --- STAT CARDS --- */}
      <div className="card">
        <p className="card-label">Total registrations</p>
        <p style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          {totalRegistrations}
        </p>
      </div>

      <div className="card">
        <p className="card-label-location">Total tickets</p>
        <p style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
          {totalTickets}
        </p>
      </div>

      {/* --- UPCOMING EVENTS HEADER --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1.5rem",
          marginBottom: "0.5rem",
        }}
      >
        <h3 style={{ margin: 0 }}>Upcoming events</h3>

        <Link to="/my-registrations" className="btn btn-primary">
          View all registrations
        </Link>
      </div>

      {/* --- UPCOMING EVENTS LIST --- */}
      {upcoming.map((reg) => (
        <div className="card" key={reg.id}>
          <h4>{reg.eventTitle}</h4>

          {/* Ligne 1 : Date */}
          <p>
            <span className="card-label">Date:</span> {reg.eventDate}
          </p>

          {/* Ligne 2 : Ticket */}
          <p>
            <span className="card-label">Ticket:</span> {reg.ticketTypeName}
          </p>

          {/* Ligne 3 : Location */}
          <p>
            <span className="card-label-location">Location:</span>{" "}
            {reg.eventLocation}
          </p>

          {/* Ligne 4 : Quantity */}
          <p>
            <span className="card-label-location">Quantity:</span>{" "}
            {reg.quantity}
          </p>

          {/* bouton aligné à droite */}
          <div
            style={{
              marginTop: "0.75rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Link to={`/events/${reg.eventId}`} className="btn btn-primary">
              View event
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
