import api from "./api";

export const registerForEvent = (eventId, ticketType_id, quantity) =>
    api.post(`/events/${eventId}/register`, { ticketType_id, quantity });

export const getMyRegistrations = () =>
    api.get("/my-registrations");

export const getEventRegistrations = (eventId) =>
    api.get(`/events/${eventId}/registrations`);

export const cancelRegistration = (registrationId) =>
    api.delete(`/registrations/${registrationId}`);

