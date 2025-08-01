import mongoose, { Schema } from "mongoose";

const parkingSpaceSchema = new Schema({
    regularSlotAvailable: [
        {
            type: Schema.Types.ObjectId,
            ref: "Slot",
        }
    ],
    compactSlotAvailable: [
        {
            type: Schema.Types.ObjectId,
            ref: "Slot",
        }
    ],
    evSlotAvailable: [
        {
            type: Schema.Types.ObjectId,
            ref: "Slot",
        }
    ],
    handicapSlotAvailable: [
        {
            type: Schema.Types.ObjectId,
            ref: "Slot",
        }
    ],
    regularEmptySlot: {
        type: Number,
    },
    compactEmptySlot: {
        type: Number,
    },
    evEmptySlot: {
        type: Number,
    },
    handicapEmptySlot: {
        type: Number,
    },
    lastOccupiedSlotName: {
        type: String,
    }
})

export const ParkingSpace = mongoose.model("ParkingSpace", parkingSpaceSchema)

