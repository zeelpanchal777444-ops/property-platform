const mongoose = require("mongoose");

const amenitySchema = new mongoose.Schema(
  {
    amenityName: { type: String, required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    availabilityStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Amenity", amenitySchema);
