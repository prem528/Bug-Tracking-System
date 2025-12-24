import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUsers } from "../controllers/userController.js";
 

const router = express.Router();

// Get all users (authenticated)
router.get("/", authMiddleware, getUsers);

export default router;
