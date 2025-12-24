import Project from "../models/project.model.js";

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

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
