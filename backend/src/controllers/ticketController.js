import ticketModel from "../models/ticket.model.js";

 

// ----------------------CREATE TICKET-----------------------
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, project, assignedTo } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: "Title and project are required" });
    }

    const ticket = await ticketModel.create({
      title,
      description,
      priority,
      project,
      assignedTo,
      createdBy: req.user.id,
    });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET TICKETS (with filters)
export const getTickets = async (req, res) => {
  try {
    const { projectId, status, priority } = req.query;

    const filter = {};

    if (projectId) filter.project = projectId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tickets = await ticketModel.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");

    const total = await ticketModel.countDocuments(filter);

    res.status(200).json({
      tickets,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------UPDATE TICKET WITH PERMISSIONS--------------------
export const updateTicket = async (req, res) => {
    try {
      const ticket = await ticketModel.findById(req.params.id);
  
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
  
      const userId = req.user.id;
      const userRole = req.user.role;

      console.log(userId, userRole);
  
      // Permission check
      const isCreator = ticket.createdBy.toString() === userId;
      const isAssigned = ticket.assignedTo?.toString() === userId;
      const isAdmin = userRole === "admin";
  
      if (!isCreator && !isAssigned && !isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
  
      // Admin-only assignment
      if (req.body.assignedTo && !isAdmin) {
        return res.status(403).json({ message: "Only admin can assign tickets" });
      }
  
      Object.assign(ticket, req.body);
      await ticket.save();
  
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

// ---------------------DELETE TICKET-------------------
export const deleteTicket = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Only admin can delete tickets" });
      }
  
      const ticket = await  ticketModel.findByIdAndDelete(req.params.id);
  
      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }
  
      res.status(200).json({ message: "Ticket deleted successfully" });
      console.log(ticket);
      console.log("Ticket deleted successfully");
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  
