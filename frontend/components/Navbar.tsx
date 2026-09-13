"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserName(user.name || "Patient");
        } catch {
          setUserName("Patient");
        }
      }
    } else {
      setIsLoggedIn(false);
      setUserName(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserName(null);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                +
              </div>
              <div>
                <span className="text-xl font-bold text-blue-600">CarePoint</span>
                <span className="block text-xs text-gray-500">Patient Portal</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          {isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/dashboard"
                className={`text-sm font-medium px-3 py-2 rounded ${
                  pathname === "/dashboard"
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/doctors"
                className={`text-sm font-medium px-3 py-2 rounded ${
                  pathname.startsWith("/doctors")
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Doctors
              </Link>
              <Link
                href="/appointments"
                className={`text-sm font-medium px-3 py-2 rounded ${
                  pathname.startsWith("/appointments")
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Appointments
              </Link>
              <Link
                href="/medical-records"
                className={`text-sm font-medium px-3 py-2 rounded ${
                  pathname.startsWith("/medical-records")
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                Medical Records
              </Link>

              <div className="h-6 w-px bg-gray-200 mx-2" />

              {/* User badge & logout */}
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-1.5 rounded border border-gray-200 bg-gray-50 hover:bg-gray-100"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {userName ? userName.charAt(0).toUpperCase() : "P"}
                </div>
                <span>{userName || "Profile"}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/doctors"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 px-3 py-2"
              >
                View Doctors
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          {isLoggedIn && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isLoggedIn && mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Doctors
          </Link>
          <Link
            href="/appointments"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Appointments
          </Link>
          <Link
            href="/appointments/book"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            + Book Appointment
          </Link>
          <Link
            href="/medical-records"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Medical Records
          </Link>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Profile ({userName})
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="w-full text-left px-3 py-2 rounded text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
