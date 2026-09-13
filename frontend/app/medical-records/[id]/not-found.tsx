import Link from "next/link";

export default function MedicalRecordNotFound() {
  return (
    <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-2xl">
        📋
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Medical Record Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">
        The requested medical record or prescription document could not be located.
      </p>
      <div className="pt-2">
        <Link
          href="/medical-records"
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
        >
          &larr; Back to Medical Records
        </Link>
      </div>
    </div>
  );
}
