const { StatusCodes } = require("http-status-codes");
const Event = require("../models/event");
const { isValidObjectId } = require("./helper");
const mongoose = require("mongoose");

const getEvents = async (req, res) => {
  const { supportGroupId } = req.query;

  if (!supportGroupId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide support group id" });
  }

  if (!isValidObjectId(supportGroupId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid support Group id" });
  }

  const events = await Event.find({
    supportGroupId: new mongoose.Types.ObjectId(supportGroupId),
  });

  if (events.length < 1) {
    return res.status(StatusCodes.OK).json({ info: "No events available" });
  }

  res.status(StatusCodes.OK).json({ events });
};

const addEvent = async (req, res) => {
  const {
    supportGroupId,
    date,
    startTime,
    endTime,
    location,
    title,
    description,
    image,
  } = req.body;
  if (
    !supportGroupId ||
    !date ||
    !startTime ||
    !endTime ||
    !location ||
    !title ||
    !description ||
    !image
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide event details" });
  }

  if (!isValidObjectId(supportGroupId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid support group id" });
  }

  const newEvent = new Event({
    supportGroupId: new mongoose.Types.ObjectId(supportGroupId),
    date,
    startTime,
    endTime,
    location,
    title,
    description,
    image,
  });

  const savedEvent = await newEvent.save();
  if (!savedEvent) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add event" });
  }

  res.status(StatusCodes.CREATED).json({ event: savedEvent });
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { date, startTime, endTime, location, title, description, image } =
    req.body;

  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide id" });
  }

  if (
    !date &&
    !startTime &&
    !endTime &&
    !location &&
    !title &&
    !description &&
    !image
  ) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide event details" });
  }

  if (!isValidObjectId(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid id" });
  }

  const updateData = {};
  if (date) updateData.date = date;
  if (startTime) updateData.startTime = startTime;
  if (endTime) updateData.endTime = endTime;
  if (location) updateData.location = location;
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (image) updateData.image = image;

  const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!updatedEvent) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "Event not found" });
  }

  res.status(StatusCodes.OK).json({ event: updatedEvent });
};

module.exports = {
  getEvents,
  addEvent,
  updateEvent,
};
