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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-inner">
            {doctorName.replace("Dr. ", "").charAt(0)}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1">{doctorName}</h3>
            <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              {doctor.specialization || "Physician"}
            </span>
            <p className="text-xs text-slate-500 mt-1">Department: {departmentName}</p>
          </div>
        </div>

        {doctor.qualification && (
          <p className="mt-3 text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
            🎓 {doctor.qualification}
          </p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
        <Link
          href={`/doctors/${doctor.id}`}
          className="flex-1 text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          View Profile
        </Link>
        <Link
          href={`/appointments/book?doctorId=${doctor.id}`}
          className="flex-1 text-center py-2 px-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
        >
          Book Visit
        </Link>
      </div>
    </div>
  );
}
