"use client";

import { useEffect, useState, Suspense, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import api from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
import { Doctor } from "@/components/DoctorCard";

// Zod schema for appointment booking
const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Please choose a medical specialist"),
  appointmentDate: z.string().min(1, "Please select an appointment date and time"),
  reason: z.string().min(1, "Please describe your symptoms").min(5, "Reason must be at least 5 characters"),
});

type BookAppointmentData = z.infer<typeof bookAppointmentSchema>;

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

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Axios GET request to fetch available doctors
    api
      .get("/patient/doctors")
      .then((res) => {
        const docList = Array.isArray(res.data) ? res.data : [];
        setDoctors(docList);
        if (preselectedDoctorId && !formData.doctorId) {
          setFormData((prev) => ({ ...prev, doctorId: preselectedDoctorId }));
        }
      })
      .catch((err) => {
        console.error("Failed to load doctors:", err);
      });
  }, [router, preselectedDoctorId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    // Zod validation
    const result = bookAppointmentSchema.safeParse(formData);

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    // Validate date is in future
    const selected = new Date(formData.appointmentDate);
    if (isNaN(selected.getTime()) || selected <= new Date()) {
      setError("Appointment date and time must be in the future");
      return;
    }

    setLoading(true);
    try {
      // Axios POST request
      await api.post("/patient/appointments", {
        doctorId: formData.doctorId,
        appointmentDate: selected.toISOString(),
        reason: formData.reason.trim(),
      });

      router.push("/appointments");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Failed to schedule appointment. Please try another time.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
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

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
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
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="">-- Choose a doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.user?.name || "Doctor"} — {doc.specialization || "General Specialist"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Appointment Date & Time *
          </label>
          <input
            type="datetime-local"
            value={formData.appointmentDate}
            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Clinic hours are 09:00 AM - 05:00 PM. Please select a future date.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reason for Visit / Main Symptoms *
          </label>
          <textarea
            rows={4}
            placeholder="Describe your current symptoms or concerns in detail..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-blue-600"
          />
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
