import express from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  updateEvent,
} from "../controller/eventController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.get("/", getEvents);
router.get("/:id", getEventById);

export default router;
