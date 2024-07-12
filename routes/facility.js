const express = require("express");
const router = express.Router();
const {
  getFacilities,
  addFacility,
  getFacility,
  updateFacility,
} = require("../controllers/facility");

router.route("/").get(getFacilities).post(addFacility);
router.route("/:id").get(getFacility).patch(updateFacility);

module.exports = router;
