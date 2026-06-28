"use client";

import { useSectorsList } from "@/hooks/use-api";
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

export default function ProgrammesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sectors = [], isLoading } = useSectorsList() as { data: Record<string, any>[]; isLoading: boolean };

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand to-brand-light py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10" />
        <div className="container-custom relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">Our Programmes</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our Programmes
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            Comprehensive development support across nine critical areas,
            working together to empower and uplift disadvantaged communities
            in Barisal Division.
          </p>
        </div>
      </section>

      {/* Programmes Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="section-title">Explore Our Work</h2>
            <p className="section-subtitle mx-auto">
              Each programme addresses a vital aspect of community development,
              delivering targeted programs to meet the diverse needs of
              disadvantaged communities across Barisal Division.
            </p>
          </div>

          {sectors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Programme information is being updated. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sectors.map((sector, index) => {
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
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <h2 className="section-title">Want to Make a Difference?</h2>
          <p className="section-subtitle mx-auto mb-8">
            Your support can help transform the lives of disadvantaged communities.
            Whether through donations, volunteering, or partnership, every
            contribution matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-involved" className="btn-primary">
              Get Involved
            </Link>
            <Link href="/contact" className="btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
