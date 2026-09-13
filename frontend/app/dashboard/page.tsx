"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
import AppointmentCard, { Appointment } from "@/components/AppointmentCard";
import MedicalRecordCard, { MedicalRecord } from "@/components/MedicalRecordCard";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Patient");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setUserName(u.name || "Patient");
      } catch {
        setUserName("Patient");
      }
    }

    // Fetch dashboard quick data
    Promise.all([
      api.get("/patient/appointments").catch(() => ({ data: [] })),
      api.get("/patient/medical-records").catch(() => ({ data: [] })),
    ])
      .then(([appRes, recRes]) => {
        setAppointments(Array.isArray(appRes.data) ? appRes.data : []);
        setRecords(Array.isArray(recRes.data) ? recRes.data : []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const upcomingAppointments = appointments
    .filter(
      (a) =>
        a.status.toLowerCase() === "pending" ||
        a.status.toLowerCase() === "confirmed"
    )
    .slice(0, 2);

  const recentRecords = records.slice(0, 2);

  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm mb-3">
              Patient Portal Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {userName}! 👋</h1>
            <p className="mt-2 text-blue-100 text-xs sm:text-sm max-w-xl">
              Track your upcoming medical appointments, consult specialist doctors, and review your hospital diagnoses and prescriptions anytime.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/appointments/book"
                className="px-4 py-2 bg-white text-blue-700 text-xs sm:text-sm font-bold rounded-xl shadow hover:bg-blue-50 transition"
              >
                + Book New Appointment
              </Link>
              <Link
                href="/doctors"
                className="px-4 py-2 bg-blue-800/60 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-xl border border-white/20 transition"
              >
                Find Specialist
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs text-slate-400 font-medium">Total Appointments</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{appointments.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs text-amber-600 font-medium">Pending Visits</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {appointments.filter((a) => a.status.toLowerCase() === "pending").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs text-blue-600 font-medium">Confirmed Visits</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {appointments.filter((a) => a.status.toLowerCase() === "confirmed").length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs text-emerald-600 font-medium">Medical Records</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{records.length}</p>
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Upcoming Appointments</h2>
            <Link
              href="/appointments"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View All ({appointments.length}) &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Loading your appointments...
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((app) => (
                <AppointmentCard key={app.id} appointment={app} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No active appointments</p>
              <p className="text-xs text-slate-400">
                You do not have any pending or confirmed appointments at the moment.
              </p>
              <Link
                href="/appointments/book"
                className="inline-block mt-2 text-xs font-semibold text-blue-600 hover:underline"
              >
                Schedule your first visit
              </Link>
            </div>
          )}
        </div>

        {/* Recent Medical Records Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Medical Records & Prescriptions</h2>
            <Link
              href="/medical-records"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View All Records &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              Loading medical records...
            </div>
          ) : recentRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentRecords.map((rec) => (
                <MedicalRecordCard key={rec.id} record={rec} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">No medical records found</p>
              <p className="text-xs text-slate-400">
                Doctor consultation notes and digital prescriptions will appear here once you complete a visit.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
