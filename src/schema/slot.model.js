import { Schema } from "mongoose";
import mongoose from "mongoose";

const slotSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slotType: {
    type: String,
    required: true,
    enum: ["regular", "compact", "ev", "handicap-accessible"],
  },
  status: {
    type: String,
    required: true,
    enum: ["available", "occupied", "maintenance"],
    default: "available",
  },
    vehicle: {
        type: Schema.Types.ObjectId,
        ref: "Vehicle",
    },
});


export const Slot = mongoose.model("Slot", slotSchema);