// const mongoose = require('mongoose')
import mongoose from "mongoose";
// const Joi = require('joi')
import Joi from "joi";
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  address: {
    type: String,
    required: [true, "Address is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
  },
  phone: {
    type: Number,
    required: [true, "Phone is required."],
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Contact = new mongoose.model("Contact", ContactSchema);

export const validateContact = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(4).max(30).required(),
    address: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.number().min(100000000).max(100000000000).required(),
  });
  return schema.validate(data);
};
// module.exports = { validateContact, Contact, }
