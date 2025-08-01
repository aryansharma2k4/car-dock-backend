import { ParkingSpace } from "../schema/parkingSpace.model.js";
import { Slot } from "../schema/slot.model.js";

const initializeParking = async (req, res) => {
  try {
    const regularSlotNames = ["R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08", "R09", "R10"];
    const compactSlotNames = ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10"];
    const evSlotNames = ["E01", "E02", "E03", "E04", "E05"];
    const handicapSlotNames = ["H01", "H02", "H03", "H04", "H05"];

    const regularSlots = [];
    const compactSlots = [];
    const evSlots = [];
    const handicapSlots = [];

    let counter = 1;

    const createSlot = async (name, type) => {
      const slot = new Slot({
        name,
        slotType: type,
        status: "available",
      });
      await slot.save();
      return slot._id;
    };

    for (const name of regularSlotNames) {
      const id = await createSlot(name, "regular");
      regularSlots.push(id);
    }

    for (const name of compactSlotNames) {
      const id = await createSlot(name, "compact");
      compactSlots.push(id);
    }

    for (const name of evSlotNames) {
      const id = await createSlot(name, "ev");
      evSlots.push(id);
    }

    for (const name of handicapSlotNames) {
      const id = await createSlot(name, "handicap-accessible");
      handicapSlots.push(id);
    }

    const parkingSpace = new ParkingSpace({
      regularSlotAvailable: regularSlots,
      compactSlotAvailable: compactSlots,
      evSlotAvailable: evSlots,
      handicapSlotAvailable: handicapSlots,
      regularEmptySlot: regularSlots.length,
      compactEmptySlot: compactSlots.length,
      evEmptySlot: evSlots.length,
      handicapEmptySlot: handicapSlots.length,
      lastOccupiedSlotName: null,
    });

    await parkingSpace.save();

    res.status(201).json({
      success: true,
      message: "Parking space initialized successfully",
      parkingSpace,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export { initializeParking };
