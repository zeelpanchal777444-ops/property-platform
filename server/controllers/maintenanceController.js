const MaintenanceRequest = require("../models/MaintenanceRequest");

// POST /api/maintenance
const createRequest = async (req, res) => {
  try {
    const { propertyId, issueDescription } = req.body;

    if (!propertyId || !issueDescription) {
      return res.status(400).json({ message: "propertyId and issueDescription are required" });
    }

    const request = await MaintenanceRequest.create({
      propertyId,
      issueDescription,
      createdBy: req.user.id,
    });

    const io = req.app.get("io");
    io.emit("maintenanceCreated", request);

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/maintenance/:propertyId
const getRequestsByProperty = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({
      propertyId: req.params.propertyId,
    }).sort({ createdDate: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/maintenance/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "In Progress", "Completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updateData = { status };
    if (status === "Completed") {
      updateData.resolutionDate = new Date();
    }

    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const io = req.app.get("io");
    io.emit("maintenanceUpdated", request);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getRequestsByProperty, updateStatus };
