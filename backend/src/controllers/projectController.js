import Project from "../models/project.model.js";
import ticketModel from "../models/ticket.model.js";

// CREATE PROJECT (Admin only)
export const createProject = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
    });
    
    console.log(project);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email");

    // Get ticket counts for each project
    const projectsWithTicketCounts = await Promise.all(
      projects.map(async (project) => {
        const ticketCount = await ticketModel.countDocuments({ project: project._id });
        return {
          ...project.toObject(),
          ticketCount,
        };
      })
    );

    const total = await Project.countDocuments();

    res.status(200).json({
      projects: projectsWithTicketCounts,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE PROJECT (Admin only)
export const deleteProject = async (req, res) => {
  try {
    // Role check
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { projectId } = req.params;

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete all tickets under this project
    await ticketModel.deleteMany({ project: projectId });

    // Delete the project
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
