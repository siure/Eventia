import Registration from "../model/Registration.js";
import Event from "../model/Event.js";
import mongoose from "mongoose";

// Part 1: POST /api/events/:eventId/register
const registerForEvent = async (req, res) => {
  const user_id = req.userId; // ID de l'utilisateur provenant du middleware d'auth
  const event_id = req.params.eventId;
  const { ticketType_id, quantity = 1 } = req.body;

  if (!ticketType_id || quantity < 1) {
    return res
      .status(400)
      .json({ message: "Invalid ticket type or quantity." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Check if user is already registered for this event with this ticket type (non-cancelled)
    const existingRegistration = await Registration.findOne({
      user_id,
      event_id,
      ticketType_id,
      status: { $ne: "cancelled" }
    }).session(session);

    if (existingRegistration) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: "You are already registered for this event with this ticket type." 
      });
    }

    // 2. Delete any existing cancelled registrations for the same user/event/ticketType
    // This ensures the unique index doesn't cause issues and allows clean re-registration
    await Registration.deleteMany({
      user_id,
      event_id,
      ticketType_id,
      status: "cancelled"
    }).session(session);

    // 3. Verify event exists and get ticket type
    const event = await Event.findById(event_id).session(session);

    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event is in the past
    const now = new Date();
    if (event.date < now) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: "Cannot register for past events." 
      });
    }

    // Find ticket type by _id (embedded documents have _id by default)
    const ticketType = event.ticketTypes.find(
      (tt) => tt._id && tt._id.toString() === ticketType_id.toString()
    );

    if (!ticketType) {
      await session.abortTransaction();
      return res.status(404).json({ 
        message: "Ticket type not found for this event." 
      });
    }

    if (ticketType.availableTickets < quantity) {
      await session.abortTransaction();
      return res.status(400).json({ 
        message: `Not enough tickets available. Only ${ticketType.availableTickets} tickets remaining.` 
      });
    }

    // 3. Find the index of the ticket type for updating
    const ticketTypeIndex = event.ticketTypes.findIndex(
      (tt) => tt._id && tt._id.toString() === ticketType_id.toString()
    );

    if (ticketTypeIndex === -1) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Could not find ticket type index." });
    }

    // 4. Create new registration
    const registration = await Registration.create(
      [
        {
          user_id,
          event_id,
          ticketType_id: new mongoose.Types.ObjectId(ticketType_id),
          quantity,
          status: "approved",
        },
      ],
      { session },
    );

    // 5. Update ticket availability (Atomic)
    await Event.findByIdAndUpdate(
      event_id,
      {
        $inc: {
          [`ticketTypes.${ticketTypeIndex}.availableTickets`]: -quantity,
        },
      },
      { session, new: true },
    );

    await session.commitTransaction();
    
    // Populate event details for response
    const populatedRegistration = await Registration.findById(registration[0]._id)
      .populate("event_id", "title date location organizer")
      .populate("user_id", "name email");

    // Ensure populated documents have id field
    const registrationJSON = populatedRegistration.toJSON();
    if (registrationJSON.event_id && registrationJSON.event_id._id && !registrationJSON.event_id.id) {
      registrationJSON.event_id.id = registrationJSON.event_id._id.toString();
      delete registrationJSON.event_id._id;
    }
    if (registrationJSON.user_id && registrationJSON.user_id._id && !registrationJSON.user_id.id) {
      registrationJSON.user_id.id = registrationJSON.user_id._id.toString();
      delete registrationJSON.user_id._id;
    }

    res.status(201).json({ 
      message: "Registration successful", 
      registration: registrationJSON 
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// Part 2: GET /api/my-registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user_id: req.userId })
      // Peupler pour afficher les détails des références
      .populate("event_id", "title date location ticketTypes")
      .sort({ createdAt: -1 });

    const registrationsWithTicketTypes = registrations.map((registration) => {
      const event = registration.event_id;
      // Find ticket type by id (after toJSON transform) or _id (if transform not applied yet)
      const ticketType = event?.ticketTypes?.find( 
        tt => {
          const ttId = tt.id || tt._id;
          return ttId && ttId.toString() === registration.ticketType_id.toString();
        }
      );
      // Use toJSON() to apply schema transform (converts _id to id)
      const registrationJSON = registration.toJSON();
      // Also transform populated event if it exists
      let eventJSON = null;
      if (event) {
        if (typeof event.toJSON === 'function') {
          eventJSON = event.toJSON();
        } else if (event._id) {
          // If it's already a plain object, ensure it has id
          eventJSON = { ...event };
          if (!eventJSON.id && eventJSON._id) {
            eventJSON.id = eventJSON._id.toString();
            delete eventJSON._id;
          }
        } else {
          eventJSON = event;
        }
      }
      
      return {
        ...registrationJSON,
        ticketTypeName: ticketType?.type || "Unknown",
        eventTitle: eventJSON?.title || "Unknown Event",
        eventDate: eventJSON?.date || null,
        eventLocation: eventJSON?.location || "Unknown",
        organizerName: eventJSON?.organizer || "Unknown Organizer",
        // Ensure event_id has id field for frontend
        event_id: eventJSON || registrationJSON.event_id,
      };
    });

    res.status(200).json({ registrations: registrationsWithTicketTypes });
  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de vos inscriptions.",
    });
  }
};

