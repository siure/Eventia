import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

// Auth pages (Person 1 later)
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// Events pages ME
import EventList from "../pages/events/EventList.jsx";
import EventDetails from "../pages/events/EventDetails.jsx";
import CreateEvent from "../pages/events/CreateEvent.jsx";
import EditEvent from "../pages/events/EditEvent.jsx";

// Dashboard pages ME
import OrganizerDashboard from "../pages/dashboard/OrganizerDashboard.jsx";
import ParticipantDashboard from "../pages/dashboard/ParticipantDashboard.jsx";
import DashboardSwitch from "../pages/dashboard/DashboardSwitch.jsx";

// Registrations pages ME
import MyRegistrations from "../pages/registrations/MyRegistrations.jsx";
import RegistrationConfirmation from "../pages/registrations/RegistrationConfirmation.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Routes avec layout commun */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard-switch" element={<DashboardSwitch />} />

        {/* Home = EventList */}
        <Route index element={<EventList />} />

        {/* Events */}
        <Route path="events" element={<EventList />} />

        {/* Version normale -> formulaire visible */}
        <Route 
          path="events/:eventId" 
          element={<EventDetails hideRegistrationForm={false} />} 
        />

        {/* Version dashboard participant -> formulaire caché */}
        <Route 
          path="dashboard/participant/event/:eventId" 
          element={<EventDetails hideRegistrationForm={true} />} 
        />

        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/:eventId/edit" element={<EditEvent />} />

        {/* Dashboards */}
        <Route path="dashboard/organizer" element={<OrganizerDashboard />} />
        <Route path="dashboard/participant" element={<ParticipantDashboard />} />

        {/* Registrations */}
        <Route path="my-registrations" element={<MyRegistrations />} />
        <Route
          path="registrations/confirmation/:registrationId"
          element={<RegistrationConfirmation />}
        />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
