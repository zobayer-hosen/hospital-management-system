import Link from "next/link";

export interface Doctor {
  id: string;
  specialization?: string;
  qualification?: string;
  experience?: string | number;
  department?: any;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const doctorName = doctor.user?.name || "Dr. Specialist";
  const departmentName =
    typeof doctor.department === "string"
      ? doctor.department
      : doctor.department?.name || "General Medicine";

  return (
    <div className="bg-white rounded border border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {doctorName.replace("Dr. ", "").charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">{doctorName}</h3>
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
              {doctor.specialization || "Physician"}
            </span>
            <p className="text-xs text-gray-500 mt-1">Department: {departmentName}</p>
          </div>
        </div>

        {doctor.qualification && (
          <p className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
            🎓 {doctor.qualification}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center gap-2">
        <Link
          href={`/doctors/${doctor.id}`}
          className="flex-1 text-center py-2 px-3 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
        >
          View Profile
        </Link>
        <Link
          href={`/appointments/book?doctorId=${doctor.id}`}
          className="flex-1 text-center py-2 px-3 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
        >
          Book Visit
        </Link>
      </div>
    </div>
  );
}
