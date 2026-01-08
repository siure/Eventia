import { useEffect, useState } from "react";
import EventCard from "../../components/events/EventCard.jsx";
import { getEvents } from "../../services/events.js";
import "../../styles/pages/EventList.css";

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEvents()
      .then((res) => {
        const allEvents = res.data.events || [];
        // Additional safety check: filter out any past events
        const now = new Date();
        const futureEvents = allEvents.filter((event) => {
          try {
            const eventDate = new Date(event.date);
            return eventDate >= now;
          } catch {
            return true; // Keep event if date parsing fails
          }
        });
        setEvents(futureEvents);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
        setError(err.response?.data?.message || "Failed to load events");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page-section">
        <h2 className="page-title">Events</h2>
        <div className="card">
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-section">
        <h2 className="page-title">Events</h2>
        <div className="card">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-section">
      <h2 className="page-title">Events</h2>

     

      {events.length === 0 ? (
        <div className="card">
          <p className="event-list-empty">
            No upcoming events available at the moment.
          </p>
        </div>
      ) : (
        events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))
      )}
    </div>
  );
}
