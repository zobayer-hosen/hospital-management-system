import Sidebar from "@/components/Sidebar";

export default function AppointmentsLoading() {
  return (
    <div className="flex-1 flex max-w-7xl w-full mx-auto">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
              <div className="h-4 w-20 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
              <div className="h-10 bg-slate-50 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
