import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

// Initialize Express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// CORS — allow multiple origins for local + production
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Rate limiter for auth routes (prevent brute-force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per window
  message: { error: true, message: "Too many requests, please try again later." },
});

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
import UserRoutes from "./routes/user.routes.js";
import notesRoutes from "./routes/notes.routes.js";

app.use("/api/v1/users/", authLimiter, UserRoutes);
app.use("/api/v1/notes/", notesRoutes);

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running." });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Notes API v2.0" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    error: true,
    message: "Something went wrong on the server.",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
