import EventCard from "../../components/events/EventCard.jsx";

export default function EventList() {
  // Pour l'instant on a des fausses données 
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
      description: "Learn the basics of React in one day.",
      date: "2025-03-01",
      location: "Online",
      status: "published",
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      description: "Pitch your startup idea to investors.",
      date: "2025-04-15",
      location: "Lyon, France",
      status: "draft",
    },
  ];

  return (
    <div className="page-section">

      <h2 className="page-title">Events</h2>

      {/* plus tard : search bar + filtres ici */}

      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
