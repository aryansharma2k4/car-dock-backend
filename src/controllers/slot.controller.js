import { Slot } from "../schema/slot.model.js";
import { ParkingSpace } from "../schema/parkingSpace.model.js";
import { Session } from "../schema/session.model.js";

const calculateBilling = (entryTime, exitTime, billingType) => {
  if (billingType === "Day-Pass") return 150;

  const durationInHours = (exitTime - entryTime) / (1000 * 60 * 60);
  if (durationInHours <= 1) return 50;
  if (durationInHours <= 3) return 100;
  if (durationInHours <= 6) return 150;
  return 200;
};

const setMantainanceForTheSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ success: false, message: "Slot not found" });
    }

    if (slot.status === "maintenance") {
      return res.status(400).json({ success: false, message: "Slot already under maintenance" });
    }

    const parkingSpace = await ParkingSpace.findOne();
    if (!parkingSpace) {
      return res.status(500).json({ success: false, message: "Parking space not initialized" });
    }

    const slotType = slot.slotType.toLowerCase();
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

    const availableSlotField = slotFieldMap[slotType];
    const emptySlotField = emptyFieldMap[slotType];

    if (!availableSlotField || !emptySlotField) {
      return res.status(400).json({ success: false, message: "Invalid slot type" });
    }

    const activeSession = await Session.findOne({ parkSlot: slotId, status: "Active" });

    if (activeSession) {
      const exitTime = new Date();
      const amount = calculateBilling(activeSession.entryTime, exitTime, activeSession.billingType);

      activeSession.exitTime = exitTime;
      activeSession.amount = amount;
      activeSession.status = "Completed";
      await activeSession.save();

      parkingSpace.totalMoneyCollected += amount;
    }

    await ParkingSpace.findByIdAndUpdate(parkingSpace._id, {
      $pull: { [availableSlotField]: slot._id },
      $inc: { [emptySlotField]: -1 },
    });

    slot.status = "maintenance";
    await slot.save();
    await parkingSpace.save();

    return res.status(200).json({
      success: true,
      message: "Slot marked as maintenance. Active session (if any) has been ended.",
      slot,
      sessionClosed: activeSession ? activeSession._id : null,
    });

  } catch (error) {
    console.error("setMantainanceForTheSlot error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find().populate('vehicle');
    return res.status(200).json({
      success: true,
      slots,
    });
  } catch (error) {
    console.error("getAllSlots error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export { setMantainanceForTheSlot, getAllSlots };
