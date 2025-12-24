import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTicket,
  getTickets,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/", authMiddleware, getTickets);
router.put("/:id", authMiddleware, updateTicket);
router.delete("/:id", authMiddleware, deleteTicket);

export default router;
