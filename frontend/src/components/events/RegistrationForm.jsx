import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerForEvent } from "../../services/registrations";

export default function RegistrationForm({ event }) {
  const navigate = useNavigate();
  const [ticketType_id, setTicketType_id] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (event?.ticketTypes && event.ticketTypes.length > 0) {
      const firstTicket = event.ticketTypes[0];
      const ticketId = firstTicket.id;
      if (ticketId) {
        setTicketType_id(ticketId.toString());
      }
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    

    if (!token){
      const redirectPath = window.location.pathname + window.location.search;
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    if (!ticketType_id) {
      setError("Please select a ticket type");
      return;
    }

    if (quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await registerForEvent(event.id, ticketType_id, quantity);
      
      
      const registration = response.data.registration;
      navigate("/registrations/confirmation", {
        state: {
          registrationId: registration.id,
          eventTitle: registration.event_id?.title || event.title,
          eventDate: registration.event_id?.date || event.date,
          eventLocation: registration.event_id?.location || event.location,
          ticketTypeName: event.ticketTypes.find(
            (tt) => tt.id?.toString() === ticketType_id.toString()
          )?.type || "Unknown",
          quantity: registration.quantity || quantity,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!event || !event.ticketTypes || event.ticketTypes.length === 0) {
    return <p>No tickets available for registration.</p>;
  }

  // Filter out ticket types with no available tickets
  const availableTicketTypes = event.ticketTypes.filter(
    (ticket) => (ticket.availableTickets || 0) > 0
  );

  if (availableTicketTypes.length === 0) {
    return <p className="error">All tickets for this event are sold out.</p>;
  }

  const selectedTicket = availableTicketTypes.find(
    (ticket) => ticket.id?.toString() === ticketType_id.toString()
  );
  const maxQuantity = selectedTicket?.availableTickets || 0;

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error" style={{ marginBottom: "1rem", padding: "0.75rem" }}>
          {error}
        </div>
      )}

      <div className="field">
        <label className="field-label">Ticket type</label>
        <select
          className="select"
          value={ticketType_id}
          onChange={(e) => {
            setTicketType_id(e.target.value);
            setQuantity(1); 
          }}
          required
        >
          <option value="">Select a ticket type</option>
          {availableTicketTypes.map((ticket) => {
            const ticketId = ticket.id?.toString();
            return (
              <option key={ticketId} value={ticketId}>
                {ticket.type} - {ticket.price}€ ({ticket.availableTickets} available)
              </option>
            );
          })}
        </select>
      </div>

      <div className="field">
        <label className="field-label">Quantity</label>
        <input
          type="number"
          className="input"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 1 && val <= maxQuantity) {
              setQuantity(val);
            }
          }}
          required
        />
        {selectedTicket && (
          <small style={{ display: "block", marginTop: "0.25rem", color: "var(--text-muted)" }}>
            Maximum {maxQuantity} tickets available
          </small>
        )}
      </div>

      <button 
        className="btn btn-primary" 
        type="submit"
        disabled={loading || !ticketType_id}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
