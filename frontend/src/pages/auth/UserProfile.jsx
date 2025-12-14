import { useState } from "react";
import OrganizerDashboard from "../dashboard/OrganizerDashboard";
import ParticipantDashboard from "../dashboard/ParticipantDashboard";

export default function UserProfile() {
  // state to toggle dashboard
  const [activeDashboard, setActiveDashboard] = useState("organizer"); // default

  return (
    <div>
      <h2 className="page-title">User Profile</h2>

      {/* --- Dashboard toggle buttons --- */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center" }}>
        <button
          className={`btn ${activeDashboard === "organizer" ? "btn-primary" : ""}`}
          onClick={() => setActiveDashboard("organizer")}
        >
          Organizer Dashboard
        </button>

        <button
          className={`btn ${activeDashboard === "participant" ? "btn-primary" : ""}`}
          onClick={() => setActiveDashboard("participant")}
        >
          Participant Dashboard
        </button>
      </div>

      {/* --- Dashboard content --- */}
      <div>
        {activeDashboard === "organizer" && <OrganizerDashboard />}
        {activeDashboard === "participant" && <ParticipantDashboard />}
      </div>
    </div>
  );
}
