import mongoose, { Schema } from "mongoose";

const slotSchema = new Schema({
    number: {
        type: String,
        unique: true,
        required: true
    },
    slotType:{
        type: String,
        required: true,
        enum: ["regular","compact","ev","handicap-accessible"]
    },
    status: {
        type: String,
        required: true,
        enum: ["available","occupied","maintenance"]
    }
})

export const Slot = mongoose.model("Slot",slotSchema)

