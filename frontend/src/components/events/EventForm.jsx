import { useState, useEffect } from "react";
import TicketTypeFields from "./TicketTypeFields.jsx";

export default function EventForm({ initialEvent = null, onSubmit, mode = "create", loading = false }) {
  // Get current user's name from localStorage for auto-populating organizer
  const getCurrentUserName = () => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        return user.name || "";
      }
    } catch (error) {
      console.error("Error reading user data:", error);
    }
    return "";
  };

  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(initialEvent?.description || "");
  const [date, setDate] = useState(initialEvent?.date || "");
  const [location, setLocation] = useState(initialEvent?.location || "");
  const [organizer, setOrganizer] = useState(initialEvent?.organizer || initialEvent?.organizerName || getCurrentUserName());
  const [status, setStatus] = useState(initialEvent?.status || "draft");

  // ticketTypes : si initialEvent en a, on les reprend, sinon un tableau vide
  const [ticketTypes, setTicketTypes] = useState(
    initialEvent?.ticketTypes && initialEvent.ticketTypes.length > 0
      ? initialEvent.ticketTypes
      : []
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Nettoyer un peu les ticketTypes : ne garder que ceux avec un nom
    const cleanedTicketTypes = ticketTypes
      .filter((t) => t.name && t.name.trim() !== "")
      .map((t) => ({
        ...t,
        price: Number(t.price) || 0,
        capacity: Number(t.capacity) || 0,
      }));

    const eventData = {
      title,
      description,
      date,
      location,
      organizer,
      status,
      ticketTypes: cleanedTicketTypes,
    };

    onSubmit(eventData);
  };

  const isEdit = mode === "edit";

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label className="field-label">Event Title</label>
        <input
          type="text"
          className="input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter event title"
        />
      </div>

      <div className="field">
        <label className="field-label">Description</label>
        <textarea
          className="input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          placeholder="Describe your event..."
          style={{ 
            resize: "vertical",
            minHeight: "120px",
            fontFamily: "inherit"
          }}
        />
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "1rem"
      }}
      className="event-form-grid"
      >
        <div className="field">
          <label className="field-label">Date</label>
          <input
            type="date"
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label className="field-label">Status</label>
          <select
            className="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Location</label>
        <input
          type="text"
          className="input"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          placeholder="e.g., Paris, France or Online"
        />
      </div>

      <div className="field">
        <label className="field-label">Organizer</label>
        <input
          type="text"
          className="input"
          value={organizer}
          onChange={(e) => setOrganizer(e.target.value)}
          required
          placeholder="Organizer name"
        />
      </div>

      {/* Divider */}
      <hr className="neon-divider" style={{ margin: "1.5rem 0" }} />

      {/* Gestion des ticket types */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 className="event-details-section-title" style={{ marginBottom: "1rem" }}>
          Ticket Types
        </h3>
        <TicketTypeFields
          ticketTypes={ticketTypes}
          setTicketTypes={setTicketTypes}
        />
      </div>

      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        justifyContent: "flex-end",
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid rgba(236, 72, 153, 0.2)"
      }}>
        <button 
          className="btn btn-primary" 
          type="submit"
          disabled={loading}
          style={{ minWidth: "150px" }}
        >
          {loading 
            ? (mode === "create" ? "Creating..." : "Saving...") 
            : (mode === "create" ? "Create Event" : "Save Changes")
          }
        </button>
      </div>
    </form>
  );
}
