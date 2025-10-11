import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
    },
  },
  { timestamps: true } // ✅ Automatically adds createdAt and updatedAt
);

// Optional: Create index for better admin search performance
contactMessageSchema.index({ email: 1, createdAt: -1 });

const ContactMessage = mongoose.model("ContactMessage", contactMessageSchema);

export default ContactMessage;

