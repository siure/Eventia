import mongoose from "mongoose";
import ticketTypeSchema from "./TicketType.js";
import { toJSONPlugin } from "./plugins/toJSON.js";

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
    location: {
      type: String,
      required: true,
    },
    organizer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
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
        message: "Event must have at least 1 ticket type",
      },
    },
  },
  {
    timestamps: true,
  },
);

eventSchema.plugin(toJSONPlugin);

eventSchema.pre("save", function () {
  const oneMinuteFromNow = new Date();
  oneMinuteFromNow.setMinutes(oneMinuteFromNow.getMinutes() + 1);

  if (this.date <= oneMinuteFromNow) {
    throw new Error("Event date must be in the future (at least 1 minute from now).");
  }
});

eventSchema.methods.isPast = function () {
  return new Date() >= this.date;
};

eventSchema.methods.isFull = function () {
  return this.ticketTypes.every((tt) => tt.quantity == 0);
};

eventSchema.methods.getAvaliableForType = function (typeId) {
  const type = this.ticketTypes.find((tt) => tt.id == typeId);
  return type ? type.quantity : 0;
};
eventSchema.methods.getTicketTypeById = function (typeId) {
  return this.ticketTypes.find((tt) => tt.id == typeId);
};

const Event = mongoose.model("Event", eventSchema);
export default Event;
