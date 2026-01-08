import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventForm from "../../components/events/EventForm.jsx";
import { createEvent } from "../../services/events";

export default function CreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateEvent = async (eventData) => {
    setLoading(true);
    setError(null);

    try {
      // Transform ticketTypes: name -> type, and ensure proper format
      const transformedTicketTypes = eventData.ticketTypes.map((tt) => ({
        type: tt.name || tt.type || "",
        price: Number(tt.price) || 0,
        capacity: Number(tt.capacity) || 0,
      }));

      const eventPayload = {
        ...eventData,
        ticketTypes: transformedTicketTypes,
      };

      const response = await createEvent(eventPayload);
      
      // Navigate to dashboard on success
      navigate("/dashboard", { 
        state: { message: "Event created successfully!" } 
      });
    } catch (err) {
      console.error("Error creating event:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-section">
      <h2 className="page-title">Create a New Event</h2>

      {error && (
        <div className="card" style={{ 
          marginBottom: "1.5rem",
          borderColor: "var(--accent)",
          backgroundColor: "rgba(236, 72, 153, 0.1)"
        }}>
          <p className="error">{error}</p>
        </div>
      )}

      <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <EventForm 
          mode="create" 
          onSubmit={handleCreateEvent}
          loading={loading}
        />
      </div>
    </div>
  );
}
