"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { driver, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!driver || !driver.is_admin)) {
      router.push("/");
    }
  }, [driver, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!driver || !driver.is_admin) {
    return null;
  }

  const adminNavItems = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/users", label: "User Management" },
    { href: "/admin/logs", label: "System Logs" },
    { href: "/admin/server-control", label: "Server Control" },
  ];

  return (
    <div className="min-h-screen bg-gray-1 dark:bg-gray-dark">
      <div className="border-b border-stroke bg-white px-6 py-4 dark:border-dark-3 dark:bg-gray-dark">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-dark dark:text-white">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-6">
              ACC Server Manager Administration
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="flex">
        <nav className="w-64 bg-white shadow-sm dark:bg-gray-dark">
          <div className="p-4">
            <ul className="space-y-2">
              {adminNavItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-white"
                          : "text-gray-6 hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}