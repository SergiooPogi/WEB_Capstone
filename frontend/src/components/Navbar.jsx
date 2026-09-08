import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { MapPin, Menu, X, ArrowRight, LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Chatbot", to: "/qa" },
  { label: "Virtual Tour", to: "/ar-navigation" },
  { label: "Enrollment Guide", to: "/enrollment-guide" },
];

// Role-based dashboard links
function getDashboardLink(role) {
  if (role === "admin") return "/admin";
  if (role === "registrar") return "/registrar";
  return "/my-enrollments";
}

function getDashboardLabel(role) {
  if (role === "admin") return "Admin Dashboard";
  if (role === "registrar") return "Registrar Dashboard";
  return "My Enrollments";
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  async function handleLogout() {
    await logout();
    setUserMenuOpen(false);
    setOpen(false);
    navigate("/");
  }

  return (
    <header className="bg-[#001840] text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-[#F5C400] w-9 h-9 rounded-lg flex items-center justify-center shadow">
              <MapPin className="w-5 h-5 text-[#001840]" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-wide">GabAI</span>
              <p className="text-[9px] text-[#FFDC5F] leading-none tracking-widest uppercase">
                Eastern Mindoro College, Inc.
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${active
                    ? "bg-[#102A71] text-[#FFDC5F]"
                    : "text-[#FFFDF0] hover:bg-[#102A71]/60 hover:text-[#FFDC5F]"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isLoggedIn && user ? (
              /* Logged in — show user dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hidden lg:flex items-center gap-2 bg-[#102A71] hover:bg-[#102A71]/80 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                >
                  <div className="w-7 h-7 bg-[#F5C400] rounded-full flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-[#001840]" />
                  </div>
                  <span className="text-[#FFFDF0] max-w-[120px] truncate">{user.name || user.email}</span>
                  <ChevronDown className={`w-4 h-4 text-[#FFDC5F] transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    {/* User info */}
                    <div className="px-4 py-3 bg-[#FFFDF0] border-b border-gray-100">
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{user.role}</p>
                      <p className="text-sm font-semibold text-[#001840] truncate">{user.name || user.email}</p>
                    </div>
                    {/* Dashboard link */}
                    <Link
                      to={getDashboardLink(user.role)}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[#001840] hover:bg-[#FFFDF0] transition-colors font-medium"
                    >
                      <User className="w-4 h-4 text-[#102A71]" />
                      {getDashboardLabel(user.role)}
                    </Link>
                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not logged in — show Login + Get Started */
              <>
                <Link
                  to="/login"
                  className="hidden lg:flex items-center gap-2 border border-[#FFDC5F] text-[#FFDC5F] hover:bg-[#FFDC5F] hover:text-[#001840] px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-150"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/qa"
                  className="hidden lg:flex items-center gap-2 bg-[#F5C400] hover:bg-[#FFDC5F] text-[#001840] px-5 py-2 rounded-lg font-semibold text-sm transition-colors duration-150 shadow"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#102A71] transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-[#001840] border-t border-[#102A71]">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const active =
                link.to === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-4.5 rounded-lg text-sm font-medium transition-colors duration-150 ${active
                    ? "bg-[#102A71] text-[#FFDC5F]"
                    : "text-[#FFFDF0] hover:bg-[#102A71]/60"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isLoggedIn && user ? (
              <>
                {/* User info */}
                <div className="px-4 py-3 mt-2 bg-[#102A71] rounded-lg">
                  <p className="text-xs text-[#FFDC5F] font-medium uppercase tracking-wider">{user.role}</p>
                  <p className="text-sm font-semibold text-white truncate">{user.name || user.email}</p>
                </div>
                <Link
                  to={getDashboardLink(user.role)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[#FFFDF0] hover:bg-[#102A71]/60 transition-colors"
                >
                  <User className="w-4 h-4" />
                  {getDashboardLabel(user.role)}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-[#FFDC5F] border border-[#FFDC5F]/40 hover:bg-[#102A71]/60 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/qa"
                  onClick={() => setOpen(false)}
                  className="mt-1 flex items-center justify-center gap-2 bg-[#F5C400] hover:bg-[#FFDC5F] text-[#001840] px-5 py-3 rounded-lg font-semibold text-sm transition-colors duration-150"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Close user menu on outside click */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
    </header>
  );
}
