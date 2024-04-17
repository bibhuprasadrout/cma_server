// require('dotenv').config({ path: "./config/config.env" })
// const router = require('express').Router();
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken')
// const User = require("../models/user")

import express from "express";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: "./config/config.env" });
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

// const auth = require('../middlewares/auth')
import { authMiddleware as auth } from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  //check all missing fields
  if (!name || !email || !password)
    return res
      .status(400)
      .json({ error: "Please enter all the required fields." });

  //check name is valid
  if (name.length > 25)
    return res
      .status(400)
      .json({ error: "Name must be shorter than 25 charecters." });

  //check email is valid
  const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailReg.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email addres." });

  //check password is valid
  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "Password must be longer than 6 charecters." });

  try {
    const doesUserAlreadyExist = await User.findOne({ email });
    if (doesUserAlreadyExist)
      return res.status(400).json({
        error: "User already exists, Please enter another email address.",
      });

    const hashedPassword = await bcrypt.hash(password, 7);
    const newUser = new User({ name, email, password: hashedPassword });

    //save the user
    const result = await newUser.save();
    result._doc.password = undefined;
    return res.status(201).json({ ...result._doc });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //check all missing fields
  if (!email || !password)
    return res
      .status(400)
      .json({ error: "Please enter both email and password." });

  //check email is valid
  const emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailReg.test(email))
    return res.status(400).json({ error: "Invalid email or password!" });

  //check password is valid
  if (password.length < 6)
    return res.status(400).json({ error: "Invalid email or password!" });

  try {
    const doesUserExist = await User.findOne({ email });
    if (!doesUserExist)
      return res.status(400).json({ error: "Invalid email or password!" });

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExist.password
    );
    if (!doesPasswordMatch)
      return res.status(400).json({ error: "Invalid email or password!" });

    const payload = { _id: doesUserExist._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const user = { ...doesUserExist._doc, password: undefined };
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

authRouter.get("/me", auth, async (req, res) => {
  try {
    res.status(200).json({
      ...req.user._doc,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// module.exports = router;
export default authRouter;
