import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventForm from "../../components/events/EventForm.jsx";
import { getEventById, updateEvent } from "../../services/events";

export default function EditEvent() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getEventById(eventId);
        const eventData = response.data.event;
        
        // Transform backend data to frontend format
        // Backend uses 'type', frontend form uses 'name'
        const transformedEvent = {
          ...eventData,
          date: new Date(eventData.date).toISOString().split("T")[0],
          ticketTypes: eventData.ticketTypes.map((tt) => ({
            id: tt.id,
            name: tt.type, // Map type to name for the form
            price: tt.price,
            capacity: tt.capacity,
          })),
        };
        
        setEvent(transformedEvent);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(
          err.response?.data?.message || "Failed to load event. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleEditEvent = async (updatedEvent) => {
    setSaving(true);
    setError(null);

    try {
      // Transform ticketTypes: name -> type
      const transformedTicketTypes = updatedEvent.ticketTypes.map((tt) => ({
        type: tt.name || tt.type || "",
        price: Number(tt.price) || 0,
        capacity: Number(tt.capacity) || 0,
      }));

      const eventPayload = {
        ...updatedEvent,
        ticketTypes: transformedTicketTypes,
      };

      await updateEvent(eventId, eventPayload);
      
      // Navigate to dashboard on success
      navigate("/dashboard", { 
        state: { message: "Event updated successfully!" } 
      });
    } catch (err) {
      console.error("Error updating event:", err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Failed to update event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-section">
        <p>Loading event...</p>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="page-section">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-section">
        <p>Event not found.</p>
      </div>
    );
  }

  return (
    <div className="page-section">
      <h2 className="page-title">Edit event: {event.title}</h2>

      {error && (
        <div className="card" style={{ marginBottom: "1rem" }}>
          <p className="error">{error}</p>
        </div>
      )}

      <EventForm
        mode="edit"
        initialEvent={event}
        onSubmit={handleEditEvent}
        loading={saving}
      />
    </div>
  );
}
