import { Link } from "react-router-dom";

export default function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="event-card"
      style={{
        display: "block",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        textDecoration: "none",
        color: "inherit",
        backgroundColor: "#111827",
      }}
    >
      <h3 style={{ marginBottom: "0.5rem" }}>{event.title}</h3>
      <p style={{ marginBottom: "0.5rem", fontSize: "0.9rem" }}>
        {event.description}
      </p>
      <p style={{ marginBottom: "0.25rem", fontSize: "0.85rem" }}>
        <strong>Date:</strong> {event.date}
      </p>
      <p style={{ marginBottom: "0.25rem", fontSize: "0.85rem" }}>
        <strong>Location:</strong> {event.location}
      </p>
      <p style={{ fontSize: "0.85rem" }}>
        <strong>Status:</strong> {event.status}
      </p>
    </Link>
  );
}
