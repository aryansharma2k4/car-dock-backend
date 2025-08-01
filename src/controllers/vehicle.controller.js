import { ParkingSpace } from "../schema/parkingSpace.model.js";
import { Slot } from "../schema/slot.model.js";
import { Vehicle } from "../schema/vehicle.model.js";
import { Session } from "../schema/session.model.js";
// import { upstashCronJob } from "../utils/cronJobs.js";

const registerVehicle = async (req, res) => {
  try {
    const { number, vehicleType, billingType } = req.body;

    if (!number || !vehicleType || !billingType) {
      return res.status(400).json({
        success: false,
        message: "number, vehicleType, and billingType are required.",
      });
    }

    const validVehicleTypes = ["car", "bike", "ev", "handicap-accessible"];
    const validBillingTypes = ["Hourly", "Day-Pass"];

    const vehicleToSlotMap = {
      car: "regular",
      bike: "compact",
      ev: "ev",
      "handicap-accessible": "handicap-accessible",
    };

    const normalizedVehicleType = vehicleType.toLowerCase();

    if (!validVehicleTypes.includes(normalizedVehicleType)) {
      return res.status(400).json({
        message: `Invalid vehicleType. Must be one of: ${validVehicleTypes.join(", ")}`,
      });
    }

    if (!validBillingTypes.includes(billingType)) {
      return res.status(400).json({
        message: `Invalid billingType. Must be one of: ${validBillingTypes.join(", ")}`,
      });
    }

    const slotType = vehicleToSlotMap[normalizedVehicleType];

    const slotFieldMap = {
      regular: "regularSlotAvailable",
      compact: "compactSlotAvailable",
      ev: "evSlotAvailable",
      "handicap-accessible": "handicapSlotAvailable",
    };

    const emptyFieldMap = {
      regular: "regularEmptySlot",
      compact: "compactEmptySlot",
      ev: "evEmptySlot",
      "handicap-accessible": "handicapEmptySlot",
    };

    const parkingSpace = await ParkingSpace.findOne();
    if (!parkingSpace) {
      return res.status(404).json({ message: "Parking space not initialized." });
    }

    const availableSlots = parkingSpace[slotFieldMap[slotType]];
    const emptyCount = parkingSpace[emptyFieldMap[slotType]];

    if (!availableSlots || availableSlots.length === 0 || emptyCount <= 0) {
      return res.status(400).json({ message: `No ${slotType} slots available.` });
    }

    const selectedSlotId = availableSlots[0];

    const newVehicle = await Vehicle.create({
      number,
      vehicleType,
    });

    // Update slot: occupied + assign vehicle
    const updatedSlot = await Slot.findByIdAndUpdate(
      selectedSlotId,
      { status: "occupied", vehicle: newVehicle._id },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(400).json({ message: `Could not update ${slotType} slot.` });
    }

    const entryTime = new Date();

    const newSession = await Session.create({
      parkVehicle: newVehicle._id,
      parkSlot: updatedSlot._id,
      entryTime,
      status: "Active",
      billingType,
      amount: 0,
    });
    upstashCronJob(newSession._id);

    // Update parking space slot list
    await ParkingSpace.findByIdAndUpdate(parkingSpace._id, {
      $inc: { [emptyFieldMap[slotType]]: -1 },
      $pull: { [slotFieldMap[slotType]]: selectedSlotId },
    });

    return res.status(201).json({
      success: true,
      message: `${vehicleType} vehicle registered and parked.`,
      vehicle: newVehicle,
      slot: updatedSlot,
      session: newSession,
    });
  } catch (error) {
    console.error("registerVehicle error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

const exitVehicle = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId)
      .populate("parkVehicle")
      .populate("parkSlot");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.status === "Completed") {
      return res.status(400).json({ success: false, message: "Vehicle already exited" });
    }

    const exitTime = new Date();
    const amount = calculateBilling(session.entryTime, exitTime, session.billingType);

    // Update session
    session.exitTime = exitTime;
    session.amount = amount;
    session.status = "Completed";
    await session.save();

    // Free the slot
    const slot = await Slot.findById(session.parkSlot._id);
    if (slot) {
      slot.status = "available";
      slot.vehicle = null;
      await slot.save();
    }

    // Update total earnings
    const parkingSpace = await ParkingSpace.findOne();
    if (!parkingSpace) {
      return res.status(500).json({ success: false, message: "Parking space not initialized" });
    }

    parkingSpace.totalMoneyCollected += amount;
    await parkingSpace.save();

    res.status(200).json({
      success: true,
      message: "Vehicle exited successfully",
      data: session,
    });
  } catch (error) {
    console.error("Error exiting vehicle:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const calculateBilling = (entryTime, exitTime, billingType) => {
  if (billingType === "Day-Pass") return 150;

  const durationInHours = (exitTime - entryTime) / (1000 * 60 * 60);
  if (durationInHours <= 1) return 50;
  if (durationInHours <= 3) return 100;
  if (durationInHours <= 6) return 150;
  return 200;
};
const getVehicleById = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error("getVehicleById error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { registerVehicle, exitVehicle, getVehicleById };
