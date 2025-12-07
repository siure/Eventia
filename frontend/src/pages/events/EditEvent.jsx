import { useParams } from "react-router-dom";
import EventForm from "../../components/events/EventForm.jsx";

export default function EditEvent() {
  const { eventId } = useParams();

  // Fake data temporaire
  const events = [
    {
      id: 1,
      title: "Tech Meetup Paris",
      description: "A meetup for developers in Paris.",
      date: "2025-02-10",
      location: "Paris, France",
      status: "published",
    },
    {
      id: 2,
      title: "Online React Workshop",
      description: "Learn the basics of React.",
      date: "2025-03-01",
      location: "Online",
      status: "published",
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      description: "Pitch your ideas.",
      date: "2025-04-15",
      location: "Lyon, France",
      status: "draft",
    },
  ];

  const event = events.find((e) => e.id === Number(eventId));

  if (!event) {
    return <p>Event not found.</p>;
  }

  const handleEditEvent = (updatedEvent) => {
    console.log("UPDATED EVENT (fake for now):", updatedEvent);
    alert("Event updated! (fake)");
  };

  return (
    <div className="page-section">

      <h2 className="page-title">Edit event: {event.title}</h2>

      <EventForm
        mode="edit"
        initialEvent={event}
        onSubmit={handleEditEvent}
      />
    </div>
  );
}
