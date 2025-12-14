import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";

// Auth pages
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// Events pages
import EventList from "../pages/events/EventList.jsx";
import EventDetails from "../pages/events/EventDetails.jsx";
import CreateEvent from "../pages/events/CreateEvent.jsx";
import EditEvent from "../pages/events/EditEvent.jsx";

// Dashboard pages
import OrganizerDashboard from "../pages/dashboard/OrganizerDashboard.jsx";
import ParticipantDashboard from "../pages/dashboard/ParticipantDashboard.jsx";

// Registrations pages
import MyRegistrations from "../pages/registrations/MyRegistrations.jsx";
import RegistrationConfirmation from "../pages/registrations/RegistrationConfirmation.jsx";

// User Profile
import UserProfile from "../pages/auth/UserProfile.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<EventList />} />
        <Route path="events" element={<EventList />} />
        <Route path="events/:eventId" element={<EventDetails hideRegistrationForm={false} />} />
        <Route path="dashboard/participant/event/:eventId" element={<EventDetails hideRegistrationForm={true} />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/:eventId/edit" element={<EditEvent />} />

        {/* User Profile */}
        <Route path="user-profile" element={<UserProfile />} />

        {/* Optional: keep dashboard direct links if needed */}
        <Route path="dashboard/organizer" element={<OrganizerDashboard />} />
        <Route path="dashboard/participant" element={<ParticipantDashboard />} />

        {/* Registrations */}
        <Route path="my-registrations" element={<MyRegistrations />} />
        <Route path="registrations/confirmation/:registrationId" element={<RegistrationConfirmation />} />
      </Route>

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
