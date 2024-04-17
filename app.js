// require("dotenv").config({ path: "./config/config.env" });
// const express = require('express')
// const morgan = require('morgan')
// const connectDB = require('./config/db.js')
// const cors = require('cors')

import { config as dotenvConfig } from "dotenv";
dotenvConfig({ path: "./config/config.env" });
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/db.js";

// const auth = require("./middlewares/auth.js");
import { authMiddleware as auth } from "./middlewares/auth.js";
import cors from "cors";
import authRouter from "./routes/auth.js";
import contactRouter from "./routes/contact.js";

const app = express();

//middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

//routes
app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.get("/protected", auth, (req, res) => {
  return res.status(200).json({ ...req.user._doc });
});
// app.use("/api", require("./routes/auth.js"));
app.use("/api", authRouter);
// app.use("/api", require("./routes/contact.js"));
app.use("/api", contactRouter);

//server configs

const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    await connectDB();
  } catch (err) {
    console.log(err);
  }
  console.log(`server is running on port : ${PORT}`);
});
