const express = require("express");
const router = express.Router();
const { createProperty, getProperties } = require("../controllers/propertyController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createProperty);
router.get("/", protect, getProperties);

module.exports = router;
