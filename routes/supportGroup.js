const express = require("express");
const router = express.Router();
const {
  getSupportGroups,
  addSupportGroup,
  getSupportGroup,
  updateSupportGroup,
} = require("../controllers/supportGroup");

router.route("/").get(getSupportGroups).post(addSupportGroup);
router.route("/:id").get(getSupportGroup).patch(updateSupportGroup);

module.exports = router;
