const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS MUST be before routes
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Test API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// ✅ Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional but very useful
transporter.verify((error) => {
  if (error) {
    console.error("❌ Mail server error:", error);
  } else {
    console.log("✅ Mail server ready");
  }
});

// Send consultation mail
app.post("/api/send-consultation", async (req, res) => {
  try {
    const { name, phone, product } = req.body;

    if (!name || !phone || !product) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Consultation Request",
      text: `Name: ${name}\nPhone: ${phone}\nProduct: ${product}`,
    });

    res.json({
      success: true,
      message: "Consultation request sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
