// slot.routes.js
import { Router } from "express";
import { getAllSlots, setMantainanceForTheSlot } from "../controllers/slot.controller.js";

const router = Router();

router.post("/mantainance/:slotId", setMantainanceForTheSlot);
router.get("/get", getAllSlots);

export default router;
