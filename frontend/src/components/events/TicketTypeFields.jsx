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
    <div style={{ marginTop: "1rem" }}>
      <h3>Ticket types</h3>

      {ticketTypes.length === 0 && (
        <p style={{ fontSize: "0.9rem" }}>No ticket types yet.</p>
      )}

      {ticketTypes.map((ticket, index) => (
        <div
          key={ticket.id || index}
          style={{
            border: "1px solid #333",
            borderRadius: "6px",
            padding: "0.75rem",
            marginBottom: "0.5rem",
            backgroundColor: "#020617",
          }}
        >
          <div style={{ marginBottom: "0.4rem" }}>
            <label>
              Name{" "}
              <input
                type="text"
                value={ticket.name}
                onChange={(e) =>
                  handleChange(index, "name", e.target.value)
                }
                style={{ marginLeft: "0.5rem" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "0.4rem" }}>
            <label>
              Price (€){" "}
              <input
                type="number"
                min="0"
                value={ticket.price}
                onChange={(e) =>
                  handleChange(index, "price", e.target.value)
                }
                style={{ marginLeft: "0.5rem", width: "80px" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "0.4rem" }}>
            <label>
              Capacity{" "}
              <input
                type="number"
                min="0"
                value={ticket.capacity}
                onChange={(e) =>
                  handleChange(index, "capacity", e.target.value)
                }
                style={{ marginLeft: "0.5rem", width: "80px" }}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={() => handleRemove(index)}
            style={{
              background: "none",
              border: "none",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "0.85rem",
              padding: 0,
            }}
          >
            Remove ticket type
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        style={{
          marginTop: "0.5rem",
          padding: "0.4rem 0.8rem",
          borderRadius: "4px",
          border: "1px solid #3b82f6",
          color: "#3b82f6",
          background: "transparent",
          cursor: "pointer",
          fontSize: "0.9rem",
        }}
      >
        + Add ticket type
      </button>
    </div>
  );
}
