"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
import { Appointment } from "@/components/AppointmentCard";

export default function AppointmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  // Cancel state
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Status message
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const fetchAppointmentDetail = () => {
    setLoading(true);
    api
      .get(`/patient/appointments/${id}`)
      .then((res) => {
        setAppointment(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFoundState(true);
        } else {
          setAppointment({
            id,
            appointmentDate: new Date(Date.now() + 86400000).toISOString(),
            status: "pending",
            reason: "Persistent throat irritation and seasonal fever",
            doctor: {
              id: "d1",
              specialization: "General Physician",
              user: { name: "Dr. Mahmud Hasan", email: "dr.mahmud@hospital.com" },
            },
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchAppointmentDetail();
  }, [id, router]);

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setRescheduleError(null);

    if (!newDate) {
      setRescheduleError("Please select a new appointment date and time");
      return;
    }

    const selected = new Date(newDate);
    if (selected <= new Date()) {
      setRescheduleError("New appointment date must be in the future");
      return;
    }

    setRescheduleLoading(true);
    try {
      await api.patch(`/patient/appointments/${id}/reschedule`, {
        newAppointmentDate: selected.toISOString(),
      });
      setFeedback({ type: "success", msg: "Appointment rescheduled successfully!" });
      setIsRescheduling(false);
      fetchAppointmentDetail();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to reschedule appointment.";
      setRescheduleError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    setCancelLoading(true);

    try {
      await api.patch(`/patient/appointments/${id}/cancel`, {
        reason: cancelReason.trim() || "Cancelled by patient",
      });
      setFeedback({ type: "success", msg: "Appointment was cancelled." });
      setIsCancelling(false);
      fetchAppointmentDetail();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to cancel appointment.";
      setFeedback({ type: "error", msg: typeof msg === "string" ? msg : JSON.stringify(msg) });
    } finally {
      setCancelLoading(false);
    }
  };

  if (notFoundState) {
    return (
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-8 text-center">
          <p className="text-sm font-bold text-gray-700">Appointment not found.</p>
          <Link href="/appointments" className="mt-2 text-xs text-blue-600 underline">
            &larr; Back to all appointments
          </Link>
        </main>
      </div>
    );
  }

  if (loading || !appointment) {
    return (
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-8 text-center text-xs text-gray-400">
          Loading appointment details...
        </main>
      </div>
    );
  }

  const doctorName = appointment.doctor?.user?.name || "Consultant Doctor";
  const formattedDate = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleString(undefined, {
        dateStyle: "full",
        timeStyle: "short",
      })
    : "Not specified";

  const isCompleted = appointment.status.toLowerCase() === "completed";
  const isCancelled = appointment.status.toLowerCase() === "cancelled";

  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Link
          href="/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          &larr; Back to Appointments List
        </Link>

        {feedback && (
          <div
            className={`p-3 rounded text-xs flex items-center gap-2 border ${
              feedback.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            <span>{feedback.type === "success" ? "✅" : "⚠️"}</span>
            <span>{feedback.msg}</span>
          </div>
        )}

        <div className="bg-white rounded border border-gray-200 p-6 sm:p-8 space-y-6 max-w-3xl">
          {/* Top Status & ID */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                Appointment ID: {appointment.id}
              </span>
              <h1 className="text-2xl font-bold text-gray-900 mt-1">Visit with {doctorName}</h1>
              <p className="text-xs text-gray-500">{appointment.doctor?.specialization || "Physician"}</p>
            </div>

            <span
              className={`self-start sm:self-auto text-xs font-medium px-2.5 py-0.5 rounded capitalize ${
                appointment.status.toLowerCase() === "confirmed"
                  ? "bg-blue-100 text-blue-800"
                  : appointment.status.toLowerCase() === "completed"
                  ? "bg-green-100 text-green-800"
                  : appointment.status.toLowerCase() === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {appointment.status}
            </span>
          </div>

          {/* Details list */}
          <div className="space-y-4">
            <div className="p-4 rounded bg-gray-50 border border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scheduled Timing
              </span>
              <p className="text-base font-bold text-gray-900 mt-0.5">{formattedDate}</p>
            </div>

            <div className="p-4 rounded bg-gray-50 border border-gray-200">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Consultation Reason / Symptoms
              </span>
              <p className="text-xs sm:text-sm text-gray-700 mt-1 leading-relaxed">
                {appointment.reason || "General checkup"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {!isCompleted && !isCancelled && (
            <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setIsRescheduling(!isRescheduling);
                  setIsCancelling(false);
                }}
                className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-medium"
              >
                {isRescheduling ? "Close Reschedule" : "Reschedule Appointment"}
              </button>

              <button
                onClick={() => {
                  setIsCancelling(!isCancelling);
                  setIsRescheduling(false);
                }}
                className="px-4 py-2 rounded border border-red-300 text-red-600 hover:bg-red-50 text-xs font-medium"
              >
                {isCancelling ? "Close Cancel Form" : "Cancel Appointment"}
              </button>
            </div>
          )}

          {/* Reschedule Box */}
          {isRescheduling && (
            <form onSubmit={handleReschedule} className="p-4 rounded bg-blue-50 border border-blue-200 space-y-3">
              <h4 className="text-xs font-bold text-blue-900 uppercase">Select New Date & Time</h4>
              {rescheduleError && (
                <p className="text-red-600 text-xs">{rescheduleError}</p>
              )}
              <input
                type="datetime-local"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:border-blue-600 bg-white"
              />
              <button
                type="submit"
                disabled={rescheduleLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
              >
                {rescheduleLoading ? "Rescheduling..." : "Confirm New Date"}
              </button>
            </form>
          )}

          {/* Cancel Box */}
          {isCancelling && (
            <form onSubmit={handleCancel} className="p-4 rounded bg-red-50 border border-red-200 space-y-3">
              <h4 className="text-xs font-bold text-red-900 uppercase">Reason for Cancellation</h4>
              <input
                type="text"
                placeholder="e.g. Work conflict or feeling better..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 text-xs focus:outline-none focus:border-red-600 bg-white"
              />
              <button
                type="submit"
                disabled={cancelLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium"
              >
                {cancelLoading ? "Cancelling..." : "Confirm Cancellation"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
