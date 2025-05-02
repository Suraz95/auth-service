// Using linked shared-utils package
const { asyncHandler, ApiError, ApiResponse } = require("shared-utils");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

const registerUser = asyncHandler(async (req, res) => {
  const { name, username, phone, email, password, userType } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userExists = await User.findOne({ email, phone });
  if (userExists) throw new ApiError(400, "user with email or phone exists");
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    username,
    phone,
    email,
    password: hashedPassword,
    userType,
  });
  await newUser.save();
  if (!newUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, newUser, "User registered Successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "There's no such user exists");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid username or password");
  await user.save();
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    // secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
  return res.status(200).json({ user: user.name });
});
const logoutUser = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (!user) throw new ApiError(400, "invalid User");
  return res.status(200).json(new ApiResponse(200, "logout Successfull"));
});
module.exports = { registerUser,loginUser,logoutUser };
