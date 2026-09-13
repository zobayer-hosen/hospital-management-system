import Link from "next/link";

export interface Appointment {
  id: string;
  appointmentDate: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | string;
  reason?: string;
  doctor?: {
    id: string;
    specialization?: string;
    user?: {
      name?: string;
      email?: string;
    };
  };
}

const statusBadges: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-amber-50 border-amber-200 text-amber-800", text: "text-amber-800", label: "Pending" },
  confirmed: { bg: "bg-blue-50 border-blue-200 text-blue-800", text: "text-blue-800", label: "Confirmed" },
  completed: { bg: "bg-emerald-50 border-emerald-200 text-emerald-800", text: "text-emerald-800", label: "Completed" },
  cancelled: { bg: "bg-rose-50 border-rose-200 text-rose-800", text: "text-rose-800", label: "Cancelled" },
};

export default function AppointmentCard({
  appointment,
  onCancel,
}: {
  appointment: Appointment;
  onCancel?: (id: string) => void;
}) {
  const doctorName = appointment.doctor?.user?.name || "Assigned Doctor";
  const badge = statusBadges[appointment.status.toLowerCase()] || {
    bg: "bg-slate-100 border-slate-200 text-slate-700",
    text: "text-slate-700",
    label: appointment.status,
  };

  const formattedDate = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Date not set";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
            {badge.label}
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-2">{doctorName}</h4>
          <p className="text-xs text-slate-500">{appointment.doctor?.specialization || "General Specialist"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-800">{formattedDate}</p>
          <span className="text-[11px] text-slate-400">Scheduled Visit</span>
        </div>
      </div>

      {appointment.reason && (
        <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700">Reason: </span>
          {appointment.reason}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <Link
          href={`/appointments/${appointment.id}`}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
        >
          View Details &rarr;
        </Link>

        {appointment.status.toLowerCase() !== "cancelled" &&
          appointment.status.toLowerCase() !== "completed" && (
            <div className="flex items-center gap-2">
              <Link
                href={`/appointments/${appointment.id}`}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
              >
                Reschedule
              </Link>
              {onCancel && (
                <button
                  onClick={() => onCancel(appointment.id)}
                  className="text-xs font-medium text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-50"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
