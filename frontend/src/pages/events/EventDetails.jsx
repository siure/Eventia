import { useParams } from "react-router-dom";
import RegistrationForm from "../../components/events/RegistrationForm.jsx";

export default function EventDetails({ hideRegistrationForm = false }) {
  const { eventId } = useParams();

  // Fake data pour l’instant
  const events = [
    {
      id: 1,
      title: "Tech Meetup Paris",
      description: "A meetup for developers in Paris.",
      date: "2025-02-10",
      location: "Paris, France",
      status: "published",
      organizerName: "Alice",
      ticketTypes: [
        { id: "t1", name: "Standard", price: 20, remaining: 50 },
        { id: "t2", name: "VIP", price: 50, remaining: 10 },
      ],
    },
    {
      id: 2,
      title: "Online React Workshop",
      description: "Learn the basics of React in one day.",
      date: "2025-03-01",
      location: "Online",
      status: "published",
      organizerName: "Bob",
      ticketTypes: [
        { id: "t3", name: "Regular", price: 15, remaining: 100 },
      ],
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      description: "Pitch your startup idea to investors.",
      date: "2025-04-15",
      location: "Lyon, France",
      status: "draft",
      organizerName: "Charlie",
      ticketTypes: [],
    },
  ];

  const event = events.find((e) => e.id === Number(eventId));

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div>
      {/* Titre en néon */}
      <h2 className="page-title">{event.title}</h2>

      {/* Bloc principal avec infos + tickets */}
      <div className="card event-details-layout">
        {/* Colonne gauche : description + meta */}
        <div>
          <p style={{ marginBottom: "1rem" }}>{event.description}</p>

          <p>
            <span className="card-label">Date:</span> {event.date}
          </p>
          <p>
            <span className="card-label-location">Location:</span>{" "}
            {event.location}
          </p>
          <p>
            <span className="card-label-status">Status:</span>{" "}
            <span
              className={
                event.status === "published"
                  ? "status-published"
                  : "status-draft"
              }
            >
              {event.status}
            </span>
          </p>
          <p>
            <span className="card-label-location">Organizer:</span>{" "}
            {event.organizerName}
          </p>
        </div>

        {/* Colonne droite : tickets */}
        <div>
          <h3 className="event-details-section-title">Tickets</h3>

          {event.ticketTypes.length === 0 ? (
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              No ticket types defined yet.
            </p>
          ) : (
            <ul className="ticket-list">
              {event.ticketTypes.map((ticket) => (
                <li key={ticket.id} className="ticket-item">
                  <div className="ticket-name">{ticket.name}</div>
                  <div className="ticket-meta">
                    <span className="ticket-price">{ticket.price}€</span>
                    <span className="ticket-remaining">
                      {ticket.remaining} left
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Ligne néon */}
      {!hideRegistrationForm && <hr className="neon-divider" />}

      {/* Formulaire d’inscription dans une card */}
      {!hideRegistrationForm && (
        <div className="card">
          <h3 className="event-details-section-title">
            Register for this event
          </h3>
          <RegistrationForm event={event} />
        </div>
      )}
    </div>
  );
}
