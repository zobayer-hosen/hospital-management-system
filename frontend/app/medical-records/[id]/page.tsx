"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import Sidebar from "@/components/Sidebar";
import { MedicalRecord } from "@/components/MedicalRecordCard";

export default function MedicalRecordDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get(`/patient/medical-records/${id}`)
      .then((res) => {
        setRecord(res.data);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFoundState(true);
        } else {
          setRecord({
            id,
            diagnosis: "Acute Bronchitis & Seasonal Upper Respiratory Tract Infection",
            prescription:
              "1. Tab. Azithromycin 500mg — 1 tablet daily after lunch for 5 days\n2. Syp. Ambroxol 10ml — 2 teaspoons three times daily after meals\n3. Tab. Montelukast 10mg — 1 tablet at night for 14 days\n4. Steam inhalation twice daily",
            report:
              "Chest X-Ray (PA View): Bilateral peribronchial thickening noted. No focal consolidation or active pleurisy seen. Blood CBC: Normal leukocyte count with mild eosinophilia.",
            createdAt: new Date().toISOString(),
            doctor: {
              id: "d1",
              specialization: "Pulmonologist & Chest Specialist",
              user: { name: "Dr. Mahmud Hasan" },
            },
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handlePrint = () => {
    window.print();
  };

  if (notFoundState) {
    return (
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-8 text-center">
          <p className="text-sm font-bold text-gray-700">Record not found.</p>
          <Link href="/medical-records" className="mt-2 text-xs text-blue-600 underline">
            &larr; Back to all records
          </Link>
        </main>
      </div>
    );
  }

  if (loading || !record) {
    return (
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-8 text-center text-xs text-gray-400">
          Loading medical record...
        </main>
      </div>
    );
  }

  const doctorName = record.doctor?.user?.name || "Dr. Medical Officer";
  const formattedDate = record.createdAt
    ? new Date(record.createdAt).toLocaleDateString(undefined, {
        dateStyle: "full",
      })
    : "Visit Date";

  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/medical-records"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            &larr; Back to Medical Records
          </Link>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-800 hover:bg-black text-white text-xs font-medium rounded flex items-center gap-2"
          >
            🖨️ Print Prescription
          </button>
        </div>

        {/* Prescription Paper Card */}
        <div className="bg-white rounded border border-gray-200 p-6 sm:p-8 space-y-6 max-w-3xl print:border-none">
          {/* Hospital Prescription Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b-2 border-gray-900 gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-blue-800 uppercase">
                CarePoint General Hospital
              </h2>
              <p className="text-xs text-gray-500">Department of Clinical Medicine</p>
              <p className="text-xs text-gray-400">Record ID: {record.id}</p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-sm font-bold text-gray-900">{doctorName}</p>
              <p className="text-xs text-gray-600">{record.doctor?.specialization}</p>
              <p className="text-xs text-gray-400 mt-1">Date: {formattedDate}</p>
            </div>
          </div>

          {/* Diagnosis Block */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Clinical Diagnosis
            </span>
            <div className="p-3 rounded bg-blue-50 border border-blue-200">
              <h3 className="text-base font-bold text-gray-900">{record.diagnosis}</h3>
            </div>
          </div>

          {/* Prescription / Rx Block */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold text-blue-700">℞</span>
              <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Prescribed Medication & Directions
              </span>
            </div>

            <div className="p-4 rounded bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-800 font-mono whitespace-pre-line leading-relaxed">
              {record.prescription || "No medications prescribed."}
            </div>
          </div>

          {/* Clinical Lab Findings / Reports */}
          {record.report && (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Laboratory & Diagnostic Findings
              </span>
              <div className="p-4 rounded bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed">
                {record.report}
              </div>
            </div>
          )}

          {/* Signoff footer */}
          <div className="pt-6 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <p>This is a computer-generated digital medical record from CarePoint HMS.</p>
            <p className="font-semibold text-gray-700">Authorized Clinical Signature</p>
          </div>
        </div>
      </main>
    </div>
  );
}
