"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", labelBn: "হোম" },
    { href: "/resources", label: "Resources", labelBn: "রিসোর্স" },
    { href: "/resources/report", label: "Report", labelBn: "রিপোর্ট" },
    { href: "/admin", label: "Admin", labelBn: "অ্যাডমিন" },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">
                Digital Seba
              </span>
              <span className="ml-2 text-sm text-slate-600">ডিজিটাল সেবা</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                  <span className="ml-1 text-xs opacity-70">
                    / {link.labelBn}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
