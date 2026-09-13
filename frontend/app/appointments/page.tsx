"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
import AppointmentCard, { Appointment } from "@/components/AppointmentCard";

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAppointments = () => {
    setLoading(true);
    api
      .get("/patient/appointments")
      .then((res) => {
        setAppointments(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to load appointments:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAppointments();
  }, [router]);

  const handleCancelAppointment = async (id: string) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this appointment?");
    if (!confirmCancel) return;

    try {
      await api.patch(`/patient/appointments/${id}/cancel`, {
        reason: "Cancelled by patient via portal",
      });
      setActionMessage({ type: "success", text: "Appointment cancelled successfully." });
      fetchAppointments();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to cancel appointment.";
      setActionMessage({ type: "error", text: typeof msg === "string" ? msg : JSON.stringify(msg) });
    }
  };

  const filteredAppointments = appointments.filter((app) => {
    if (filterStatus === "all") return true;
    return app.status.toLowerCase() === filterStatus.toLowerCase();
  });

  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Appointments</h1>
            <p className="text-xs text-slate-500 mt-1">
              Track pending requests, confirmed visits, and past consultations
            </p>
          </div>

          <Link
            href="/appointments/book"
            className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            + Book Appointment
          </Link>
        </div>

        {actionMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
              actionMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}
          >
            <span>{actionMessage.type === "success" ? "✅" : "⚠️"}</span>
            <span>{actionMessage.text}</span>
          </div>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterStatus === status
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {status === "all" ? `All (${appointments.length})` : status}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            Loading your appointments...
          </div>
        ) : filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((app) => (
              <AppointmentCard
                key={app.id}
                appointment={app}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
            <p className="text-base font-bold text-slate-800">No appointments found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filterStatus === "all"
                ? "You haven't scheduled any doctor appointments yet."
                : `No appointments currently marked as ${filterStatus}.`}
            </p>
            <Link
              href="/appointments/book"
              className="inline-block mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-sm"
            >
              Book an Appointment Now
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
