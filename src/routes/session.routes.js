import { Router } from "express";
import { getAllSession, getSession, notifySixHours } from "../controllers/session.controller.js";

const router = Router();

router.get("/get", getAllSession)
router.get("/gets", getSession)
router.get("/notifySixHours", notifySixHours);

export default router;