const express = require("express");
const router = express.Router();
const {
  getHotlines,
  addHotline,
  updateHotline,
  deleteHotline,
} = require("../controllers/hotline");

router.route("/").get(getHotlines).post(addHotline);
router.route("/:id").patch(updateHotline).delete(deleteHotline);

module.exports = router;
