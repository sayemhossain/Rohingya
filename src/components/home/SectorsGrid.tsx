import Link from "next/link";
import Image from "next/image";
import { isIconImage } from "@/lib/icons";
import {
  HiAcademicCap,
  HiHeart,
  HiHome,
  HiBeaker,
  HiShoppingCart,
  HiShieldCheck,
  HiBriefcase,
  HiCake,
  HiGlobeAlt,
  HiSparkles,
  HiExclamationCircle,
  HiArrowRight,
} from "react-icons/hi";
import type { IconType } from "react-icons";

interface SectorItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  iconImage?: string;
  showOnHomepage?: boolean;
}

// Custom icon names an admin may type
const iconMap: Record<string, IconType> = {
  HiAcademicCap,
  HiHeart,
  HiHome,
  HiBeaker,
  HiShoppingCart,
  HiShieldCheck,
  HiBriefcase,
  HiCake,
  HiGlobeAlt,
  HiSparkles,
  HiExclamationCircle,
};

// Fallback icons by known programme slug
const slugIconMap: Record<string, IconType> = {
  health: HiHeart,
  nutrition: HiCake,
  education: HiAcademicCap,
  wash: HiBeaker,
  "food-security-and-livelihood": HiShoppingCart,
  drr: HiExclamationCircle,
  "climate-change": HiGlobeAlt,
  protection: HiShieldCheck,
  agriculture: HiSparkles,
};

// Per-programme colour identity
const gradientMap: Record<string, string> = {
  health: "from-rose-500 to-pink-600",
  nutrition: "from-red-500 to-rose-500",
  education: "from-teal-500 to-emerald-600",
  wash: "from-sky-500 to-cyan-600",
  "food-security-and-livelihood": "from-green-500 to-lime-600",
  drr: "from-amber-500 to-orange-600",
  "climate-change": "from-yellow-500 to-amber-600",
  protection: "from-indigo-500 to-violet-600",
  agriculture: "from-lime-500 to-green-600",
};

export default function SectorsGrid({ sectors }: { sectors?: SectorItem[] }) {
  if (!sectors || sectors.length === 0) return null;
  // Defensive: only show programmes flagged for the homepage
  const items = sectors.filter((s) => s.showOnHomepage !== false);
  if (items.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="inline-block text-sm font-semibold uppercase tracking-wider text-brand-accent mb-3">
            What We Do
          </span>
          <h2 className="section-title">Our Programmes</h2>
          <p className="section-subtitle mx-auto">
            Comprehensive development support across key areas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((sector, index) => {
            const Icon =
              iconMap[sector.icon || ""] ||
              slugIconMap[sector.slug] ||
              HiBriefcase;
            const iconUrl =
              sector.iconImage || (isIconImage(sector.icon) ? sector.icon : "");
            const gradient =
              gradientMap[sector.slug] || "from-brand to-brand-accent";

            return (
              <Link
                key={sector._id}
                href={`/programmes/${sector.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.1)] ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_-18px_rgba(0,0,0,0.22)] hover:ring-transparent"
              >
                {/* Gradient wash that fades in on hover */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]`}
                />

                {/* Soft colour glow, top-right */}
                <div
                  className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-25`}
                />

                {/* Large faint index watermark */}
                <span className="pointer-events-none absolute right-5 top-3 font-heading text-6xl font-extrabold leading-none text-gray-100 transition-colors duration-300 group-hover:text-gray-200/70">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative flex flex-1 flex-col">
                  {/* Icon chip */}
                  <div
                    className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-lg ring-4 ring-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    {iconUrl ? (
                      <Image src={iconUrl} alt="" width={28} height={28} className="h-7 w-7 object-contain brightness-0 invert" />
                    ) : (
                      <Icon className="h-7 w-7" />
                    )}
                  </div>

                  <h3 className="mb-2 font-heading text-lg font-bold text-gray-900 transition-colors duration-300 group-hover:text-brand">
                    {sector.name}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
                    {sector.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-colors group-hover:text-brand-accent">
                    Learn More
                    <HiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
