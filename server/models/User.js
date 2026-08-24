const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["tenant", "owner", "admin"],
      default: "tenant",
    },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
