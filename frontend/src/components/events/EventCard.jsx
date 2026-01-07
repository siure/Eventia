import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <div className="card event-card">
      <div className="event-card-content">
        <h3 style={{ marginBottom: "0.4rem" }}>{event.title}</h3>

        <p style={{ marginBottom: "0.6rem", fontSize: "0.9rem" }}>
          {event.description}
        </p>

        <p style={{ fontSize: "0.9rem" }}>
          <span className="card-label">Date:</span> {event.date}
        </p>

        <p style={{ fontSize: "0.9rem" }}>
          <span className="card-label-location">Location:</span>{" "}
          {event.location}
        </p>

        <div style={{ marginTop: "0.75rem" }}>
          <Link to={`/events/${event.id}`} className="btn btn-primary">
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
