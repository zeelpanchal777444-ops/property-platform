import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

function KpiCard({ label, value, accent }) {
  return (
    <div
      className="bg-white rounded-lg shadow-sm p-5 border-l-4"
      style={{ borderLeftColor: accent }}
    >
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="font-display text-3xl font-semibold mt-1 text-ink">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const socket = useSocket();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const loadProperties = () => {
    api.get("/properties").then((res) => setProperties(res.data));
  };

  const loadStats = () => {
    api.get("/dashboard/stats").then((res) => setStats(res.data));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/properties").then((res) => setProperties(res.data)),
      api.get("/dashboard/stats").then((res) => setStats(res.data)),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => loadStats();
    socket.on("maintenanceCreated", refresh);
    socket.on("maintenanceUpdated", refresh);
    socket.on("amenityBooked", refresh);
    return () => {
      socket.off("maintenanceCreated", refresh);
      socket.off("maintenanceUpdated", refresh);
      socket.off("amenityBooked", refresh);
    };
  }, [socket]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/properties", { name, address });
      setName("");
      setAddress("");
      setShowForm(false);
      loadProperties();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create property");
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">
          Welcome, {user?.name}
        </h1>
        <p className="text-slate-500 mb-6">Here's a live overview of your properties.</p>

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <KpiCard label="Properties" value={stats.totalProperties} accent="#3D5A80" />
            <KpiCard label="Amenities" value={stats.totalAmenities} accent="#2A9D8F" />
            <KpiCard label="Pending" value={stats.maintenance.pending} accent="#E8A33D" />
            <KpiCard label="In Progress" value={stats.maintenance.inProgress} accent="#3D5A80" />
            <KpiCard label="Completed" value={stats.maintenance.completed} accent="#2A9D8F" />
            <KpiCard
              label="Completion Rate"
              value={`${stats.maintenance.completionRate}%`}
              accent="#16233D"
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-ink">Properties</h2>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="bg-ink text-white px-4 py-2 rounded font-medium hover:bg-ink-light transition text-sm"
          >
            {showForm ? "Cancel" : "+ Add Property"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm p-5 mb-6 space-y-3">
            {error && (
              <div className="bg-clay/10 text-clay text-sm px-3 py-2 rounded border border-clay/20">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Property Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Green Valley Apartments"
                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="e.g. 123 Main Street, Ahmedabad"
                className="w-full border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
              />
            </div>
            <button
              type="submit"
              className="bg-ink text-white px-4 py-2 rounded font-medium hover:bg-ink-light transition"
            >
              Create Property
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-slate-400">Loading…</p>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center text-slate-500">
            No properties yet. Click "+ Add Property" to create one.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
              <div key={p._id} className="tick-corner text-blueprint bg-white rounded-lg shadow-sm p-5">
                <h3 className="font-display font-semibold text-ink">{p.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{p.address}</p>
                <p className="text-xs text-slate-400 mt-3 break-all font-mono">{p._id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
