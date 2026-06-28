"use client";

import Link from "next/link";
import { HiViewGrid } from "react-icons/hi";

export interface SubProgrammePill {
  name: string;
  slug: string;
}

/**
 * Horizontal row of pills linking to the sub-programmes of a programme.
 * The "Overview" pill links back to the parent programme page; the active
 * sub-programme (if any) is highlighted.
 */
export default function SubProgrammePills({
  parentSlug,
  items,
  activeSlug,
}: {
  parentSlug: string;
  items: SubProgrammePill[];
  activeSlug?: string;
}) {
  if (!items || items.length === 0) return null;

  const base =
    "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200";

  return (
    <section className="border-b border-gray-100 bg-white">
      <div className="container-custom">
        <div className="flex items-center gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href={`/programmes/${parentSlug}`}
            className={`${base} ${
              !activeSlug
                ? "border-transparent bg-brand text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-brand/40 hover:text-brand"
            }`}
          >
            <HiViewGrid className="h-4 w-4" />
            Overview
          </Link>

          {items.map((item) => {
            const isActive = item.slug === activeSlug;
            return (
              <Link
                key={item.slug}
                href={`/programmes/${parentSlug}/${item.slug}`}
                className={`${base} whitespace-nowrap ${
                  isActive
                    ? "border-transparent bg-gradient-to-r from-brand to-brand-accent text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-brand-accent/50 hover:text-brand"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
