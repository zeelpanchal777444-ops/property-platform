const express = require("express");
const router = express.Router();
const {
  createAmenity,
  getAmenitiesByProperty,
  bookAmenity,
  getBookingsForAmenity,
} = require("../controllers/amenityController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createAmenity);
router.get("/:propertyId", protect, getAmenitiesByProperty);
router.post("/:id/book", protect, bookAmenity);
router.get("/:id/bookings", protect, getBookingsForAmenity);

module.exports = router;
