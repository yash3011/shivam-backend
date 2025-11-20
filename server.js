const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// IMPORTANT: Render / Railway will inject PORT dynamically
const PORT = process.env.PORT || 3000;


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files (if you have frontend in /public)
app.use(express.static(path.join(__dirname, "public")));

// Test endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API route - send consultation email
app.post("/api/send-consultation", async (req, res) => {
  try {
    const { name, phone, product, address } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Consultation Request",
      text: `
        Name: ${name}
        Phone: ${phone}
        Product: ${product}
        Description: ${address}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Consultation request sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
