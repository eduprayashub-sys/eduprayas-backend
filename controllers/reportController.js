import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { PassThrough } from "stream";
import path from "path";
import fs from "fs";
import Result from "../models/resultModel.js";
import Test from "../models/testModel.js";
import User from "../models/userModel.js";
import Question from "../models/questionModel.js"; // ✅ required import

// 🎓 Send Branded PDF Report to Student via Email
export const sendResultReport = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const results = await Result.find({ userId: user._id }).lean();
    if (!results.length)
      return res.status(404).json({ message: "No results found" });

    const tests = await Test.find();

    // 🧾 Create a PDF document
    const doc = new PDFDocument({ margin: 40 });
    const stream = new PassThrough();
    let pdfBuffer = [];

    const logoPath = path.resolve("public/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 250, 20, { width: 100 });
    }

    doc.moveDown(3);
    doc
      .fontSize(24)
      .fillColor("#1d4ed8")
      .text("Eduprayas Test Report", { align: "center" });
    doc.moveDown(0.5);
    doc
      .fontSize(12)
      .fillColor("gray")
      .text("Empowering Education Through Practice", { align: "center" });
    doc.moveDown(1.5);

    // 👤 Student Info
    doc
      .fontSize(14)
      .fillColor("black")
      .text(`Name: ${user.name}`)
      .text(`Email: ${user.email}`)
      .moveDown(1);

    // 📊 Table Header
    doc
      .fontSize(13)
      .fillColor("#1d4ed8")
      .text("Test Title", 60, doc.y, { continued: true })
      .text("Score", 280, doc.y, { continued: true })
      .text("Percentage", 380, doc.y, { continued: true })
      .text("Date", 480, doc.y);
    doc.moveTo(60, doc.y + 2).lineTo(540, doc.y + 2).stroke("#1d4ed8");
    doc.moveDown(0.5);

    // 🧮 Results Table
    results.forEach((r) => {
      const test = tests.find((t) => t._id.toString() === r.testId.toString());
      doc
        .fillColor("black")
        .fontSize(12)
        .text(test?.title || "Test", 60, doc.y, { continued: true })
        .text(`${r.score}/${r.totalMarks}`, 280, doc.y, { continued: true })
        .text(`${r.percentage}%`, 400, doc.y, { continued: true })
        .text(new Date(r.createdAt).toLocaleDateString(), 480, doc.y);
      doc.moveDown(0.3);
    });

    doc.moveDown(2);
    doc.fontSize(12).fillColor("gray").text("Thank you for using Eduprayas!", {
      align: "center",
    });

    doc.end();

    stream.on("data", (chunk) => pdfBuffer.push(chunk));
    doc.pipe(stream);

    stream.on("end", async () => {
      const finalBuffer = Buffer.concat(pdfBuffer);

      // ✉️ Email Setup (using Gmail + App Password)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Eduprayas Reports" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: "Your Eduprayas Test Report (PDF Attached)",
        text: `Dear ${user.name},

Please find attached your latest Eduprayas test report.

Keep practicing and improving!

Warm regards,
Team Eduprayas`,
        attachments: [
          {
            filename: "Eduprayas-Test-Report.pdf",
            content: finalBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      res.json({
        success: true,
        message: "✅ Branded PDF report sent successfully via email!",
      });
    });
  } catch (error) {
    console.error("❌ PDF Email Error:", error);
    res.status(500).json({ message: "Failed to send report via email" });
  }
};
