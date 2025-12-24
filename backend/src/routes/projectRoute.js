import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createProject,
  deleteProject,
  getProjects,
} from "../controllers/projectController.js";

const router = express.Router();

// Create project (admin only)
router.post("/", authMiddleware, createProject);

// Get all projects
router.get("/", authMiddleware, getProjects);


router.delete("/:projectId", authMiddleware, deleteProject);

export default router;
