const Hotline = require("../models/hotline");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("./helper");

const getHotlines = async (req, res) => {
  const hotlines = await Hotline.find({});
  if (hotlines.length < 1) {
    return res.status(StatusCodes.OK).json({ info: "No hotlines available" });
  }
  res.status(StatusCodes.OK).json({ hotlines });
};

const addHotline = async (req, res) => {
  const { facilityId, phoneNumber } = req.body;
  if (!facilityId || !phoneNumber) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide hotline details" });
  }
  if (!isValidObjectId(facilityId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid facility id" });
  }
  const newHotline = new Hotline({
    facilityId: new mongoose.Types.ObjectId(facilityId),
    phoneNumber,
  });
  const savedHotline = await newHotline.save();
  if (!savedHotline) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error adding hotline" });
  }
  res.status(StatusCodes.CREATED).json({ hotline: savedHotline });
};

const updateHotline = async (req, res) => {
  const { id } = req.params;
  const { phoneNumber } = req.body;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide hotline id" });
  }
  if (!phoneNumber) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide hotline number" });
  }
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid hotline id" });
  }

  const updatedHotline = await Hotline.findByIdAndUpdate(
    id,
    { phoneNumber },
    { new: true }
  );
  if (!updatedHotline) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Hotline not found" });
  }
  res.status(StatusCodes.OK).json({ hotline: updatedHotline });
};

const deleteHotline = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide  hotline id" });
  }
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid hotline id" });
  }
  const deletedHotline = await Hotline.findByIdAndDelete(id);
  if (!deletedHotline) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Hotline not found" });
  }
  res
    .status(StatusCodes.OK)
    .json({ info: "Hotline deleted successfully", hotline: deletedHotline });
};

module.exports = {
  getHotlines,
  addHotline,
  updateHotline,
  deleteHotline,
};
