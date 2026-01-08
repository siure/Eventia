import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

// Auth pages (Person 1 later)
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// Events pages ME
import EventList from "../pages/events/EventList.jsx";
import EventDetails from "../pages/events/EventDetails.jsx";
import CreateEvent from "../pages/events/CreateEvent.jsx";
import EditEvent from "../pages/events/EditEvent.jsx";

// Dashboard pages ME
import Dashboard from "../pages/dashboard/Dashboard.jsx";

// Registrations pages ME
import MyRegistrations from "../pages/registrations/MyRegistrations.jsx";
import RegistrationConfirmation from "../pages/registrations/RegistrationConfirmation.jsx";

// 404 page
import NotFound from "../pages/NotFound.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Routes avec layout commun */}
      <Route path="/" element={<MainLayout />}>
        {/* Home = EventList */}
        <Route index element={<EventList />} />

        {/* Events */}
        <Route path="events" element={<EventList />} />

        {/* Specific routes BEFORE dynamic routes */}
        <Route path="events/create" element={<CreateEvent />} />
        
        {/* Version normale -> formulaire visible */}
        <Route 
          path="events/:eventId" 
          element={<EventDetails hideRegistrationForm={false} />} 
        />

        <Route path="events/:eventId/edit" element={<EditEvent />} />

        {/* Dashboard */}
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Registrations */}
        <Route path="my-registrations" element={<ProtectedRoute><MyRegistrations /></ProtectedRoute>} />
        <Route
          path="registrations/confirmation"
          element={<RegistrationConfirmation />}
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRoutes;
