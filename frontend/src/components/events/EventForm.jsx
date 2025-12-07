import { useState } from "react";
import TicketTypeFields from "./TicketTypeFields.jsx";

export default function EventForm({ initialEvent = null, onSubmit, mode = "create" }) {
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(initialEvent?.description || "");
  const [date, setDate] = useState(initialEvent?.date || "");
  const [location, setLocation] = useState(initialEvent?.location || "");
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
      status,
      ticketTypes: cleanedTicketTypes,
    };

    onSubmit(eventData);
  };

  const isEdit = mode === "edit";

  return (
    <form onSubmit={handleSubmit}>
      <h2 style={{ marginBottom: "1rem" }}>
        {isEdit ? "Edit Event" : "Create Event"}
      </h2>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Title <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Description <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Date <br />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Location <br />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "0.5rem" }}>
        <label>
          Status <br />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      {/* Gestion des ticket types */}
      <TicketTypeFields
        ticketTypes={ticketTypes}
        setTicketTypes={setTicketTypes}
      />

      <button className="btn btn-primary" type="submit">
        {mode === "create" ? "Create Event" : "Save Changes"}
      </button>

    </form>
  );
}
