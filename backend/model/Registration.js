import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
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
  ticketTypeIndex: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  status: {
    type: String,
    enum: ["Confirmed", "Pending", "Canceled"],
    default: "Confirmed",
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

registrationSchema.index({ user_id: 1, event_id: 1 }, { unique: true });
const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;
