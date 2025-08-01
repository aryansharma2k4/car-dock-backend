import { Schema } from "mongoose";
import mongoose from "mongoose";
const sessionSchema = new Schema({
    parkVehicle: {
        type: Schema.Types.ObjectId,
        ref: "Vehicle"
    },
    parkSlot: {
        type: Schema.Types.ObjectId,
        ref: "Slot"
    },
    entryTime: {
        type: Date,
        required: true,
    },
    exitTime: {
        type: Date,
    },
    status: {
        type: String,
        required: true,
        enum: ["Active", "Completed"]
    },
    billingType: {
        type: String,
        enum: ["Hourly", "Day-Pass"]
    },
    amount: {
        type: Number,
    },
})

export const Session = mongoose.model("Session", sessionSchema)

