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
        <p style={{ 
          fontSize: "0.9rem", 
          color: "var(--text-muted)",
          marginBottom: "1rem",
          fontStyle: "italic"
        }}>
          No ticket types added yet. Click the button below to add one.
        </p>
      )}

      {ticketTypes.map((ticket, index) => (
        <div
          key={ticket.id || index}
          className="card"
          style={{
            marginBottom: "1rem",
            borderColor: "rgba(236, 72, 153, 0.3)",
            backgroundColor: "rgba(15, 23, 42, 0.6)",
          }}
        >
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "1rem"
          }}>
            <h4 style={{ 
              margin: 0, 
              fontSize: "1rem",
              color: "var(--primary-soft)"
            }}>
              Ticket Type #{index + 1}
            </h4>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="btn btn-danger"
              style={{ 
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem"
              }}
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

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "1rem",
            marginTop: "0.75rem"
          }}
          className="event-form-grid"
          >
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
        className="btn"
        style={{
          marginTop: "0.5rem",
          borderColor: "var(--primary)",
          color: "var(--primary)",
        }}
      >
        + Add Ticket Type
      </button>
    </div>
  );
}
