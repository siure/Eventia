import express from "express";
import {
  createEvent,
  getEventById,
  getEvents,
  getMyEvents,
  updateEvent,
  deleteEvent,
} from "../controller/eventController.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);
router.get("/my-events", protect, getMyEvents);
router.get("/", getEvents);
router.get("/:id", optionalAuth, getEventById);

export default router;
