import { Link } from "react-router-dom";
import "../../styles/components/EventCard.css";

export default function EventCard({ event }) {
  return (
    <div className="card event-card">
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>

        <p className="event-card-description">
          {event.description}
        </p>

        <p className="event-card-meta">
          <span className="card-label">Date:</span> {event.date}
        </p>

        <p className="event-card-meta">
          <span className="card-label-location">Location:</span>{" "}
          {event.location}
        </p>

        <div className="event-card-actions">
          {event.id ? (
            <Link 
              to={`/events/${event.id}`} 
              className="btn btn-primary"
            >
              View details
            </Link>
          ) : (
            <span className="btn btn-primary event-card-disabled-btn">
              View details (ID missing)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
