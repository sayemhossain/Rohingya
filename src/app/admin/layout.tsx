"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  HiHome,
  HiNewspaper,
  HiViewGrid,
  HiDocument,
  HiPhotograph,
  HiUserGroup,
  HiMail,
  HiCog,
  HiUsers,
  HiLogout,
  HiMenuAlt2,
  HiX,
  HiInformationCircle,
} from "react-icons/hi";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  superadminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: HiHome },
  { label: "About Page", href: "/admin/about", icon: HiInformationCircle },
  { label: "News", href: "/admin/news", icon: HiNewspaper },
  { label: "Sectors", href: "/admin/sectors", icon: HiViewGrid },
  { label: "Resources", href: "/admin/resources", icon: HiDocument },
  { label: "Gallery", href: "/admin/gallery", icon: HiPhotograph },
  { label: "Team", href: "/admin/team", icon: HiUserGroup },
  { label: "Messages", href: "/admin/messages", icon: HiMail },
  { label: "Settings", href: "/admin/settings", icon: HiCog },
  { label: "Users", href: "/admin/users", icon: HiUsers, superadminOnly: true },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [status, isLoginPage, router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Login page: render without admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-sm text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  const userRole = (session?.user as { role?: string })?.role ?? "admin";
  const userName = session?.user?.name ?? "Admin";

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col bg-gray-900 text-white transition-transform duration-300 overflow-y-auto dark-scrollbar lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand gradient bar */}
        <div className="h-1 w-full bg-gradient-to-r from-brand to-brand-accent" />

        {/* Logo / title */}
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-brand-accent font-heading text-sm font-bold text-white">
              A
            </div>
            <span className="font-heading text-lg font-semibold tracking-tight">
              Admin Panel
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded p-1 text-gray-400 hover:text-white lg:hidden"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>

        {/* User info */}
        <div className="border-b border-t border-gray-700 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent text-sm font-bold text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{userName}</p>
              <span
                className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  userRole === "superadmin"
                    ? "bg-brand-accent/20 text-brand-accent"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {userRole}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems
              .filter(
                (item) => !item.superadminOnly || userRole === "superadmin"
              )
              .map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        {/* Sign out */}
        <div className="border-t border-gray-700 p-3">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
          >
            <HiLogout className="h-5 w-5 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          <HiMenuAlt2 className="h-6 w-6" />
        </button>
        <span className="font-heading text-sm font-semibold text-gray-800">
          Admin Panel
        </span>
      </div>

      {/* Main content */}
      <main className="min-h-screen bg-gray-50 p-8 lg:ml-64">{children}</main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
