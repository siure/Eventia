import Event from "../model/Event";
import mongoose from "mongoose";

export const createEvent = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, description, date, location, status, ticketTypes } =
      req.body;

    if (!title || !date || !location || !status || !ticketTypes) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (new Date(date) < new Date()) {
      return res
        .status(400)
        .json({ error: "Event date must be in the future" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      userId,
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
    const events = await Event.find({ status: "published" });
    res.status(200).json({ events });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      event.status !== "published" &&
      event.organizer_id.toString() !== req.userId
    ) {
      return res.status(403).json({ message: "Event not found" });
    }

    res.status(200).json({ event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, location, status, ticketTypes } =
      req.body;

    if (date && new Date(date) < new Date()) {
      return res.status(400).json({ error: "Event date must be in future" });
    }

    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer_id.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: { title, description, date, location, status, ticketTypes } },
      { new: true, runValidators: true },
    );

    res.json({ message: "Event updated successfully", event: updateEvent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
