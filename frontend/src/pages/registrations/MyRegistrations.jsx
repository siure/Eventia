import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyRegistrations, cancelRegistration } from "../../services/registrations";
import "../../styles/pages/MyRegistrations.css";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyRegistrations();
      const backendRegistrations = response.data.registrations || [];
      
      // Transform backend data to frontend format
      const transformedRegistrations = backendRegistrations
        .filter((reg) => reg.event_id) 
        .map((reg) => {
          const event = reg.event_id;
          const eventDate = event?.date ? new Date(event.date) : null;
          
          return {
            id: reg.id,
            eventId: event?.id || event?._id?.toString() || null,
            eventTitle: reg.eventTitle || event?.title || "Unknown Event",
            eventDate: eventDate 
              ? eventDate.toISOString().split("T")[0] 
              : "TBD",
            eventLocation: reg.eventLocation || event?.location || "Location TBD",
            ticketTypeName: reg.ticketTypeName || "Unknown",
            quantity: reg.quantity || 1,
            registrationDate: reg.createdAt 
              ? new Date(reg.createdAt).toISOString().split("T")[0]
              : "N/A",
            status: reg.status || "pending",
            organizerName: reg.organizerName || event?.organizer || "Unknown",
          };
        })
        .sort((a, b) => {
          // Sort by event date (upcoming first), then by registration date (newest first)
          if (a.eventDate !== "TBD" && b.eventDate !== "TBD") {
            return new Date(a.eventDate) - new Date(b.eventDate);
          }
          return new Date(b.registrationDate) - new Date(a.registrationDate);
        });
      
      setRegistrations(transformedRegistrations);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError(
        err.response?.data?.message || 
        "Failed to load registrations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId) => {
    if (!window.confirm("Are you sure you want to cancel this registration? This action cannot be undone.")) {
      return;
    }

    setCancellingId(registrationId);
    try {
      await cancelRegistration(registrationId);
      // Refresh the registrations list
      await fetchRegistrations();
    } catch (err) {
      console.error("Error cancelling registration:", err);
      alert(
        err.response?.data?.message || 
        "Failed to cancel registration. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === "TBD" || dateString === "N/A") {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="page-section">
        <h2 className="page-title">My Registrations</h2>
        <div className="card">
          <p>Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-section">
        <h2 className="page-title">My Registrations</h2>
        <div className="card">
          <p className="error">{error}</p>
          <button 
            className="btn btn-primary my-registrations-retry-btn" 
            onClick={fetchRegistrations}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="page-section">
        <h2 className="page-title">My Registrations</h2>
        <div className="card">
          <p className="my-registrations-empty">
            You have no registrations yet.
          </p>
          <Link to="/events" className="btn btn-primary">
            Browse events
          </Link>
        </div>
      </div>
    );
  }

  // Separate upcoming and past registrations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingRegistrations = registrations.filter((reg) => {
    if (reg.eventDate === "TBD") return true;
    try {
      return new Date(reg.eventDate) >= today;
    } catch {
      return true;
    }
  });

  const pastRegistrations = registrations.filter((reg) => {
    if (reg.eventDate === "TBD") return false;
    try {
      return new Date(reg.eventDate) < today;
    } catch {
      return false;
    }
  });

  return (
    <div className="page-section">
      <h2 className="page-title">My Registrations</h2>

      {/* Upcoming Registrations */}
      {upcomingRegistrations.length > 0 && (
        <>
          <h3 className="my-registrations-section-title">
            Upcoming Events ({upcomingRegistrations.length})
          </h3>
          {upcomingRegistrations.map((reg) => (
            <div key={reg.id} className="card registration-card my-registrations-card">
              <h3 className="registration-title">{reg.eventTitle}</h3>

              <div className="registration-grid">
                <p>
                  <span className="card-label">Event date:</span> {formatDate(reg.eventDate)}
                </p>

                <p>
                  <span className="card-label-location">Location:</span>{" "}
                  {reg.eventLocation}
                </p>

                <p>
                  <span className="card-label">Organizer:</span>{" "}
                  {reg.organizerName}
                </p>

                <p>
                  <span className="card-label">Ticket type:</span>{" "}
                  {reg.ticketTypeName}
                </p>

                <p>
                  <span className="card-label-location">Quantity:</span>{" "}
                  {reg.quantity}
                </p>

                <p>
                  <span className="card-label-status">Registration date:</span>{" "}
                  {formatDate(reg.registrationDate)}
                </p>

                <p>
                  <span className="card-label-status">Status:</span>{" "}
                  <span
                    className={
                      reg.status === "approved"
                        ? "status-published"
                        : reg.status === "cancelled"
                        ? "status-draft"
                        : "status-draft"
                    }
                  >
                    {reg.status}
                  </span>
                </p>
              </div>

              <div className="registration-actions">
                <Link to={`/events/${reg.eventId}`} className="btn btn-primary">
                  View Event
                </Link>

                {reg.status !== "cancelled" && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancel(reg.id)}
                    disabled={cancellingId === reg.id}
                  >
                    {cancellingId === reg.id ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Past Registrations */}
      {pastRegistrations.length > 0 && (
        <>
          <h3 className="my-registrations-past-section-title">
            Past Events ({pastRegistrations.length})
          </h3>
          {pastRegistrations.map((reg) => (
            <div key={reg.id} className="card registration-card my-registrations-past-card">
              <h3 className="registration-title">{reg.eventTitle}</h3>

              <div className="registration-grid">
                <p>
                  <span className="card-label">Event date:</span> {formatDate(reg.eventDate)}
                </p>

                <p>
                  <span className="card-label-location">Location:</span>{" "}
                  {reg.eventLocation}
                </p>

                <p>
                  <span className="card-label">Organizer:</span>{" "}
                  {reg.organizerName}
                </p>

                <p>
                  <span className="card-label">Ticket type:</span>{" "}
                  {reg.ticketTypeName}
                </p>

                <p>
                  <span className="card-label-location">Quantity:</span>{" "}
                  {reg.quantity}
                </p>

                <p>
                  <span className="card-label-status">Registration date:</span>{" "}
                  {formatDate(reg.registrationDate)}
                </p>

                <p>
                  <span className="card-label-status">Status:</span>{" "}
                  <span
                    className={
                      reg.status === "approved"
                        ? "status-published"
                        : reg.status === "cancelled"
                        ? "status-draft"
                        : "status-draft"
                    }
                  >
                    {reg.status}
                  </span>
                </p>
              </div>

              <div className="registration-actions">
                {reg.eventId ? (
                  <Link to={`/events/${reg.eventId}`} className="btn btn-primary">
                    View Event
                  </Link>
                ) : (
                  <span className="btn btn-primary" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                    View Event (ID missing)
                  </span>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
