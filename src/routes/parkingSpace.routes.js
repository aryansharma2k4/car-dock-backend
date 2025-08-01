import { Router } from "express";
import { initializeParking } from "../controllers/parkingSpace.controller.js";

const router = Router();

router.route("/initialize").post(initializeParking);

export default router;