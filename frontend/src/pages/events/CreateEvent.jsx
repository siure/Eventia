import EventForm from "../../components/events/EventForm.jsx";

export default function CreateEvent() {
  const handleCreateEvent = (eventData) => {
    console.log("Creating event (fake for now):", eventData);
    alert("Event created (fake for now)!");
  };

  return (
    <div>
      <EventForm mode="create" onSubmit={handleCreateEvent} />
    </div>
  );
}
