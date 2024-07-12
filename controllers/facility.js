const { StatusCodes } = require("http-status-codes");
const Facility = require("../models/facility");
const { isValidObjectId } = require("./helper");

const getFacilities = async (req, res) => {
  const { email } = req.query;
  if (email) {
    const facility = await Facility.find({ email });
    if (!facility) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No facility found" });
    } else {
      return res.status(StatusCodes.OK).json({ facility });
    }
  }

  const facilities = await Facility.find({});
  if (facilities.length < 1) {
    return res.status(StatusCodes.OK).json({ facilities: [] });
  }
  res.status(StatusCodes.OK).json({ facilities });
};

const addFacility = async (req, res) => {
  const { name, location, phone, email } = req.body;
  if (!name || !location || !phone || !email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide facility details" });
  }

  const newFacility = new Facility({
    name,
    location,
    phone,
    email,
  });

  const savedFacility = await newFacility.save();
  if (!savedFacility) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to add facility" });
  }

  res.status(StatusCodes.CREATED).json({ facility: savedFacility });
};

const getFacility = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid facility id" });
  }

  const facility = await Facility.findById(id);
  if (!facility) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `No facility with id : ${id}` });
  }

  res.status(StatusCodes.OK).json({ facility });
};

const updateFacility = async (req, res) => {
  const { id } = req.params;
  const { name, location, speciality, phone, image, openTime, added } =
    req.body;

  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid facility id" });
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (location) updateData.location = location;
  if (speciality) updateData.speciality = speciality;
  if (phone) updateData.phone = phone;
  if (image) updateData.image = image;
  if (openTime) updateData.openTime = openTime;
  if (added !== undefined) updateData.added = added;

  const updatedFacility = await Facility.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedFacility) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "Facility not found" });
  }

  res.status(StatusCodes.OK).json({ facility: updatedFacility });
};

module.exports = {
  getFacilities,
  addFacility,
  getFacility,
  updateFacility,
};
