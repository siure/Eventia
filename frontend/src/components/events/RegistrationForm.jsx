import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm({ event }) {
  const [ticketTypeId, setTicketTypeId] = useState(
    event.ticketTypes[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Normalement ici on appellerait le backend (POST /events/:id/registrations)
    // Pour l'instant : on simule et on redirige vers la page de confirmation
    const selectedTicket = event.ticketTypes.find(
      (t) => t.id === ticketTypeId
    );

    const fakeRegistrationId = "fake-" + Date.now();

    navigate(`/registrations/confirmation/${fakeRegistrationId}`, {
      state: {
        registrationId: fakeRegistrationId,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        ticketTypeName: selectedTicket?.name || "",
        quantity,
      },
    });
  };

  if (event.ticketTypes.length === 0) {
    return <p>No tickets available for registration.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Register for this event</h3>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Ticket type:{" "}
          <select
            value={ticketTypeId}
            onChange={(e) => setTicketTypeId(e.target.value)}
          >
            {event.ticketTypes.map((ticket) => (
              <option key={ticket.id} value={ticket.id}>
                {ticket.name} - {ticket.price}€
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Quantity:{" "}
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
      </div>

      <button type="submit">Register</button>
    </form>
  );
}
