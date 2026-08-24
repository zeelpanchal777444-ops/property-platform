import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useSocket } from "../context/SocketContext";

const statusStyles = {
  Pending: "bg-amber/15 text-amber-dark",
  "In Progress": "bg-blueprint/15 text-blueprint",
  Completed: "bg-teal/15 text-teal-dark",
};

const statusDot = {
  Pending: "bg-amber",
  "In Progress": "bg-blueprint",
  Completed: "bg-teal",
};

export default function Maintenance() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [requests, setRequests] = useState([]);
  const [issueDescription, setIssueDescription] = useState("");
  const socket = useSocket();

  useEffect(() => {
    api.get("/properties").then((res) => {
      setProperties(res.data);
      if (res.data.length > 0) setSelectedProperty(res.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!selectedProperty) return;
    api.get(`/maintenance/${selectedProperty}`).then((res) => setRequests(res.data));
  }, [selectedProperty]);

  useEffect(() => {
    if (!socket) return;

    const handleCreated = (newRequest) => {
      if (newRequest.propertyId === selectedProperty) {
        setRequests((prev) => [newRequest, ...prev]);
      }
    };

    const handleUpdated = (updatedRequest) => {
      setRequests((prev) =>
        prev.map((r) => (r._id === updatedRequest._id ? updatedRequest : r))
      );
    };

    socket.on("maintenanceCreated", handleCreated);
    socket.on("maintenanceUpdated", handleUpdated);

    return () => {
      socket.off("maintenanceCreated", handleCreated);
      socket.off("maintenanceUpdated", handleUpdated);
    };
  }, [socket, selectedProperty]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!issueDescription || !selectedProperty) return;
    await api.post("/maintenance", {
      propertyId: selectedProperty,
      issueDescription,
    });
    setIssueDescription("");
  };

  const handleStatusChange = async (id, status) => {
    await api.patch(`/maintenance/${id}/status`, { status });
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="font-display text-2xl font-semibold text-ink mb-6">
          Maintenance Requests
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 mb-1">Property</label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
          >
            {properties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <form onSubmit={handleCreate} className="bg-white rounded-lg shadow-sm p-4 mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Describe the issue (e.g. Kitchen tap is leaking)"
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
            className="flex-1 border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
          />
          <button
            type="submit"
            className="bg-ink text-white px-4 py-2 rounded font-medium hover:bg-ink-light transition"
          >
            Submit
          </button>
        </form>

        <div className="space-y-3">
          {requests.length === 0 && (
            <p className="text-slate-400 text-center py-6">No maintenance requests yet.</p>
          )}
          {requests.map((r) => (
            <div
              key={r._id}
              className="tick-corner text-blueprint bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-ink">{r.issueDescription}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(r.createdDate).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 ${statusStyles[r.status]}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[r.status]}`} />
                  {r.status}
                </span>
                <select
                  value={r.status}
                  onChange={(e) => handleStatusChange(r._id, e.target.value)}
                  className="text-sm border border-slate-300 rounded px-2 py-1 bg-white"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
