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

const statusBadges: Record<string, { bg: string; label: string }> = {
  pending: { bg: "bg-yellow-100 text-yellow-800", label: "Pending" },
  confirmed: { bg: "bg-blue-100 text-blue-800", label: "Confirmed" },
  completed: { bg: "bg-green-100 text-green-800", label: "Completed" },
  cancelled: { bg: "bg-red-100 text-red-800", label: "Cancelled" },
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
    bg: "bg-gray-100 text-gray-700",
    label: appointment.status,
  };

  const formattedDate = appointment.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Date not set";

  return (
    <div className="bg-white rounded border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${badge.bg}`}>
            {badge.label}
          </span>
          <h4 className="text-base font-bold text-gray-900 mt-2">{doctorName}</h4>
          <p className="text-xs text-gray-500">{appointment.doctor?.specialization || "General Specialist"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-800">{formattedDate}</p>
          <span className="text-xs text-gray-400">Scheduled Visit</span>
        </div>
      </div>

      {appointment.reason && (
        <div className="mt-3 text-xs text-gray-700 bg-gray-50 p-2 rounded">
          <span className="font-semibold text-gray-800">Reason: </span>
          {appointment.reason}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between gap-2">
        <Link
          href={`/appointments/${appointment.id}`}
          className="text-xs font-medium text-blue-600 hover:text-blue-800"
        >
          View Details &rarr;
        </Link>

        {appointment.status.toLowerCase() !== "cancelled" &&
          appointment.status.toLowerCase() !== "completed" && (
            <div className="flex items-center gap-2">
              <Link
                href={`/appointments/${appointment.id}`}
                className="text-xs font-medium text-gray-700 hover:text-gray-900 px-2.5 py-1 rounded border border-gray-300 hover:bg-gray-50"
              >
                Reschedule
              </Link>
              {onCancel && (
                <button
                  onClick={() => onCancel(appointment.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 px-2.5 py-1 rounded border border-red-200 hover:bg-red-50"
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
