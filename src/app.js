const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

// Get the frontend URL from the environment variable
const frontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173"; // Replace with your frontend URL

// CORS configuration
app.use(
  cors({
    origin: frontendOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow sending credentials (cookies or headers)
  })
);

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Parse URL-encoded data
app.use(express.static("public")); // Serve static files from "public" folder

// Routes
const userRouter = require("./routes/index.js");
app.use("/api/v1/users/", userRouter);

module.exports = { app };
