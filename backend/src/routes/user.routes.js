import express from "express";
import { authenticationToken } from "../utilities.js";
import { uploadAvatar } from "../upload.js";
import {
  registerUser,
  loginUser,
  getUser,
  updateAvatar,
} from "../controllers/user.controllers.js";

const UserRoutes = express.Router();

UserRoutes.post("/register", registerUser);
UserRoutes.post("/login", loginUser);
UserRoutes.get("/get-user", authenticationToken, getUser);
UserRoutes.put("/update-avatar", authenticationToken, uploadAvatar, updateAvatar);

export default UserRoutes;
