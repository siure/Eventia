import mongoose from "mongoose";
import dotenv from "dotenv";

import Event from "./model/Event.js";
import User from "./model/User.js";
import Registration from "./model/Registration.js";

dotenv.config();

async function populateDatabase() {
  const mongoUri = process.env.ATLAS_URI;

  if (!mongoUri) {
    console.error("ATLAS_URI is not set in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });

    await Promise.all([
      Registration.deleteMany({}),
      Event.deleteMany({}),
      User.deleteMany({}),
    ]);

    const [organizer, participant] = await User.insertMany([
      {
        name: "Organizer One",
        email: "organizer1@example.com",
        password: "password123",
      },
      {
        name: "Participant One",
        email: "participant1@example.com",
        password: "password123",
      },
    ]);

    const now = Date.now();
    const daysFromNow = (days) => new Date(now + days * 24 * 60 * 60 * 1000);

    const sampleEvents = [
      {
        title: "Tech Conference 2025",
        description: "A two-day conference about the latest in web and AI.",
        date: daysFromNow(14),
        location: "Paris, France",
        organizer_id: organizer._id,
        organizer: organizer.name,
        status: "published",
        ticketTypes: [
          { type: "Standard", price: 80, capacity: 150 },
          { type: "VIP", price: 180, capacity: 30 },
        ],
      },
      {
        title: "Startup Pitch Night",
        description: "Local startups present their products to investors.",
        date: daysFromNow(30),
        location: "Lyon, France",
        organizer_id: organizer._id,
        organizer: organizer.name,
        status: "published",
        ticketTypes: [
          { type: "General Admission", price: 25, capacity: 200 },
          { type: "Premium Seating", price: 60, capacity: 50 },
        ],
      },
      {
        title: "Alumni fair",
        description: "Alumni came back just for you",
        date: daysFromNow(50),
        location: "Lyon, France",
        organizer_id: organizer._id,
        organizer: organizer.name,
        status: "published",
        ticketTypes: [
          { type: "General", price: 0, capacity: 200 },
          { type: "Premium Seating", price: 60, capacity: 50 },
        ],
      },
    ];

    const events = await Event.insertMany(sampleEvents);

    console.log(`Created ${events.length} events and 2 users`);
    console.log("Organizer:", organizer.email);
    console.log("Participant:", participant.email);
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await mongoose.disconnect();
  }
}

populateDatabase();
