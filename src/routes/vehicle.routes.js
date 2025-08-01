import { Router } from "express";
import { registerVehicle, exitVehicle, getVehicleById } from "../controllers/vehicle.controller.js";

const router = new Router();

router.post("/register", registerVehicle)
router.post("/exit/:sessionId", exitVehicle);
router.get("/get/:vehicleId", getVehicleById)


export default router;