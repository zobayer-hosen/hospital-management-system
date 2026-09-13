"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: "📊" },
  { name: "Doctors", href: "/doctors", icon: "👨‍⚕️" },
  { name: "My Appointments", href: "/appointments", icon: "🗓️" },
  { name: "Book Appointment", href: "/appointments/book", icon: "➕" },
  { name: "Medical Records", href: "/medical-records", icon: "📋" },
  { name: "My Profile", href: "/profile", icon: "👤" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block shrink-0 min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-1">
        <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Patient Portal
        </p>
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-3 rounded bg-gray-50 border border-gray-200">
        <p className="text-xs font-bold text-gray-800 mb-1">Hospital Hotline</p>
        <p className="text-xs text-gray-600 mb-2">24/7 Emergency Support</p>
        <p className="text-sm font-bold text-blue-600">📞 +880 9612-000000</p>
      </div>
    </aside>
  );
}
