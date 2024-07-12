const express = require("express");
const router = express.Router();
const { addUser, getUser, updateUser } = require("../controllers/user");

router.route("/").post(addUser);
router.route("/:id").get(getUser).patch(updateUser);

module.exports = router;
