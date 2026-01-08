import mongoose from "mongoose";
import { toJSONPlugin } from './plugins/toJSON.js';

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
      //totale number of tickets
      type: Number,
      required: true,
      min: 1,
    },
    availableTickets: {
      // remaining tickets
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

ticketTypeSchema.plugin(toJSONPlugin);

ticketTypeSchema.pre("validate", function () {
  if (this.capacity <= 0) {
    throw new Error("Ticket capacity must be at least 1.");
  }
  if (this.isNew || this.isModified("capacity")) {
    this.availableTickets = this.capacity;
  }
});

export default ticketTypeSchema;
