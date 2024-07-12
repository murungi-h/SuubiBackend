const express = require("express");
const router = express.Router();
const {
  getVlogs,
  addVlog,
  getVlog,
  updateVlog,
  deleteVlog,
} = require("../controllers/vlog");

router.route("/").get(getVlogs).post(addVlog);
router.route("/:id").get(getVlog).patch(updateVlog).delete(deleteVlog);

module.exports = router;
