const mongoose = require("mongoose");

const supportGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    facilityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },
    members: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SupportGroup", supportGroupSchema);
