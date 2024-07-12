const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { isValidObjectId } = require("./helper");

const addUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Email is required" });
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Email already in use" });
  }
  const user = new User({ firstName, lastName, email, phoneNumber });
  const savedUser = await user.save();
  res.status(StatusCodes.CREATED).json(savedUser);
};

const getUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid user id" });
  }
  const user = await User.findById(id);
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found" });
  }
  res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid user id" });
  }
  const { firstName, lastName, phoneNumber } = req.body;
  if (!firstName && !lastName && !phoneNumber) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Please provide user details" });
  }

  const updateData = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phoneNumber) updateData.phoneNumber = phoneNumber;

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!updatedUser) {
    return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
  }
  res.status(StatusCodes.OK).json(updatedUser);
};

module.exports = {
  addUser,
  getUser,
  updateUser,
};
