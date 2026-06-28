"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMenu, useLogo, useProgrammesNav } from "@/hooks/use-api";
import { HiMenu, HiX, HiChevronDown, HiChevronRight } from "react-icons/hi";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// ---------------------------------------------------------------------------
// Default navigation (hardcoded fallback – can be overridden via props later)
// ---------------------------------------------------------------------------
const defaultNavLinks: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  {
    href: "/programmes",
    label: "Our Programmes",
    children: [
      { label: "Health", href: "/programmes/health" },
      { label: "Nutrition", href: "/programmes/nutrition" },
      { label: "Education", href: "/programmes/education" },
      { label: "WaSH", href: "/programmes/wash" },
      { label: "Food Security & Livelihood", href: "/programmes/food-security-and-livelihood" },
      { label: "DRR", href: "/programmes/drr" },
      { label: "Climate Change", href: "/programmes/climate-change" },
      { label: "Protection", href: "/programmes/protection" },
      { label: "Agriculture", href: "/programmes/agriculture" },
    ],
  },
  { href: "/news", label: "News & Stories" },
  { href: "/resources", label: "Resources" },
  { href: "/gallery", label: "Gallery" },
  { href: "/get-involved", label: "Get Involved" },
  { href: "/contact", label: "Contact" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface NavbarProps {
  navLinks?: NavItem[];
}

const Navbar = ({ navLinks }: NavbarProps) => {
  const { data: menuData, isLoading: menuLoading } = useMenu();
  const { data: logo, isLoading: logoLoading } = useLogo();
  const { data: progNav } = useProgrammesNav();

  // Merge live programmes + sub-programmes into the "Our Programmes" item so the
  // navbar always reflects what admins create (3rd-level flyout, auto-generated).
  const menuItems: NavItem[] = useMemo(() => {
    const base: NavItem[] = menuData ?? navLinks ?? defaultNavLinks;
    if (!progNav || progNav.length === 0) return base;
    return base.map((item) =>
      item.href === "/programmes"
        ? {
            ...item,
            children: progNav.map((p) => ({
              label: p.name,
              href: `/programmes/${p.slug}`,
              children: (p.subProgrammes ?? []).map((s) => ({
                label: s.name,
                href: `/programmes/${p.slug}/${s.slug}`,
              })),
            })),
          }
        : item
    );
  }, [menuData, navLinks, progNav]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [mobileSubExpanded, setMobileSubExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  // Ref for close‑delay so the dropdown stays open while moving to it
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---- scroll shadow ----
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setMobileExpanded(null);
    setMobileSubExpanded(null);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // ---- Desktop dropdown helpers ----
  const openDropdown = (key: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setDesktopDropdown(key);
  };

  const scheduleClose = () => {
    closeTimeout.current = setTimeout(() => {
      setDesktopDropdown(null);
    }, 120);
  };

  // ---- Mobile accordion toggles ----
  const toggleMobileExpanded = (key: string) =>
    setMobileExpanded((prev) => (prev === key ? null : key));
  const toggleMobileSubExpanded = (key: string) =>
    setMobileSubExpanded((prev) => (prev === key ? null : key));

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-brand to-brand-accent" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        {logoLoading ? (
          <div className="flex items-center" aria-hidden="true">
            <div className="h-12 w-40 animate-pulse rounded-md bg-gray-200 lg:h-14 lg:w-48" />
          </div>
        ) : (
          <Link href="/" className="flex items-center">
            {logo ? (
              <Image
                src={logo}
                alt="AROHI"
                width={200}
                height={56}
                priority
                className="h-12 w-auto object-contain lg:h-14"
              />
            ) : (
              <span className="flex flex-col leading-tight">
                <span className="font-heading text-2xl font-bold tracking-tight text-brand lg:text-3xl">
                  AROHI
                </span>
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-gray-500">
                  Rural Opportunities &amp; Human Initiatives
                </span>
              </span>
            )}
          </Link>
        )}

        {/* ==================== Desktop links ==================== */}
        {menuLoading && !navLinks ? (
          <div className="hidden lg:flex items-center gap-3">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
        ) : (
          <ul className="hidden items-center gap-1 lg:flex">
            {menuItems.map((item: NavItem) => {
              const hasChildren = item.children && item.children.length > 0;

              if (!hasChildren) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`font-body relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href) ? "text-brand" : "text-gray-600 hover:text-brand"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-brand-accent transition-all duration-300 ${
                          isActive(item.href) ? "w-4/5" : "w-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              }

              // ---- Item with dropdown ----
              return (
                <li key={item.href} className="relative">
                  <div
                    onMouseEnter={() => openDropdown(item.href)}
                    onMouseLeave={scheduleClose}
                  >
                    <Link
                      href={item.href}
                      className={`font-body relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive(item.href) ? "text-brand" : "text-gray-600 hover:text-brand"
                      }`}
                    >
                      {item.label}
                      <HiChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          desktopDropdown === item.href ? "rotate-180" : ""
                        }`}
                      />
                      <span
                        className={`absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-brand-accent transition-all duration-300 ${
                          isActive(item.href) ? "w-4/5" : "w-0"
                        }`}
                      />
                    </Link>

                    {/* Dropdown panel (overflow-visible so 3rd-level flyout can escape) */}
                    <div
                      className={`absolute left-0 top-full z-50 min-w-[220px] rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200 ${
                        desktopDropdown === item.href
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0"
                      }`}
                    >
                      <ul className="py-1">
                        {item.children!.map((child) => {
                          const hasGrandchildren = child.children && child.children.length > 0;
                          if (!hasGrandchildren) {
                            return (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className={`block px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                                    isActive(child.href)
                                      ? "bg-gray-50 text-brand"
                                      : "text-gray-700 hover:bg-gray-50 hover:text-brand"
                                  }`}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            );
                          }
                          // ---- Child with 3rd-level flyout (sub-programmes) ----
                          return (
                            <li key={child.href} className="group/sub relative">
                              <Link
                                href={child.href}
                                className={`flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                                  isActive(child.href)
                                    ? "bg-gray-50 text-brand"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-brand"
                                }`}
                              >
                                {child.label}
                                <HiChevronRight className="h-4 w-4 opacity-40 group-hover/sub:opacity-100" />
                              </Link>
                              {/* Nested flyout */}
                              <div className="invisible absolute left-full top-0 z-50 -ml-1 min-w-[210px] translate-x-1 rounded-lg border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover/sub:visible group-hover/sub:translate-x-0 group-hover/sub:opacity-100">
                                <ul className="py-1">
                                  {child.children!.map((gc) => (
                                    <li key={gc.href}>
                                      <Link
                                        href={gc.href}
                                        className={`block px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                                          isActive(gc.href)
                                            ? "bg-gray-50 text-brand"
                                            : "text-gray-700 hover:bg-gray-50 hover:text-brand"
                                        }`}
                                      >
                                        {gc.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Right side: CTA + hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/get-involved#donate"
            className="font-body hidden rounded-full bg-brand-accent px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-accent/90 hover:shadow-md sm:inline-block"
          >
            Donate Now
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-md p-2 text-brand transition-colors duration-200 hover:bg-gray-100 lg:hidden"
          >
            {mobileOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </nav>

      {/* ==================== Mobile menu ==================== */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden lg:hidden">
        <div
          className={`absolute inset-0 top-[calc(3.5rem+4px)] bg-black/40 transition-opacity duration-300 ${
            mobileOpen ? "pointer-events-auto opacity-100" : "opacity-0"
          }`}
          onClick={() => setMobileOpen(false)}
        />

        <div
          className={`absolute bottom-0 right-0 top-[calc(3.5rem+4px)] w-72 overflow-y-auto bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            mobileOpen ? "pointer-events-auto translate-x-0" : "translate-x-full"
          }`}
        >
          <ul className="flex flex-col gap-1 px-4 py-6">
            {menuItems.map((item: NavItem) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = mobileExpanded === item.href;

              if (!hasChildren) {
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`font-body block rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? "bg-brand/5 text-brand"
                          : "text-gray-700 hover:bg-gray-50 hover:text-brand"
                      }`}
                    >
                      {isActive(item.href) && (
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-accent" />
                      )}
                      {item.label}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => toggleMobileExpanded(item.href)}
                    className={`font-body flex w-full items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? "bg-brand/5 text-brand"
                        : "text-gray-700 hover:bg-gray-50 hover:text-brand"
                    }`}
                  >
                    <span className="flex items-center">
                      {isActive(item.href) && (
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand-accent" />
                      )}
                      {item.label}
                    </span>
                    <HiChevronDown
                      className={`h-5 w-5 shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Children (accordion) */}
                  {isExpanded && (
                    <ul className="pb-1">
                      {item.children!.map((child) => {
                        const hasGrandchildren = child.children && child.children.length > 0;
                        const subExpanded = mobileSubExpanded === child.href;
                        if (!hasGrandchildren) {
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block rounded-md py-2 pl-8 pr-4 text-sm font-medium transition-colors duration-200 ${
                                  isActive(child.href)
                                    ? "text-brand"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-brand"
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        }
                        return (
                          <li key={child.href}>
                            <div className="flex items-center">
                              <Link
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                                className={`flex-1 rounded-md py-2 pl-8 pr-2 text-sm font-medium transition-colors duration-200 ${
                                  isActive(child.href)
                                    ? "text-brand"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-brand"
                                }`}
                              >
                                {child.label}
                              </Link>
                              <button
                                type="button"
                                aria-label="Toggle sub-programmes"
                                onClick={() => toggleMobileSubExpanded(child.href)}
                                className="rounded-md p-2 text-gray-400 hover:text-brand"
                              >
                                <HiChevronDown
                                  className={`h-4 w-4 transition-transform duration-200 ${
                                    subExpanded ? "rotate-180" : ""
                                  }`}
                                />
                              </button>
                            </div>
                            {subExpanded && (
                              <ul className="pb-1">
                                {child.children!.map((gc) => (
                                  <li key={gc.href}>
                                    <Link
                                      href={gc.href}
                                      onClick={() => setMobileOpen(false)}
                                      className={`block rounded-md py-2 pl-12 pr-4 text-sm transition-colors duration-200 ${
                                        isActive(gc.href)
                                          ? "text-brand"
                                          : "text-gray-500 hover:bg-gray-50 hover:text-brand"
                                      }`}
                                    >
                                      {gc.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}

            <li className="mt-4 px-4">
              <Link
                href="/get-involved#donate"
                onClick={() => setMobileOpen(false)}
                className="font-body block w-full rounded-full bg-brand-accent py-3 text-center text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-brand-accent/90 hover:shadow-md"
              >
                Donate Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
