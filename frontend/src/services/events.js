import api from "./api";

export const getEvents = () => api.get("/events");
export const getEventById = (id) => api.get(`/events/${id}`);
export const getMyEvents = () => api.get("/events/my-events");
export const createEvent = (event) => api.post("/events", event);
export const updateEvent = (id, event) => api.put(`/events/${id}`, event);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

