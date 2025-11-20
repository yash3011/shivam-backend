const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();  // ✅ Load variables from .env

const app = express();
const PORT = 3000;

// Middleware to parse form data or JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Example API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// ✅ Nodemailer transporter with env vars
const transporter = nodemailer.createTransport({
  service: "gmail", // change if you use Outlook/Zoho/SMTP
  auth: {
    user: process.env.EMAIL_USER, // from .env
    pass: process.env.EMAIL_PASS, // from .env
  },
});

// ✅ API endpoint to handle form submission
app.post("/api/send-consultation", async (req, res) => {
  try {
    const { name, phone, product, address } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // company inbox
      subject: "New Consultation Request",
      text: `
        Name: ${name}
        Phone: ${phone}
        Product: ${product}
        Description: ${address}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: "✅ Consultation request sent successfully!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "❌ Failed to send email" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});



// to temp server : node server.js
// in new terminal : ssh -R 80:localhost:3000 serveo.net