import mongoose, { Schema } from "mongoose";

const parkingSpaceSchema = new Schema({
  regularSlotAvailable: [
    {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
  ],
  compactSlotAvailable: [
    {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
  ],
  evSlotAvailable: [
    {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
  ],
  handicapSlotAvailable: [
    {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
  ],
  regularEmptySlot: {
    type: Number,
    required: true,
    default: 0,
  },
  compactEmptySlot: {
    type: Number,
    required: true,
    default: 0,
  },
  evEmptySlot: {
    type: Number,
    required: true,
    default: 0,
  },
  handicapEmptySlot: {
    type: Number,
    required: true,
    default: 0,
  },
  totalMoneyCollected: {
    type: Number, 
    required: true,
    default: 0,
  }
});

export const ParkingSpace = mongoose.model("ParkingSpace", parkingSpaceSchema);
