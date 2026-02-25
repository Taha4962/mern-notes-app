import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.models.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    name.trim() === "" ||
    email.trim() === "" ||
    password.trim() === ""
  ) {
    return res
      .status(400)
      .json({ error: true, message: "Please enter all required fields." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: true, message: "Password must be at least 6 characters." });
  }

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    return res
      .status(409)
      .json({ error: true, message: "User already exists." });
  }

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(
    { user: { _id: user._id, name: user.name, email: user.email } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  const createdUser = await User.findById(user._id).select("-password");

  return res.status(201).json({
    error: false,
    createdUser,
    accessToken,
    message: "User created successfully.",
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "Please enter the required information." });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid email or password." });
  }

  // Compare hashed password
  const isPasswordValid = await bcrypt.compare(password, userInfo.password);

  if (!isPasswordValid) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid email or password." });
  }

  const accessToken = jwt.sign(
    { user: { _id: userInfo._id, name: userInfo.name, email: userInfo.email } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  return res.status(200).json({
    error: false,
    message: "Login successful.",
    accessToken,
  });
};

export const getUser = async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id }).select("-password");

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      name: isUser.name,
      email: isUser.email,
      _id: isUser._id,
      avatar: isUser.avatar,
      createdOn: isUser.createdAt,
    },
    message: "",
  });
};

export const updateAvatar = async (req, res) => {
  const { user } = req.user;

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "Please upload an image." });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { avatar: avatarPath },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      error: false,
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        _id: updatedUser._id,
        avatar: updatedUser.avatar,
        createdOn: updatedUser.createdAt,
      },
      message: "Avatar updated successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal server error." });
  }
};
