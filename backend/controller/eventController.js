import Event from "../model/Event.js";
import Registration from "../model/Registration.js";
import User from "../model/User.js";
import mongoose from "mongoose";

export const createEvent = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description, date, location, status, ticketTypes, organizer } =
      req.body;

    if (!title || !date || !location || !status || !ticketTypes) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (new Date(date) < new Date()) {
      return res
        .status(400)
        .json({ error: "Event date must be in the future" });
    }

    // Get user's name to auto-populate organizer field
    const user = await User.findById(userId);
    const organizerName = organizer || user?.name || "Unknown Organizer";

    const event = await Event.create({
      title,
      description,
      date,
      location,
      organizer_id: userId,
      organizer: organizerName,
      status,
      ticketTypes,
    });
    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEvents = async (req, res) => {
  try {
    const now = new Date();
    // Only get published events that are in the future
    const events = await Event.find({ 
      status: "published",
      date: { $gte: now } 
    }).sort({ date: 1 }); 
    
    
    
    const eventsWithOrganizerName = events.map(event => {
      const eventJSON = event.toJSON();
      // Ensure id is present 
      if (!eventJSON.id && eventJSON._id) {
        eventJSON.id = eventJSON._id.toString();
        delete eventJSON._id;
      }
      return {
        ...eventJSON,
        organizerName: event.organizer || "Unknown Organizer"
      };
    });
    res.status(200).json({ events: eventsWithOrganizerName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate that id is provided and not undefined
    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Event ID is required" });
    }
    
    const userId = req.userId; 
    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If event is not published, only the organizer can view it
    if (event.status !== "published") {
      if (!userId || event.organizer_id.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Event not found" });
      }
    }

    // Use toJSON() to apply the schema transform (converts _id to id)
    const eventJSON = event.toJSON();
    
    // Ensure id is present (should be from transform, but add fallback)
    if (!eventJSON.id && eventJSON._id) {
      eventJSON.id = eventJSON._id.toString();
      delete eventJSON._id;
    }
    
    // Add organizerName field for frontend compatibility
    const eventWithOrganizerName = {
      ...eventJSON,
      organizerName: event.organizer || "Unknown Organizer"
    };

    res.status(200).json({ event: eventWithOrganizerName });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const events = await Event.find({ organizer_id: userId })
      .sort({ createdAt: -1 });

    // Get registration counts for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({
          event_id: event._id,
          status: { $ne: "cancelled" },
        });
        
        const eventJSON = event.toJSON();
        // Ensure id is present (should be from transform, but add fallback)
        if (!eventJSON.id && eventJSON._id) {
          eventJSON.id = eventJSON._id.toString();
          delete eventJSON._id;
        }
        
        return {
          ...eventJSON,
          registrationCount,
          organizerName: event.organizer || "Unknown Organizer"
        };
      })
    );

    res.status(200).json({ events: eventsWithCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, status, ticketTypes, organizer } =
      req.body;

    if (date && new Date(date) < new Date()) {
      return res.status(400).json({ error: "Event date must be in future" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer_id.toString() !== req.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    const updateData = { title, description, date, location, status, ticketTypes };
    if (organizer) {
      updateData.organizer = organizer;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    // Use toJSON() to apply the schema transform (converts _id to id)
    const eventJSON = updatedEvent.toJSON();
    
    // Ensure id is present (should be from transform, but add fallback)
    if (!eventJSON.id && eventJSON._id) {
      eventJSON.id = eventJSON._id.toString();
      delete eventJSON._id;
    }
    
    // Add organizerName for frontend compatibility
    const eventWithOrganizerName = {
      ...eventJSON,
      organizerName: updatedEvent.organizer || "Unknown Organizer"
    };

    res.json({ message: "Event updated successfully", event: eventWithOrganizerName });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer_id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    // Check if there are any registrations
    const registrationCount = await Registration.countDocuments({
      event_id: id,
      status: { $ne: "cancelled" },
    });

    if (registrationCount > 0) {
      // Instead of deleting, mark as cancelled
      await Event.findByIdAndUpdate(id, { status: "cancelled" });
      return res.status(200).json({
        message: "Event cancelled (has registrations)",
        event: await Event.findById(id),
      });
    }

    // If no registrations, delete the event
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
