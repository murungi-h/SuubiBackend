const mongoose = require("mongoose");
const facility = require("./facility");

const vlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  facilityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Facility",
    required: true,
  },
});

module.exports = mongoose.model("Vlog", vlogSchema);
