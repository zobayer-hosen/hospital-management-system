import DoctorCard, { Doctor } from "@/components/DoctorCard";
import Link from "next/link";

async function getDoctors(): Promise<Doctor[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/patient/doctors`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // Graceful fallback for SSR when backend is offline
    return [
      {
        id: "d1",
        specialization: "Cardiologist",
        qualification: "MBBS, FCPS (Cardiology)",
        department: "Cardiology",
        user: { name: "Dr. Mahmud Hasan", email: "dr.mahmud@hospital.com", phone: "+8801711111111" },
      },
      {
        id: "d2",
        specialization: "Neurologist",
        qualification: "MBBS, MD (Neurology)",
        department: "Neurology",
        user: { name: "Dr. Farzana Rahman", email: "dr.farzana@hospital.com", phone: "+8801722222222" },
      },
      {
        id: "d3",
        specialization: "Pediatrician",
        qualification: "MBBS, DCH, MRCPCH",
        department: "Pediatrics",
        user: { name: "Dr. Tariqul Islam", email: "dr.tariqul@hospital.com", phone: "+8801733333333" },
      },
    ];
  }
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams?: Promise<{ department?: string; search?: string }>;
}) {
  const resolvedParams = searchParams ? await searchParams : {};
  const allDoctors = await getDoctors();

  const searchQuery = resolvedParams.search?.toLowerCase() || "";
  const selectedDept = resolvedParams.department?.toLowerCase() || "";

  const doctors = allDoctors.filter((doc) => {
    const nameMatch = !searchQuery || (doc.user?.name && doc.user.name.toLowerCase().includes(searchQuery));
    const specMatch = !searchQuery || (doc.specialization && doc.specialization.toLowerCase().includes(searchQuery));
    const deptName = typeof doc.department === "string" ? doc.department : doc.department?.name || "";
    const deptMatch = !selectedDept || deptName.toLowerCase().includes(selectedDept);

    return (nameMatch || specMatch) && deptMatch;
  });

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
        <form method="GET" className="flex-1 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="search"
            defaultValue={resolvedParams.search || ""}
            placeholder="Search by doctor name or specialization (e.g. Cardiologist)..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
          />

          <select
            name="department"
            defaultValue={resolvedParams.department || ""}
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
      {doctors.length > 0 ? (
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
