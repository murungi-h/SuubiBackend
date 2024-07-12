const { StatusCodes } = require("http-status-codes");
const Vlog = require("../models/vlog");
const { isValidObjectId } = require("./helper");
const mongoose = require("mongoose");

const getVlogs = async (req, res) => {
  const vlogs = await Vlog.find({});
  if (vlogs.length < 1) {
    return res.status(StatusCodes.OK).json({ vlogs: [] });
  }
  res.status(StatusCodes.OK).json({ vlogs });
};

const addVlog = async (req, res) => {
  const { title, author, url, date, facilityId } = req.body;
  if (!title || !author || !url || !date || !facilityId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide all vlog details" });
  }

  if (!isValidObjectId(facilityId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid facility id" });
  }

  const newVlog = new Vlog({
    title,
    author,
    url,
    date,
    facilityId: new mongoose.Types.ObjectId(facilityId),
  });

  const savedVlog = await newVlog.save();
  if (!savedVlog) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add vlog" });
  }

  res.status(StatusCodes.CREATED).json({ vlog: savedVlog });
};

const getVlog = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid vlog id" });
  }

  const vlog = await Vlog.findById(id);
  if (!vlog) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `No vlog with id : ${id}` });
  }

  res.status(StatusCodes.OK).json({ vlog });
};

const updateVlog = async (req, res) => {
  const { id } = req.params;
  const { title, author, url, date } = req.body;

  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid vlog id" });
  }

  const updateData = {};
  if (title) updateData.title = title;
  if (author) updateData.author = author;
  if (url) updateData.url = url;
  if (date) updateData.date = date;

  const updatedVlog = await Vlog.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!updatedVlog) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Vlog not found" });
  }

  res.status(StatusCodes.OK).json({ vlog: updatedVlog });
};

const deleteVlog = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid vlog id" });
  }

  const deletedVlog = await Vlog.findByIdAndDelete(id);
  if (!deletedVlog) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Vlog not found" });
  }

  res.status(StatusCodes.OK).json({ message: "Vlog deleted successfully" });
};

module.exports = {
  getVlogs,
  addVlog,
  getVlog,
  updateVlog,
  deleteVlog,
};
