import nodemailer from "nodemailer";
import ContactMessage from "../models/contactMessage.js";

/* ================================
   📩 Handle Contact Form Submission
================================ */
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "⚠️ All fields are required." });
    }

    // ✅ Save to MongoDB
    const savedMessage = await ContactMessage.create({ name, email, message });

    // ✅ Email Transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    // ✅ Compose Mail
    const mailOptions = {
      from: process.env.ADMIN_EMAIL, // sender (your admin email)
      replyTo: email, // user’s email
      to: process.env.ADMIN_EMAIL, // recipient (admin)
      subject: `📬 New Contact Message from ${name}`,
      text: `
New message received from Eduprayas Contact Form:

🧍 Name: ${name}
📧 Email: ${email}

📝 Message:
${message}

⏰ Sent on: ${new Date().toLocaleString()}
      `,
    };

    // ✅ Send Mail
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: "✅ Message sent successfully!",
      data: savedMessage,
    });
  } catch (error) {
    console.error("❌ Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "⚠️ Failed to send message. Please try again later.",
    });
  }
};

/* ================================
   👑 Admin: Get All Messages
================================ */
export const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "⚠️ Failed to fetch messages." });
  }
};

/* ================================
   ❌ Admin: Delete Message
================================ */
export const deleteMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Message not found." });
    }
    res.status(200).json({ message: "🗑️ Message deleted successfully!" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ message: "⚠️ Failed to delete message." });
  }
};
