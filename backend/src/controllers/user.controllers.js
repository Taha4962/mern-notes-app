import jwt from "jsonwebtoken";
import { authenticationToken } from "../utilities.js";
import { User } from "../models/user.models.js";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body; //getting the information from the website.

  console.log(req.body);

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
  } // checking the information is empty or not.

  const existedUser = await User.findOne({ email: email });

  if (existedUser) {
    return res
      .status(409)
      .json({ error: true, message: "User is already existed." });
  } // checking if the user exist or not.

  const user = await User.create({
    name,
    email,
    password,
  }); // creating the user in the database.

  await user.save(); // saving the information of the user.

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "3600m",
  }); // creating the access for the user and expiring it.

  const createdUser = await User.findById(user._id).select("-password"); // triming the credential information in the response.

  return res.status(200).json({
    error: false,
    createdUser,
    accessToken,
    message: "User is created successfully.",
  }); // giving the response with successfull that user is created.
}; // controller for creating the user.

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter the required information." });
  }

  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "The user doesn't exist." });
  }

  if (userInfo.email === email && userInfo.password === password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res
      .status(200)
      .json({ error: false, message: "Login user successfully.", accessToken });
  } else {
    return res.status(400).json({ error: true, message: "User is invalid" });
  }
}; // controller for login the user with the access token also.

export const logoutUser = async (req, res) => {
  const {} = req.params;
}; // controller for logout the user from the session.

export const getUser = async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      name: isUser.name,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdAt,
    },
    message: "",
  });
}; //controller for get the information of the current user.
