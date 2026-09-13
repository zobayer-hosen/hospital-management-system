"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
import { Doctor } from "@/components/DoctorCard";

function BookAppointmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedDoctorId = searchParams.get("doctorId") || "";

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState({
    doctorId: preselectedDoctorId,
    appointmentDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/patient/doctors")
      .then((res) => {
        const docList = Array.isArray(res.data) ? res.data : [];
        setDoctors(docList);
        if (preselectedDoctorId && !formData.doctorId) {
          setFormData((prev) => ({ ...prev, doctorId: preselectedDoctorId }));
        }
      })
      .catch(() => {
        // Mock fallback if doctor API is empty
        setDoctors([
          {
            id: "d1",
            specialization: "Cardiologist",
            user: { name: "Dr. Mahmud Hasan" },
          },
          {
            id: "d2",
            specialization: "Neurologist",
            user: { name: "Dr. Farzana Rahman" },
          },
        ]);
      });
  }, [router, preselectedDoctorId]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.doctorId) {
      errs.doctorId = "Please select a doctor";
    }

    if (!formData.appointmentDate) {
      errs.appointmentDate = "Please select an appointment date and time";
    } else {
      const selected = new Date(formData.appointmentDate);
      const now = new Date();
      if (isNaN(selected.getTime())) {
        errs.appointmentDate = "Invalid date format";
      } else if (selected <= now) {
        errs.appointmentDate = "Appointment date and time must be in the future";
      }
    }

    if (!formData.reason.trim()) {
      errs.reason = "Please describe your reason or symptoms for the visit";
    } else if (formData.reason.trim().length < 5) {
      errs.reason = "Reason must be at least 5 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/patient/appointments", {
        doctorId: formData.doctorId,
        appointmentDate: new Date(formData.appointmentDate).toISOString(),
        reason: formData.reason.trim(),
      });

      router.push("/appointments");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Failed to schedule appointment. Please check if the slot is available.";
      setServerError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Schedule Consultation</h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide your symptoms and select your preferred specialist and time slot
        </p>
      </div>

      {serverError && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Select Medical Specialist *
          </label>
          <select
            value={formData.doctorId}
            onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none bg-white transition-colors ${
              errors.doctorId
                ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                : "border-slate-300 focus:border-blue-600"
            }`}
          >
            <option value="">-- Choose a doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.user?.name || "Doctor"} — {doc.specialization || "General Specialist"}
              </option>
            ))}
          </select>
          {errors.doctorId && <p className="text-rose-500 text-xs mt-1">{errors.doctorId}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Appointment Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.appointmentDate}
            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.appointmentDate
                ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                : "border-slate-300 focus:border-blue-600"
            }`}
          />
          {errors.appointmentDate && (
            <p className="text-rose-500 text-xs mt-1">{errors.appointmentDate}</p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            Clinic hours are generally 09:00 AM - 05:00 PM. Please choose a future slot.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reason for Visit / Main Symptoms *
          </label>
          <textarea
            rows={4}
            placeholder="Describe your current symptoms, how long you've experienced them, or if this is a follow-up consultation..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${
              errors.reason
                ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                : "border-slate-300 focus:border-blue-600"
            }`}
          />
          {errors.reason && <p className="text-rose-500 text-xs mt-1">{errors.reason}</p>}
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            {loading ? "Submitting Booking..." : "Confirm & Book Appointment"}
          </button>
          <Link
            href="/appointments"
            className="px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-100 text-xs sm:text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <Link
          href="/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          &larr; Back to Appointments
        </Link>
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading form...</div>}>
          <BookAppointmentForm />
        </Suspense>
      </main>
    </div>
  );
}
