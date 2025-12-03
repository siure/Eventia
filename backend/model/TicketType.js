import mongoose from "mongoose";

const ticketTypeSchema = mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);

export default ticketTypeSchema;
