import Link from "next/link";

export interface MedicalRecord {
  id: string;
  diagnosis: string;
  prescription?: string;
  report?: string;
  createdAt: string;
  doctor?: {
    id: string;
    specialization?: string;
    user?: {
      name?: string;
    };
  };
}

export default function MedicalRecordCard({ record }: { record: MedicalRecord }) {
  const doctorName = record.doctor?.user?.name || "Dr. Medical Officer";
  const formattedDate = record.createdAt
    ? new Date(record.createdAt).toLocaleDateString(undefined, {
        dateStyle: "medium",
      })
    : "Recent";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 text-lg">📄</span>
            <div>
              <p className="text-xs text-slate-400 font-medium">{formattedDate}</p>
              <h4 className="text-base font-bold text-slate-900 mt-0.5">{record.diagnosis}</h4>
            </div>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {record.doctor?.specialization || "Clinical"}
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-700">Attending Physician: </span>
          {doctorName}
        </p>

        {record.prescription && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
            <p className="font-semibold text-slate-800 mb-1">Prescription Summary:</p>
            <p className="line-clamp-2 whitespace-pre-line text-slate-600 font-mono text-[11px]">
              {record.prescription}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400">Verified Record</span>
        <Link
          href={`/medical-records/${record.id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          View Full Report &rarr;
        </Link>
      </div>
    </div>
  );
}
