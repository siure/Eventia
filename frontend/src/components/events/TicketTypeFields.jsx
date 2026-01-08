import "../../styles/components/TicketTypeFields.css";

export default function TicketTypeFields({ ticketTypes, setTicketTypes }) {
  const handleChange = (index, field, value) => {
    const updated = ticketTypes.map((ticket, i) =>
      i === index ? { ...ticket, [field]: value } : ticket
    );
    setTicketTypes(updated);
  };

  const handleAdd = () => {
    const newTicket = {
      id: Date.now().toString(), // fake id
      name: "",
      price: "",
      capacity: "",
    };
    setTicketTypes([...ticketTypes, newTicket]);
  };

  const handleRemove = (index) => {
    const updated = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(updated);
  };

  return (
    <div>
      {ticketTypes.length === 0 && (
        <p className="ticket-type-empty-message">
          No ticket types added yet. Click the button below to add one.
        </p>
      )}

      {ticketTypes.map((ticket, index) => (
        <div
          key={ticket.id || index}
          className="card ticket-type-card"
        >
          <div className="ticket-type-header">
            <h4 className="ticket-type-title">
              Ticket Type #{index + 1}
            </h4>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="btn btn-danger ticket-type-remove-btn"
            >
              Remove
            </button>
          </div>

          <div className="field">
            <label className="field-label">Ticket Name</label>
            <input
              type="text"
              className="input"
              value={ticket.name}
              onChange={(e) =>
                handleChange(index, "name", e.target.value)
              }
              placeholder="e.g., Standard, VIP, Early Bird"
            />
          </div>

          <div className="event-form-grid ticket-type-grid">
            <div className="field">
              <label className="field-label">Price (€)</label>
              <input
                type="number"
                className="input"
                min="0"
                step="0.01"
                value={ticket.price}
                onChange={(e) =>
                  handleChange(index, "price", e.target.value)
                }
                placeholder="0.00"
              />
            </div>

            <div className="field">
              <label className="field-label">Capacity</label>
              <input
                type="number"
                className="input"
                min="1"
                value={ticket.capacity}
                onChange={(e) =>
                  handleChange(index, "capacity", e.target.value)
                }
                placeholder="100"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="btn ticket-type-add-btn"
      >
        + Add Ticket Type
      </button>
    </div>
  );
}
