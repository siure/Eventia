import { useState } from "react";
import OrganizerDashboard from "./OrganizerDashboard.jsx";
import ParticipantDashboard from "./ParticipantDashboard.jsx";

export default function DashboardSwitch() {
  const [active, setActive] = useState("organizer"); // "organizer" ou "participant"

  return (
    <div style={{ textAlign: "center" }}>
      <h2 className="page-title">Choose your view</h2>

      {/* Bouton coupé en deux */}
      <div className="role-switch">
        <button
          className={`role-btn ${active === "organizer" ? "active" : ""}`}
          onClick={() => setActive("organizer")}
        >
          Organizer
        </button>

        <button
          className={`role-btn ${active === "participant" ? "active" : ""}`}
          onClick={() => setActive("participant")}
        >
          Participant
        </button>
      </div>

      {/* Zone de contenu : on affiche un des deux dashboards */}
      <div style={{ marginTop: "2rem" }}>
        {active === "organizer" ? (
          <OrganizerDashboard />
        ) : (
          <ParticipantDashboard />
        )}
      </div>
    </div>
  );
}
