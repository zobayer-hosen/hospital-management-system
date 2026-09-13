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
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          CarePoint Hospital Management System
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
          Your Health Care, Simplified & Accessible in{" "}
          <span className="text-blue-600">One Portal</span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
          Book appointments with specialist doctors, track consultation status,
          and securely view your digital prescriptions and clinical test records.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
            >
              Go to Patient Dashboard &rarr;
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm"
              >
                Sign In to Portal
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-2.5 rounded bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm border border-gray-300"
              >
                Register as New Patient
              </Link>
            </>
          )}
          <Link
            href="/doctors"
            className="w-full sm:w-auto px-6 py-2.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm border border-gray-200"
          >
            Browse Doctors &rarr;
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 text-left">
          <div className="bg-white p-5 rounded border border-gray-200">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-700 flex items-center justify-center text-xl mb-3">
              👨‍⚕️
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Find Specialists</h3>
            <p className="text-xs text-gray-600">
              Explore verified doctors across Cardiology, Neurology, Pediatrics, and more with qualifications and schedules.
            </p>
          </div>

          <div className="bg-white p-5 rounded border border-gray-200">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-700 flex items-center justify-center text-xl mb-3">
              🗓️
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Easy Booking</h3>
            <p className="text-xs text-gray-600">
              Schedule your visit easily. Track whether your appointment is Pending, Confirmed, or Completed.
            </p>
          </div>

          <div className="bg-white p-5 rounded border border-gray-200">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-700 flex items-center justify-center text-xl mb-3">
              📑
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Digital Health Records</h3>
            <p className="text-xs text-gray-600">
              View diagnoses, medical prescriptions, and clinical lab test reports from your doctor visits.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
