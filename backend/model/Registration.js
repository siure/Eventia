import mongoose from "mongoose";
import { toJSONPlugin } from './plugins/toJSON.js';

const registrationSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketType_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"], // pending not paid reserved for x min, approved paid & cancelled not paid in time or got refund
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

registrationSchema.plugin(toJSONPlugin);

// Prevent duplicate registrations: same user, same event, same ticket type
registrationSchema.index(
  { user_id: 1, event_id: 1, ticketType_id: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: { $ne: "cancelled" } }
  }
);

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
