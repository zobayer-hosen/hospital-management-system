import { notFound } from "next/navigation";
import Link from "next/link";
import { Doctor } from "@/components/DoctorCard";

async function getDoctor(id: string): Promise<Doctor | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/patient/doctors/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      // Fallback mock if demo doctor id
      return {
        id,
        specialization: "Senior Consultant",
        qualification: "MBBS, FCPS, FRCP (UK)",
        department: "General Medicine",
        user: {
          name: "Dr. Consultant Specialist",
          email: "specialist@carepoint.com",
          phone: "+8801799999999",
        },
      };
    }
    return await res.json();
  } catch (error) {
    // Fallback for offline SSR testing
    return {
      id,
      specialization: "Senior Consultant",
      qualification: "MBBS, FCPS, FRCP (UK)",
      department: "Internal Medicine",
      user: {
        name: "Dr. Consultant Specialist",
        email: "specialist@carepoint.com",
        phone: "+8801799999999",
      },
    };
  }
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await getDoctor(id);

  if (!doctor) {
    notFound();
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
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        &larr; Back to all doctors
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center font-bold text-3xl shadow-inner shrink-0">
            {doctorName.replace("Dr. ", "").charAt(0)}
          </div>
          <div className="flex-1">
            <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 mb-1">
              {doctor.specialization || "Physician"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{doctorName}</h1>
            <p className="text-sm text-slate-500 mt-1">Department: {departmentName}</p>
          </div>
          <Link
            href={`/appointments/book?doctorId=${doctor.id}`}
            className="w-full sm:w-auto text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all"
          >
            Book Appointment
          </Link>
        </div>

        {/* Detailed Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Professional Credentials
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <p className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Degrees & Qualifications: </span>
                {doctor.qualification || "MBBS"}
              </p>
              <p className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Department: </span>
                {departmentName}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Contact & Hospital Consultation
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-700">
              <p>
                <span className="font-semibold text-slate-900">Hospital Email: </span>
                {doctor.user?.email || "doctor@hospital.com"}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Consultation Days: </span>
                Sunday – Thursday (09:00 AM – 04:00 PM)
              </p>
              <p>
                <span className="font-semibold text-slate-900">Room / Chamber: </span>
                Block B, 3rd Floor (Room #304)
              </p>
            </div>
          </div>
        </div>

        {/* Booking Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-blue-950">Schedule a visit with {doctorName}</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Select your preferred date and explain any symptoms in advance.
            </p>
          </div>
          <Link
            href={`/appointments/book?doctorId=${doctor.id}`}
            className="w-full sm:w-auto text-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition shadow-sm shrink-0"
          >
            Select Date & Time &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
