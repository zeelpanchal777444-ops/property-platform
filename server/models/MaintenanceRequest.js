const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    issueDescription: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    resolutionDate: { type: Date },
  },
  { timestamps: { createdAt: "createdDate", updatedAt: true } }
);

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
