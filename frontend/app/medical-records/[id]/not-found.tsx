import Link from "next/link";

export default function MedicalRecordNotFound() {
  return (
    <div className="max-w-xl mx-auto my-16 p-6 sm:p-8 bg-white rounded border border-gray-200 text-center space-y-4">
      <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-xl">
        📋
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Medical Record Not Found</h2>
      <p className="text-xs text-gray-500 max-w-sm mx-auto">
        The requested medical record or prescription document could not be located.
      </p>
      <div className="pt-2">
        <Link
          href="/medical-records"
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded"
        >
          &larr; Back to Medical Records
        </Link>
      </div>
    </div>
  );
}
