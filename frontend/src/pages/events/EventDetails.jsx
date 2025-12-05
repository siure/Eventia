import { useParams } from "react-router-dom";
import RegistrationForm from "../../components/events/RegistrationForm.jsx";

export default function EventDetails({ hideRegistrationForm = false }) {
  const { eventId } = useParams();

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

  if (!event) return <p>Event not found.</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>{event.title}</h2>

      <p>{event.description}</p>

      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Status:</strong> {event.status}</p>
      <p><strong>Organizer:</strong> {event.organizerName}</p>

      <h3>Tickets</h3>
      {event.ticketTypes.length === 0 ? (
        <p>No ticket types defined yet.</p>
      ) : (
        <ul>
          {event.ticketTypes.map((ticket) => (
            <li key={ticket.id}>
              {ticket.name} - {ticket.price}€ ({ticket.remaining} left)
            </li>
          ))}
        </ul>
      )}

      {/*Ici on cache le formulaire si hideRegistrationForm est true */}
      {!hideRegistrationForm && (
        <>
          <hr style={{ margin: "1.5rem 0" }} />
          <RegistrationForm event={event} />
        </>
      )}
    </div>
  );
}
