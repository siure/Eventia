import { Link } from "react-router-dom";

export default function OrganizerDashboard() {
  const events = [
    {
      id: 1,
      title: "Tech Meetup Paris",
      date: "2025-02-10",
      status: "published",
      registrations: 42,
    },
    {
      id: 2,
      title: "Startup Pitch Night",
      date: "2025-04-15",
      status: "draft",
      registrations: 0,
    },
  ];

  const handleDelete = (eventId) => {
    alert(`Delete event ${eventId} (fake for now)`);
  };

  return (
    <div>
      <h2 className="page-title">Organizer Dashboard</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
           marginBottom: "1.5rem",
        }}
      >
        <Link to="/events/create" className="btn btn-primary">
          + Create New Event
        </Link>
      </div>


      {events.map((event) => (
        <div className="card" key={event.id}>
          
          <h3>{event.title}</h3>
          <p>
            <span className="card-label">Date:</span> {event.date}
          </p>
          <p>
            <span className="card-label-status">Status:</span>{" "}
            <span className={event.status === "published" ? "status-published" : "status-draft"}>
              {event.status}
            </span>
          </p>
          <p>
            <span className="card-label-location">Registrations:</span> {event.registrations}
          </p>

          <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem" }}>
            <Link to={`/events/${event.id}`} className="btn btn-primary">
              View
            </Link>

            <Link to={`/events/${event.id}/edit`} className="btn btn-primary">
              Edit
            </Link>

            <button
              className="btn btn-danger"
              onClick={() => handleDelete(event.id)}
            >
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
