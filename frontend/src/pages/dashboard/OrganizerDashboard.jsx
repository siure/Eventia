import { Link } from "react-router-dom";

export default function OrganizerDashboard() {
  // Fake events created by the organizer
  const myEvents = [
    {
      id: 1,
      title: "Tech Meetup Paris",
      date: "2025-02-10",
      status: "published",
      registrations: 42, // fake count
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      date: "2025-04-15",
      status: "draft",
      registrations: 0,
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>Organizer Dashboard</h2>

      {/* Button create new */}
      <div style={{ marginBottom: "1rem" }}>
        <Link
          to="/events/create"
          style={{
            padding: "0.5rem 1rem",
            display: "inline-block",
            borderRadius: "4px",
            border: "1px solid #953bf6ff",
            color: "#953bf6ff",
            textDecoration: "none",
          }}
        >
          + Create New Event
        </Link>
      </div>

      {/* Event list */}
      {myEvents.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        myEvents.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #333",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              backgroundColor: "#111827",
            }}
          >
            <h3>{event.title}</h3>

            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Status:</strong> {event.status}
            </p>
            <p>
              <strong>Registrations:</strong> {event.registrations}
            </p>

            {/* Action buttons */}
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem" }}>
              <Link
                to={`/events/${event.id}/edit`}
                style={{ color: "#3b82f6" }}
              >
                Edit
              </Link>

              <Link
                to={`/events/${event.id}`}
                style={{ color: "#d413dbff" }}
              >
                View
              </Link>

              <button
                onClick={() => alert("Delete (fake for now)")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff0040ff",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>

              <button
                onClick={() =>
                  alert("View registrations (fake for now)")
                }
                style={{
                  background: "none",
                  border: "none",
                  color: "#f892f3ff",
                  cursor: "pointer",
                }}
              >
                View Registrations
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
