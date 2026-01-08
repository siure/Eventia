import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import RegistrationForm from "../../components/events/RegistrationForm.jsx";
import { getEventById } from "../../services/events.js";
import "../../styles/pages/EventDetails.css";

export default function EventDetails({ hideRegistrationForm = false }) {
  const { eventId } = useParams();

  // // Fake data pour l’instant
  // const events = [
  //   {
  //     id: 1,
  //     title: "Tech Meetup Paris",
  //     description: "A meetup for developers in Paris.",
  //     date: "2025-02-10",
  //     location: "Paris, France",
  //     status: "published",
  //     organizerName: "Alice",
  //     ticketTypes: [
  //       { id: "t1", name: "Standard", price: 20, remaining: 50 },
  //       { id: "t2", name: "VIP", price: 50, remaining: 10 },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     title: "Online React Workshop",
  //     description: "Learn the basics of React in one day.",
  //     date: "2025-03-01",
  //     location: "Online",
  //     status: "published",
  //     organizerName: "Bob",
  //     ticketTypes: [
  //       { id: "t3", name: "Regular", price: 15, remaining: 100 },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     title: "Startup Pitch Night",
  //     description: "Pitch your startup idea to investors.",
  //     date: "2025-04-15",
  //     location: "Lyon, France",
  //     status: "draft",
  //     organizerName: "Charlie",
  //     ticketTypes: [],
  //   },
  // ];

  // const event = events.find((e) => e.id === Number(eventId));

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getEventById(eventId)
      .then((res) => {
        const eventData = res.data.event;
        setEvent(eventData);
      })
      .catch((err) => {
        console.error("Error fetching event:", err);
        setError(err.response?.data?.message || "Failed to load event");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [eventId]);

  if (loading) {
    return <div className="page-section"><p>Loading event...</p></div>;
  }

  if (error || !event) {
    return (
      <div className="page-section">
        <div className="card">
          <p className="error">{error || "Event not found."}</p>
        </div>
      </div>
    );
  }

  // Check if event is in the past
  const eventDate = new Date(event.date);
  const now = new Date();
  const isPastEvent = eventDate < now;

  return (
    <div>
      {/* Titre en néon */}
      <h2 className="page-title">{event.title}</h2>

      {/* Bloc principal avec infos + tickets */}
      <div className="card event-details-layout">
        {/* Colonne gauche : description + meta */}
        <div>
          <p className="event-details-description">{event.description}</p>

          <p>
            <span className="card-label">Date:</span> {event.date}
          </p>
          <p>
            <span className="card-label-location">Location:</span>{" "}
            {event.location}
          </p>

          <p>
            <span className="card-label-location">Organizer:</span>{" "}
            {event.organizerName}
          </p>

          {isPastEvent && (
            <p className="event-details-past-notice">
              <strong>This event has already passed.</strong>
            </p>
          )}
        </div>

        {/* Colonne droite : tickets */}
        <div>
          <h3 className="event-details-section-title">Tickets</h3>

          {event.ticketTypes.length === 0 ? (
            <p className="event-details-no-tickets">
              No ticket types defined yet.
            </p>
          ) : (
            <ul className="ticket-list">
              {event.ticketTypes.map((ticket, index) => {
                const ticketId = ticket.id || index;
                return (
                  <li key={ticketId} className="ticket-item">
                    <div className="ticket-name">{ticket.type}</div>
                    <div className="ticket-meta">
                      <span className="ticket-price">{ticket.price}€</span>
                      <span className="ticket-remaining">
                        {ticket.availableTickets || 0} left
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Ligne néon */}
      {!hideRegistrationForm && !isPastEvent && <hr className="neon-divider" />}

      {/* Formulaire d'inscription dans une card - only show if event is not past */}
      {!hideRegistrationForm && !isPastEvent && (
        <div className="card event-details-registration-card">
          <h3 className="event-details-section-title">
            Register for this event
          </h3>
          <RegistrationForm event={event} />
        </div>
      )}

      {/* Message if trying to register for past event */}
      {!hideRegistrationForm && isPastEvent && (
        <div className="card event-details-registration-card">
          <p className="event-details-past-message">
            Registration is no longer available for this event as it has already passed.
          </p>
        </div>
      )}
    </div>
  );
}
