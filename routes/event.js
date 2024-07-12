const express = require("express");
const router = express.Router();
const { getEvents, addEvent, updateEvent } = require("../controllers/event");

router.route("/").get(getEvents).post(addEvent);
router.route("/:id").patch(updateEvent);

module.exports = router;