// Part 2: GET /api/events/:eventId/registrations
const getEventRegistrations = async (req, res) => {
  try {
    const event_id = req.params.eventId;

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: "Événement non trouvé." });
    }

    // Vérification d'organisateur (Organize)
    if (event.organizer_id.toString() !== req.userId.toString()) {
      return res.status(403).json({
        message:
          "Accès refusé. Seul l'organisateur peut voir ces inscriptions.",
      });
    }

    const registrations = await Registration.find({ event_id })
      .populate("user_id", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ registrations });
  } catch (error) {
    res.status(500).json({
      message:
        "Erreur serveur lors de la récupération des inscriptions de l'événement.",
    });
  }
};

// Part 2: DELETE /api/registrations/:id
const cancelRegistration = async (req, res) => {
  const registrationId = req.params.id;
  const user_id = req.userId;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const registration =
      await Registration.findById(registrationId).session(session);

    if (!registration) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Inscription non trouvée." });
    }

    // L'utilisateur doit être l'inscrit pour annuler
    if (registration.user_id.toString() !== user_id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        message:
          "Accès refusé. Vous ne pouvez annuler que vos propres inscriptions.",
      });
    }

    if (registration.status === "cancelled") {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "This registration is already cancelled." });
    }

    const quantityToRestore = registration.quantity;
    const ticketType_id = registration.ticketType_id;
    const event_id = registration.event_id;

    // Get event to find ticket type index
    const event = await Event.findById(event_id).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Event not found." });
    }

    // Find the index of the ticket type
    const ticketTypeIndex = event.ticketTypes.findIndex(
      (tt) => tt._id && tt._id.toString() === ticketType_id.toString()
    );

    if (ticketTypeIndex === -1) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Ticket type not found in event." });
    }

    // 1. Update status
    registration.status = "cancelled";
    await registration.save({ session });

    // 2. Restore ticket availability (Atomic)
    await Event.findByIdAndUpdate(
      event_id,
      {
        $inc: {
          [`ticketTypes.${ticketTypeIndex}.availableTickets`]: quantityToRestore,
        },
      },
      { session, new: true },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Inscription annulée avec succès." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Erreur transactionnelle lors de l'annulation:", error);
    res.status(500).json({
      message: "Erreur serveur lors de l'annulation de l'inscription.",
    });
  }
};

export {
  registerForEvent,
  getMyRegistrations,
  getEventRegistrations,
  cancelRegistration,
};
