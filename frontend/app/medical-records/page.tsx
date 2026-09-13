"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
import MedicalRecordCard, { MedicalRecord } from "@/components/MedicalRecordCard";

export default function MedicalRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/patient/medical-records")
      .then((res) => {
        setRecords(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to load records:", err);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const filteredRecords = records.filter((rec) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    const diagMatch = rec.diagnosis && rec.diagnosis.toLowerCase().includes(s);
    const docMatch =
      rec.doctor?.user?.name && rec.doctor.user.name.toLowerCase().includes(s);
    const specMatch =
      rec.doctor?.specialization && rec.doctor.specialization.toLowerCase().includes(s);
    return diagMatch || docMatch || specMatch;
  });

  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medical Records & Prescriptions</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your consultation clinical diagnoses, prescribed medications, and lab reports
          </p>
        </div>

        {/* Search filter */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <span className="text-slate-400 pl-2 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search by diagnosis (e.g. Bronchitis) or doctor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs sm:text-sm focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-slate-400 hover:text-slate-600 pr-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Grid or Empty */}
        {loading ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
            Loading your medical records...
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRecords.map((record) => (
              <MedicalRecordCard key={record.id} record={record} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-2">
            <p className="text-base font-bold text-slate-800">No medical records found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {search
                ? "No clinical records matched your search query."
                : "Your official doctor prescriptions and diagnostic findings will appear here following completed hospital appointments."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
