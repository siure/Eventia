import Registration from "../model/Registration.js";
import Event from "../model/Event.js";
import mongoose from "mongoose";

// Part 1: POST /api/events/:eventId/register
const registerForEvent = async (req, res) => {
  const user_id = req.user.id; // ID de l'utilisateur provenant du middleware d'auth
  const event_id = req.params.eventId;
  const { ticketTypeIndex, quantity = 1 } = req.body;

  if (!ticketTypeIndex || quantity < 1) {
    return res
      .status(400)
      .json({ message: "Type de billet ou quantité invalide." });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Vérification des doublons et de la disponibilité du billet
    const event = await Event.findById(event_id).session(session);

    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Event not found" });
    }

    const ticketType = event.ticketTypes[ticketTypeIndex];

    if (!ticketType || ticketType.availableTickets < quantity) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ message: "Type de billet non trouvé pour cet événement." });
    }

    // La vérification d'index unique est gérée par la base de données lors du save.

    // 2. Création de l'inscription
    const registration = await Registration.create(
      [
        {
          user_id,
          event_id,
          ticketTypeIndex,
          quantity,
        },
      ],
      { session },
    );

    // 3. Mise à jour des comptes (Atomique)

    // Décrémenter le stock de billets
    await Event.findByIdAndUpdate(
      event_id,
      {
        $inc: {
          [`ticketTypes.${ticketTypeIndex}.availableTickets`]: -quantity,
          registrationCount: quantity,
        },
      },
      { session, new: true },
    );

    await session.commitTransaction();
    res
      .status(201)
      .json({ message: "Registered well", registration: registration[0] });
  } catch (error) {
    await session.abortTransaction();
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already registered" });
    }
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

// Part 2: GET /api/my-registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user_id: req.user.id })
      // Peupler pour afficher les détails des références
      .populate("event_id", "title date location")
      .sort({ registeredAt: -1 });

    res.status(200).json({ registrations });
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
    if (event.organizer_id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message:
          "Accès refusé. Seul l'organisateur peut voir ces inscriptions.",
      });
    }

    const registrations = await Registration.find({ event_id })
      .populate("user_id", "firstName lastName email")
      .sort({ registeredAt: 1 });

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
  const user_id = req.user.id;

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

    if (registration.status === "Canceled") {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Cette inscription est déjà annulée." });
    }

    const quantityToRestore = registration.quantity;
    const ticketTypeIndex = registration.ticketTypeIndex;
    const event_id = registration.event_id;

    // 1. Mise à jour du statut
    registration.status = "Canceled";
    await registration.save({ session });

    // 2. Restauration des comptes (Atomique)

    // Restauration du stock de billets et décrémenter le compte d'inscriptions
    await Event.findByIdAndUpdate(
      event_id,
      {
        $inc: {
          [`ticketTypes.${ticketTypeIndex}.availableTickets`]:
            quantityToRestore,
          registrationCount: -quantityToRestore,
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
