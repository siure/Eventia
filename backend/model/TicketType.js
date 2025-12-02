import mongoose from "mongoose";

const ticketTypeSchema = mongoose.Schema(
  {
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

const ticketType = mongoose.model("ticketType", ticketTypeSchema);
export default ticketType;
