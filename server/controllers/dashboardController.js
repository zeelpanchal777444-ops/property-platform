const MaintenanceRequest = require("../models/MaintenanceRequest");
const AmenityBooking = require("../models/AmenityBooking");
const Property = require("../models/Property");
const Amenity = require("../models/Amenity");

// GET /api/dashboard/stats  (overview numbers for the dashboard KPI cards)
const getStats = async (req, res) => {
  try {
    const [
      totalProperties,
      totalAmenities,
      pendingCount,
      inProgressCount,
      completedCount,
      totalBookings,
    ] = await Promise.all([
      Property.countDocuments(),
      Amenity.countDocuments(),
      MaintenanceRequest.countDocuments({ status: "Pending" }),
      MaintenanceRequest.countDocuments({ status: "In Progress" }),
      MaintenanceRequest.countDocuments({ status: "Completed" }),
      AmenityBooking.countDocuments(),
    ]);

    const totalRequests = pendingCount + inProgressCount + completedCount;
    const completionRate =
      totalRequests === 0 ? 0 : Math.round((completedCount / totalRequests) * 100);

    res.json({
      totalProperties,
      totalAmenities,
      maintenance: {
        pending: pendingCount,
        inProgress: inProgressCount,
        completed: completedCount,
        total: totalRequests,
        completionRate, // matches the KPI target: Request Completion Rate >= 90%
      },
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats };
