import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import buildingIllustration from "../assets/property-illustration.svg";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password, role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-ink bg-blueprint bg-grid p-12 text-white relative overflow-hidden">
        <div className="flex items-center gap-2 relative z-10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="4" stroke="#E8A33D" strokeWidth="2" />
            <path d="M12 13L9 20H15L12 13Z" fill="#E8A33D" />
          </svg>
          <span className="font-display font-semibold text-lg tracking-tight">Keystone</span>
        </div>

        <img
          src={buildingIllustration}
          alt="Property illustration"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

        <div className="relative z-10">
          <span className="inline-block text-xs font-medium tracking-widest uppercase text-amber mb-4">
            Property Management, Elevated
          </span>
          <h1 className="font-display text-4xl font-semibold leading-tight mb-4">
            One place for<br />every property.
          </h1>
          <p className="text-slate-200 max-w-sm">
            Set up your account to start tracking maintenance and
            managing shared amenities across your properties.
          </p>
        </div>

        <p className="text-xs text-slate-300 relative z-10">
          Real-Time Property Rental, Maintenance &amp; Amenity Management
        </p>
      </div>

      <div className="flex items-center justify-center p-8 bg-paper">
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <h2 className="font-display text-2xl font-semibold text-ink mb-1">Create account</h2>
          <p className="text-slate-500 text-sm mb-6">Get started with Keystone</p>

          {error && (
            <div className="bg-clay/10 text-clay text-sm px-3 py-2 rounded mb-4 border border-clay/20">
              {error}
            </div>
          )}

          <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-slate-300 rounded px-3 py-2.5 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
          />

          <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-slate-300 rounded px-3 py-2.5 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
          />

          <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-slate-300 rounded px-3 py-2.5 mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
          />

          <label className="block text-sm font-medium text-slate-600 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-slate-300 rounded px-3 py-2.5 mb-6 bg-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
          >
            <option value="tenant">Tenant</option>
            <option value="owner">Owner</option>
          </select>

          <button
            type="submit"
            className="w-full bg-ink text-white py-2.5 rounded font-medium hover:bg-ink-light transition"
          >
            Create Account
          </button>

          <p className="text-sm text-slate-500 mt-5 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blueprint font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
