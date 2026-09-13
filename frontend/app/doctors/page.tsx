"use client";

import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import Link from "next/link";
import DoctorCard, { Doctor } from "@/components/DoctorCard";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [department, setDepartment] = useState<string>("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function fetchDoctors(searchQuery = "", deptFilter = "") {
    setLoading(true);
    try {
      const endpoint =
        process.env.NEXT_PUBLIC_API_ENDPOINT ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:3000";

      let url = endpoint + "/patient/doctors";
      const params: string[] = [];
      if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
      if (deptFilter) params.push(`department=${encodeURIComponent(deptFilter)}`);
      if (params.length > 0) url += "?" + params.join("&");

      const response = await axios.get(url);
      const jsonData = response.data;
      setDoctors(Array.isArray(jsonData) ? jsonData : []);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchDoctors(search, department);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Hospital Medical Specialists</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse certified physicians, surgeons and consultants available for clinical appointments
          </p>
        </div>

        <Link
          href="/appointments/book"
          className="self-start sm:self-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          + Book an Appointment
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleFilter} className="flex-1 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by doctor name or specialization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-blue-600 bg-white"
          >
            <option value="">All Departments</option>
            <option value="cardiology">Cardiology</option>
            <option value="neurology">Neurology</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="orthopedics">Orthopedics</option>
            <option value="dermatology">Dermatology</option>
          </select>

          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-xs text-slate-400">
          Loading doctors directory...
        </div>
      ) : doctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-2">
          <p className="text-base font-bold text-slate-700">No doctors found</p>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or department filter.
          </p>
        </div>
      )}
    </div>
  );
}
