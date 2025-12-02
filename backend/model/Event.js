import mongoose from "mongoose";
import ticketTypeSchema from "./TicketType.js";

const eventSchema = mongoose.Schema(
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
    location: {
      type: String,
      required: true,
    },
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
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Event must have at least 1 ticket type"
      }
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.pre("save", function (next) {
  const currentDate = new Date();
  currentDate.setMinutes(currentDate.getMinutes() + 1);
  if (currentDate >= this.date) {
    const error = new Error(
      "Event date must be in the future (at least 1 minute from now).",
    );
    next(error);
  }

  next();
});

eventSchema.methods.isPast = function () {
  return (new Date() >= this.date);
}

eventSchema.methods.isFull = function () {
  return this.ticketTypes.every(tt => tt.quantity == 0);
}

eventSchema.methods.getAvaliableForType = function (typeId) {
  const type = this.ticketTypes.find(tt => tt.id == typeId);
  return type ? type.quantity : 0;
}
eventSchema.methods.getTicketTypeById = function (typeId) {
  return this.ticketTypes.find(tt => tt.id == typeId);
}

const Event = mongoose.model("Event", eventSchema);
export default Event;
