import { Router } from "express";
import { getParkingSpace, initializeParking } from "../controllers/parkingSpace.controller.js";

const router = Router();

router.route("/initialize").post(initializeParking);
router.route("/get").get(getParkingSpace)

export default router;