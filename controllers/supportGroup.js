const SupportGroup = require("../models/supportGroup");
const mongoose = require("mongoose");
const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("./helper");

const getSupportGroups = async (req, res) => {
  const { facilityId } = req.query;
  var supportGroups;
  if (facilityId) {
    supportGroups = await SupportGroup.find({
      facilityId: new mongoose.Types.ObjectId(facilityId),
    });
    if (supportGroups.length < 1) {
      return res.status(StatusCodes.OK).json({ supportGroups: [] });
    }
    return res.status(StatusCodes.OK).json({ supportGroups });
  }

  supportGroups = await SupportGroup.find({});
  if (supportGroups.length < 1) {
    return res.status(StatusCodes.OK).json({ supportGroups: [] });
  }
  res.status(StatusCodes.OK).json({ supportGroups });
};

const getSupportGroup = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid support group id" });
  }
  const supportGroup = await SupportGroup.findById(id);
  if (!supportGroup) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Support group not found" });
  }
  res.status(StatusCodes.OK).json(supportGroup);
};

const addSupportGroup = async (req, res) => {
  const { name, facilityId, description } = req.body;
  if (!name || !facilityId || !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide all support group details" });
  }
  if (!isValidObjectId(facilityId)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid facility id" });
  }
  const newSupportGroup = new SupportGroup({
    name,
    facilityId: new mongoose.Types.ObjectId(facilityId),
    description,
  });
  const savedSupportGroup = await newSupportGroup.save();
  if (!savedSupportGroup) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error adding support group" });
  }
  res.status(StatusCodes.CREATED).json({ supportGroup: savedSupportGroup });
};

const updateSupportGroup = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide support group id" });
  }
  if (!name && !description) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide details to update" });
  }
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid support group id" });
  }

  const updatedSupportGroup = await SupportGroup.findByIdAndUpdate(
    id,
    { name, description },
    { new: true }
  );
  if (!updatedSupportGroup) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Support group not found" });
  }
  res.status(StatusCodes.OK).json({ supportGroup: updatedSupportGroup });
};

module.exports = {
  getSupportGroups,
  addSupportGroup,
  updateSupportGroup,
  getSupportGroup,
};
