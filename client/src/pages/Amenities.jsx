import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";

export default function Amenities() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [selectedAmenity, setSelectedAmenity] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showAmenityForm, setShowAmenityForm] = useState(false);
  const [newAmenityName, setNewAmenityName] = useState("");
  const socket = useSocket();

  useEffect(() => {
    api.get("/properties").then((res) => {
      setProperties(res.data);
      if (res.data.length > 0) setSelectedProperty(res.data[0]._id);
    });
  }, []);

  const loadAmenities = (propertyId) => {
    if (!propertyId) return;
    api.get(`/amenities/${propertyId}`).then((res) => {
      setAmenities(res.data);
      setSelectedAmenity(res.data.length > 0 ? res.data[0]._id : "");
    });
  };

  useEffect(() => {
    loadAmenities(selectedProperty);
  }, [selectedProperty]);

  useEffect(() => {
    if (!socket) return;
    const handleBooked = (booking) => {
      setMessageType("info");
      setMessage(
        `Live update: a slot on ${new Date(booking.bookingDate).toLocaleDateString()} (${booking.checkInTime}–${booking.checkOutTime}) was just booked by someone.`
      );
      setTimeout(() => setMessage(""), 5000);
    };
    socket.on("amenityBooked", handleBooked);
    return () => socket.off("amenityBooked", handleBooked);
  }, [socket]);

  const handleCreateAmenity = async (e) => {
    e.preventDefault();
    try {
      await api.post("/amenities", {
        amenityName: newAmenityName,
        propertyId: selectedProperty,
      });
      setNewAmenityName("");
      setShowAmenityForm(false);
      loadAmenities(selectedProperty);
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Could not create amenity");
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.post(`/amenities/${selectedAmenity}/book`, {
        bookingDate,
        checkInTime,
        checkOutTime,
      });
      setMessageType("success");
      setMessage("Booking confirmed!");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  const messageStyles = {
    info: "bg-blueprint/10 text-blueprint border border-blueprint/20",
    success: "bg-teal/10 text-teal-dark border border-teal/20",
    error: "bg-clay/10 text-clay border border-clay/20",
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-semibold text-ink">Book an Amenity</h1>
          <button
            onClick={() => setShowAmenityForm((s) => !s)}
            className="bg-ink text-white px-4 py-2 rounded font-medium hover:bg-ink-light transition text-sm"
          >
            {showAmenityForm ? "Cancel" : "+ Add Amenity"}
          </button>
        </div>

        {message && (
          <div className={`text-sm px-3 py-2 rounded mb-4 ${messageStyles[messageType]}`}>
            {message}
          </div>
        )}

        {showAmenityForm && (
          <form
            onSubmit={handleCreateAmenity}
            className="bg-white rounded-lg shadow-sm p-5 mb-6 flex gap-2"
          >
            <input
              type="text"
              placeholder="Amenity name (e.g. Swimming Pool)"
              value={newAmenityName}
              onChange={(e) => setNewAmenityName(e.target.value)}
              required
              className="flex-1 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
            />
            <button
              type="submit"
              className="bg-ink text-white px-4 py-2 rounded font-medium hover:bg-ink-light transition"
            >
              Add
            </button>
          </form>
        )}

        <form onSubmit={handleBook} className="bg-white rounded-lg shadow-sm p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Property</label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
            >
              {properties.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Amenity</label>
            <select
              value={selectedAmenity}
              onChange={(e) => setSelectedAmenity(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
            >
              {amenities.length === 0 && <option value="">No amenities for this property</option>}
              {amenities.map((a) => (
                <option key={a._id} value={a._id}>{a.amenityName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              required
              className="w-full border border-slate-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">Check-in</label>
              <input
                type="time"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                required
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">Check-out</label>
              <input
                type="time"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                required
                className="w-full border border-slate-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!selectedAmenity}
            className="w-full bg-ink text-white py-2.5 rounded font-medium hover:bg-ink-light transition disabled:opacity-50"
          >
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
