"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Doctor } from "@/components/DoctorCard";

export default function DoctorDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchDoctor() {
      try {
        const endpoint =
          process.env.NEXT_PUBLIC_API_ENDPOINT ||
          process.env.NEXT_PUBLIC_API_URL ||
          "http://localhost:3000";

        const response = await axios.get(`${endpoint}/patient/doctors/${id}`);
        setDoctor(response.data);
      } catch (err: any) {
        console.error("Failed to load doctor:", err);
        setError("Doctor not found or server unavailable.");
      } finally {
        setLoading(false);
      }
    }

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-xs text-gray-400">
        Loading doctor profile...
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-3">
        <p className="text-sm font-bold text-gray-700">{error || "Doctor not found"}</p>
        <Link href="/doctors" className="text-xs text-blue-600 underline">
          &larr; Back to all doctors
        </Link>
      </div>
    );
  }

  const doctorName = doctor.user?.name || "Dr. Specialist";
  const departmentName =
    typeof doctor.department === "string"
      ? doctor.department
      : doctor.department?.name || "General Medicine";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
      <Link
        href="/doctors"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
      >
        &larr; Back to all doctors
      </Link>

      <div className="bg-white rounded border border-gray-200 p-6 sm:p-8 space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-gray-200">
          <div className="w-16 h-16 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shrink-0">
            {doctorName.replace("Dr. ", "").charAt(0)}
          </div>
          <div className="flex-1">
            <span className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 mb-1">
              {doctor.specialization || "Physician"}
            </span>
            <h1 className="text-2xl font-bold text-gray-900">{doctorName}</h1>
            <p className="text-sm text-gray-500 mt-1">Department: {departmentName}</p>
          </div>
          <Link
            href={`/appointments/book?doctorId=${doctor.id}`}
            className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded"
          >
            Book Appointment
          </Link>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Professional Credentials
            </h3>
            <div className="p-4 rounded bg-gray-50 border border-gray-200 space-y-2 text-xs text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Degrees & Qualifications: </span>
                {doctor.qualification || "MBBS"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Department: </span>
                {departmentName}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Contact & Hospital Consultation
            </h3>
            <div className="p-4 rounded bg-gray-50 border border-gray-200 space-y-2 text-xs text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Hospital Email: </span>
                {doctor.user?.email || "doctor@hospital.com"}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Consultation Days: </span>
                Sunday – Thursday (09:00 AM – 04:00 PM)
              </p>
              <p>
                <span className="font-semibold text-gray-900">Room / Chamber: </span>
                Block B, 3rd Floor (Room #304)
              </p>
            </div>
          </div>
        </div>

        {/* Booking Banner */}
        <div className="p-4 rounded bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-blue-900">Schedule a visit with {doctorName}</h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Select your preferred date and explain any symptoms in advance.
            </p>
          </div>
          <Link
            href={`/appointments/book?doctorId=${doctor.id}`}
            className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm rounded shrink-0"
          >
            Select Date & Time &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
