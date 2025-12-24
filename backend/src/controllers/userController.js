import User from "../models/user.model.js";



// GET ALL USERS (for ticket assignment)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
