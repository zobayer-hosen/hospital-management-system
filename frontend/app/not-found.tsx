import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-6 sm:p-8 rounded border border-gray-200">
        <div className="w-12 h-12 mx-auto rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
          404
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
        <p className="text-xs text-gray-500">
          The page you are looking for does not exist or has been moved within the CarePoint Patient Portal.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded"
          >
            Return to Home
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
