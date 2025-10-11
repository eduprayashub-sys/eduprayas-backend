import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

// 👑 Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Hide passwords
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

// ✏️ Update user info (Admin)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "✅ User updated successfully", user });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    res.status(500).json({ message: "Server error while updating user" });
  }
};

// 🔐 Reset a user's password (Admin)
export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword)
      return res.status(400).json({ message: "New password required" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findByIdAndUpdate(id, { password: hashedPassword });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "✅ Password reset successfully" });
  } catch (error) {
    console.error("❌ Error resetting password:", error);
    res.status(500).json({ message: "Server error while resetting password" });
  }
};

// 🔄 Toggle user role (Admin)
export const toggleRole = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res
      .status(200)
      .json({ message: `✅ Role changed to ${user.role}`, user });
  } catch (error) {
    console.error("❌ Error toggling role:", error);
    res.status(500).json({ message: "Server error while toggling role" });
  }
};

// 🗑️ Delete user (Admin)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "🗑️ User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
};
