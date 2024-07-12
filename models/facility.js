const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  openTime: {
    type: String,
  },
  added: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Facility", facilitySchema);
