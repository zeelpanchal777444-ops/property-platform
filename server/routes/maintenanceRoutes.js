const express = require("express");
const router = express.Router();
const {
  createRequest,
  getRequestsByProperty,
  updateStatus,
} = require("../controllers/maintenanceController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createRequest);
router.get("/:propertyId", protect, getRequestsByProperty);
router.patch("/:id/status", protect, updateStatus);

module.exports = router;
