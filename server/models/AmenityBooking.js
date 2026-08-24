const mongoose = require("mongoose");

const amenityBookingSchema = new mongoose.Schema(
  {
    amenityId: { type: mongoose.Schema.Types.ObjectId, ref: "Amenity", required: true },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingDate: { type: Date, required: true },
    checkInTime: { type: String, required: true }, // e.g. "14:00"
    checkOutTime: { type: String, required: true }, // e.g. "16:00"
  },
  { timestamps: true }
);

module.exports = mongoose.model("AmenityBooking", amenityBookingSchema);
