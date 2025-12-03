import mongoose from "mongoose";

const ticketTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    availableTickets: {
      type: Number,
      required: true,
      default: 0,
    },
    availableCount: {
        type: Number,
        required: true,
        min: 0
    },
    event_id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
  },
  {
    timestamps: true,
  },
);

export const TicketTypeSchema = ticketTypeSchema;
const TicketType = mongoose.model("TicketType", ticketTypeSchema);
export default TicketType;
