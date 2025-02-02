import express from "express";
import {
  getUser,
  loginUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { authenticationToken } from "../utilities.js";

const router = express.Router();

// Auth requests API
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get-user", authenticationToken, getUser);

export default router;
