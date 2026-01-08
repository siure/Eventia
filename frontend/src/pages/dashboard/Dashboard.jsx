import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyRegistrations } from "../../services/registrations";
import { getMyEvents, deleteEvent } from "../../services/events";
import { getProfile, updateProfile } from "../../services/auth";
import "../../styles/pages/Dashboard.css";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("participant"); // 'organizer' or 'participant' or 'account'
  const navigate = useNavigate();
  
  // Participant dashboard state
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Organizer dashboard state
  const [events, setEvents] = useState([]);
  const [organizerLoading, setOrganizerLoading] = useState(false);
  const [organizerError, setOrganizerError] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);

  // Account settings state
  const [userProfile, setUserProfile] = useState({ name: "", email: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Fetch data when view changes
  useEffect(() => {
    if (activeView === "participant") {
      fetchRegistrations();
    } else if (activeView === "organizer") {
      fetchMyEvents();
    } else if (activeView === "account") {
      fetchUserProfile();
    }
  }, [activeView]);

  const fetchRegistrations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyRegistrations();
      const backendRegistrations = response.data.registrations || [];
      
      // Transform backend data to frontend format
      const transformedRegistrations = backendRegistrations
        .filter((reg) => reg.event_id) // Filter out registrations with deleted events
        .map((reg) => {
          const event = reg.event_id;
          const eventDate = event?.date ? new Date(event.date) : null;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          return {
            id: reg.id,
            eventId: event?.id || event?._id?.toString() || "",
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
            eventDateObj: eventDate, // Keep for filtering
          };
        });
      
      setRegistrations(transformedRegistrations);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setError(
        err.response?.data?.message || "Failed to load registrations"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    setOrganizerLoading(true);
    setOrganizerError(null);
    try {
      const response = await getMyEvents();
      const backendEvents = response.data.events || [];
      
      // Transform backend data to frontend format
      const transformedEvents = backendEvents.map((event) => {
        const eventDate = new Date(event.date);
        
        return {
          id: event.id,
          title: event.title,
          date: eventDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          status: event.status,
          registrations: event.registrationCount || 0,
        };
      });
      
      setEvents(transformedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setOrganizerError(
        err.response?.data?.message || "Failed to load events"
      );
    } finally {
      setOrganizerLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setDeletingEventId(eventId);
    try {
      await deleteEvent(eventId);
      // Refresh the events list
      await fetchMyEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(
        err.response?.data?.message || 
        "Failed to delete event. Please try again."
      );
    } finally {
      setDeletingEventId(null);
    }
  };

  const fetchUserProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const response = await getProfile();
      const user = response.user;
      setUserProfile(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfileError(
        err.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);

    // Validate password fields if changing password
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        setProfileError("Current password is required");
        return;
      }
      if (!formData.newPassword) {
        setProfileError("New password is required");
        return;
      }
      if (formData.newPassword.length < 6) {
        setProfileError("New password must be at least 6 characters");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setProfileError("New passwords do not match");
        return;
      }
    }

    setProfileLoading(true);
    try {
      const updates = {
        name: formData.name,
        email: formData.email,
      };

      if (showPasswordFields && formData.newPassword) {
        updates.currentPassword = formData.currentPassword;
        updates.newPassword = formData.newPassword;
      }

      const response = await updateProfile(updates);
      
      // Update localStorage with new user data
      const updatedUser = response.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("auth-change"));

      setUserProfile(updatedUser);
      setProfileSuccess("Profile updated successfully!");
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordFields(false);

      // Clear success message after 3 seconds
      setTimeout(() => setProfileSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileError(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Filter upcoming events (events in the future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingRegistrations = registrations
    .filter((reg) => reg.eventDateObj >= today)
    .filter((reg) => reg.status !== "cancelled")
    .sort((a, b) => a.eventDateObj - b.eventDateObj)
    .slice(0, 5);

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

  const totalRegistrations = registrations.length;
  const totalTickets = registrations
  .filter((reg) => reg.status !== "cancelled")
  .reduce(
    (sum, reg) => sum + reg.quantity,
    0
  );

  return (
    <div>
      {/* Toggle Buttons */}
      <div className="dashboard-toggle-buttons">
        <button
          className={`btn dashboard-toggle-btn ${activeView === "organizer" ? "btn-primary dashboard-toggle-btn-active" : "dashboard-toggle-btn-inactive"}`}
          onClick={() => setActiveView("organizer")}
        >
          Organizer Dashboard
        </button>
        <button
          className={`btn dashboard-toggle-btn ${activeView === "participant" ? "btn-primary dashboard-toggle-btn-active" : "dashboard-toggle-btn-inactive"}`}
          onClick={() => setActiveView("participant")}
        >
          Participant Dashboard
        </button>

        <button
          className={`btn dashboard-toggle-btn ${activeView === "account" ? "btn-primary dashboard-toggle-btn-active" : "dashboard-toggle-btn-inactive"}`}
          onClick={() => setActiveView("account")}
        >
          Account Settings
        </button>
      </div>

      {/* Organizer View */}
      {activeView === "organizer" && (
        <>
          <h2 className="page-title">Organizer Dashboard</h2>

          <div className="dashboard-create-btn-container">
            <Link to="/events/create" className="btn btn-primary">
              + Create New Event
            </Link>
          </div>

          {organizerLoading && (
            <div className="card">
              <p>Loading events...</p>
            </div>
          )}

          {organizerError && (
            <div className="card">
              <p className="error">{organizerError}</p>
            </div>
          )}

          {!organizerLoading && !organizerError && (
            <>
              {events.length === 0 ? (
                <div className="card">
                  <p className="dashboard-empty-message">
                    You haven't created any events yet.
                  </p>
                  <Link
                    to="/events/create"
                    className="btn btn-primary dashboard-empty-link"
                  >
                    Create your first event
                  </Link>
                </div>
              ) : (
                events.map((event) => (
                  <div className="card" key={event.id}>
                    <h3>{event.title}</h3>
                    <p>
                      <span className="card-label">Date:</span> {event.date}
                    </p>
                    <p>
                      <span className="card-label-status">Status:</span>{" "}
                      <span
                        className={
                          event.status === "published"
                            ? "status-published"
                            : event.status === "cancelled"
                            ? "status-draft"
                            : "status-draft"
                        }
                      >
                        {event.status}
                      </span>
                    </p>
                    <p>
                      <span className="card-label-location">Registrations:</span>{" "}
                      {event.registrations}
                    </p>

                    <div className="dashboard-event-actions">
                      <Link
                        to={`/events/${event.id}`}
                        className="btn btn-primary"
                      >
                        View
                      </Link>

                      <Link
                        to={`/events/${event.id}/edit`}
                        className="btn btn-primary"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingEventId === event.id}
                      >
                        {deletingEventId === event.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </>
      )}

      {/* Participant View */}
      {activeView === "participant" && (
        <>
          <h2 className="page-title">Participant Dashboard</h2>

          {loading && (
            <div className="card">
              <p>Loading registrations...</p>
            </div>
          )}

          {error && (
            <div className="card">
              <p className="error">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* --- STAT CARDS --- */}
              <div className="dashboard-stats-container">
                <div className="card dashboard-stats-card">
                  <p className="card-label">Total registrations</p>
                  <p className="dashboard-stats-title">
                    {totalRegistrations}
                  </p>
                </div>

                <div className="card dashboard-stats-card">
                  <p className="card-label-location">Total tickets</p>
                  <p className="dashboard-stats-title">
                    {totalTickets}
                  </p>
                </div>
              </div>

              {/* --- UPCOMING EVENTS HEADER --- */}
              <div className="dashboard-upcoming-header">
                <h3 className="dashboard-section-title">Upcoming events</h3>

                <Link to="/my-registrations" className="btn btn-primary">
                  View all registrations
                </Link>
              </div>

              {/* --- UPCOMING EVENTS LIST --- */}
              {upcomingRegistrations.length === 0 ? (
                <div className="card">
                  <p className="dashboard-empty-message">
                    {totalRegistrations === 0
                      ? "You have no registrations yet."
                      : "No upcoming events."}
                  </p>
                  {totalRegistrations === 0 && (
                    <Link to="/events" className="btn btn-primary dashboard-upcoming-link">
                      Browse events
                    </Link>
                  )}
                </div>
              ) : (
                upcomingRegistrations.map((reg) => (
                  <div key={reg.id} className="card registration-card dashboard-registration-card">
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
                        <span className="btn btn-primary dashboard-disabled-link">
                          View Event (ID missing)
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </>
      )}

      {/* Account Settings View */}
      {activeView === "account" && (
        <>
          <h2 className="page-title">Account Settings</h2>

          {profileLoading && (
            <div className="card">
              <p>Loading profile...</p>
            </div>
          )}

          {profileError && (
            <div className="card">
              <p className="error">{profileError}</p>
            </div>
          )}

            {profileSuccess && (
            <div className="card dashboard-profile-success-card">
              <p className="dashboard-profile-success-message">{profileSuccess}</p>
            </div>
          )}

          {!profileLoading && (
            <div className="card">
              <form onSubmit={handleProfileUpdate}>
                <div className="field">
                  <label className="field-label">Name</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="field">
                  <label className="field-label">Email</label>
                  <input
                    type="email"
                    className="input"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                {!showPasswordFields && (
                  <button
                    type="button"
                    className="btn dashboard-password-btn"
                    onClick={() => setShowPasswordFields(true)}
                  >
                    Change Password
                  </button>
                )}

                {showPasswordFields && (
                  <>
                    <div className="field">
                      <label className="field-label">Current Password</label>
                      <input
                        type="password"
                        className="input"
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentPassword: e.target.value,
                          })
                        }
                        required={showPasswordFields}
                      />
                    </div>

                    <div className="field">
                      <label className="field-label">New Password</label>
                      <input
                        type="password"
                        className="input"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          })
                        }
                        required={showPasswordFields}
                        minLength={6}
                      />
                    </div>

                    <div className="field">
                      <label className="field-label">Confirm New Password</label>
                      <input
                        type="password"
                        className="input"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required={showPasswordFields}
                        minLength={6}
                      />
                    </div>

                    <button
                      type="button"
                      className="btn dashboard-password-btn"
                      onClick={() => {
                        setShowPasswordFields(false);
                        setFormData({
                          ...formData,
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                    >
                      Cancel Password Change
                    </button>
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-primary dashboard-profile-submit-btn"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

