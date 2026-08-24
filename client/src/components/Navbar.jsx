import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function KeyholeMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="9" r="4" stroke="#E8A33D" strokeWidth="2" />
      <path d="M12 13L9 20H15L12 13Z" fill="#E8A33D" />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/maintenance", label: "Maintenance" },
    { to: "/amenities", label: "Amenities" },
  ];

  return (
    <nav className="bg-ink bg-blueprint bg-grid px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center gap-2">
        <KeyholeMark />
        <span className="font-display font-semibold text-lg text-white tracking-tight">
          Keystone
        </span>
      </Link>

      <div className="flex items-center gap-1 text-sm">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded font-medium transition ${
                active
                  ? "bg-amber text-ink-dark"
                  : "text-slate-200 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}

        <span className="w-px h-5 bg-white/20 mx-3" />

        <span className="text-slate-300 font-medium">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="ml-3 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
