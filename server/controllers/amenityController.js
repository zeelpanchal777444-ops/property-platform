const Amenity = require("../models/Amenity");
const AmenityBooking = require("../models/AmenityBooking");

// POST /api/amenities  (create a new amenity, e.g. "Swimming Pool")
const createAmenity = async (req, res) => {
  try {
    const { amenityName, propertyId } = req.body;

    if (!amenityName || !propertyId) {
      return res.status(400).json({ message: "amenityName and propertyId are required" });
    }

    const amenity = await Amenity.create({ amenityName, propertyId });
    res.status(201).json(amenity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/amenities/:propertyId  (list amenities for a property)
const getAmenitiesByProperty = async (req, res) => {
  try {
    const amenities = await Amenity.find({ propertyId: req.params.propertyId });
    res.json(amenities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/amenities/:id/book  (book a time slot - with conflict prevention)
const bookAmenity = async (req, res) => {
  try {
    const amenityId = req.params.id;
    const { bookingDate, checkInTime, checkOutTime } = req.body;

    if (!bookingDate || !checkInTime || !checkOutTime) {
      return res.status(400).json({
        message: "bookingDate, checkInTime and checkOutTime are required",
      });
    }

    const amenity = await Amenity.findById(amenityId);
    if (!amenity) {
      return res.status(404).json({ message: "Amenity not found" });
    }

    // Normalize the date so bookings on the same calendar day are compared correctly
    const normalizedDate = new Date(bookingDate);
    normalizedDate.setHours(0, 0, 0, 0);

    // Conflict check: does an existing booking on the same day overlap this time range?
    const conflict = await AmenityBooking.findOne({
      amenityId,
      bookingDate: normalizedDate,
      $or: [
        {
          checkInTime: { $lt: checkOutTime },
          checkOutTime: { $gt: checkInTime },
        },
      ],
    });

    if (conflict) {
      return res.status(409).json({ message: "This time slot is already booked" });
    }

    const booking = await AmenityBooking.create({
      amenityId,
      bookedBy: req.user.id,
      bookingDate: normalizedDate,
      checkInTime,
      checkOutTime,
    });

    // Real-time: tell every connected client this slot is now taken,
    // so their UI updates instantly and no one else can double-book it.
    const io = req.app.get("io");
    io.emit("amenityBooked", booking);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/amenities/:id/bookings  (list all bookings for one amenity)
const getBookingsForAmenity = async (req, res) => {
  try {
    const bookings = await AmenityBooking.find({ amenityId: req.params.id }).sort({
      bookingDate: 1,
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAmenity,
  getAmenitiesByProperty,
  bookAmenity,
  getBookingsForAmenity,
};
