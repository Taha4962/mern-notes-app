import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: "./.env" });

const PORT = 8000;

// Initialize Express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection function
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

import UserRoutes from "./routes/user.routes.js";
import notesRoutes from "./routes/notes.routes.js";

app.use("/api/v1/users/", UserRoutes);
app.use("/api/v1/notes/", notesRoutes);
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
