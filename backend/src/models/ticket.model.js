import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, trim: true },

    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },

    status: { type: String, enum: ["Open", "In Progress", "Closed"], default: "Open" },

    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);
