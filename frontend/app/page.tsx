"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <main className="flex-1 flex flex-col justify-center items-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          CarePoint Hospital Management System
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
          Your Health Care, Simplified & Accessible in{" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            One Portal
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          Book appointments with top specialists, track consultation status in real-time,
          and securely download your digital prescriptions and clinical test records anywhere, anytime.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
            >
              Go to Patient Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Sign In to Portal
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 shadow-sm transition-all"
              >
                Register as New Patient
              </Link>
            </>
          )}
          <Link
            href="/doctors"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm transition-all"
          >
            Browse Doctors &rarr;
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-xl font-bold mb-4">
              👨‍⚕️
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Find Specialists</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Explore verified doctors across Cardiology, Neurology, Pediatrics, and more with live schedule availability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-xl font-bold mb-4">
              🗓️
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Effortless Booking</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reserve your slot in seconds. Track whether your appointment is Pending, Confirmed, or Completed.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold mb-4">
              📑
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Digital Health Records</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Permanent, encrypted storage for diagnoses, medical prescriptions, and clinical lab reports.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
