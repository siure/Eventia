import mongoose from "mongoose";
import { ticketTypeSchema } from './TicketType.js';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    date: {
      type: Date,
      required: true,
    },
    location: String,
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      required: true,
    },
    ticketTypes: {
      type: [ticketTypeSchema],
      required: true,
      default: []
    },
    registrationCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
