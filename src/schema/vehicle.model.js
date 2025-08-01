import { Schema } from "mongoose";
import mongoose from "mongoose";

const vehicleSchema = new Schema({
    number: {
        type: String,
        required: true,
        unique: true,
    },
    vehicleType: {
        type: String,
        required: true,
        enum: ["car","bike","EV","Handicap-Accessible"]
    }
})

export const Vehicle = mongoose.model("Vehicle", vehicleSchema);

