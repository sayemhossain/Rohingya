"use client";

import { useSectorsList } from "@/hooks/use-api";
import Link from "next/link";
import {
  HiAcademicCap,
  HiHeart,
  HiHome,
  HiBeaker,
  HiShoppingCart,
  HiShieldCheck,
  HiBriefcase,
  HiCake,
  HiArrowRight,
} from "react-icons/hi";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  HiAcademicCap,
  HiHeart,
  HiHome,
  HiBeaker,
  HiShoppingCart,
  HiShieldCheck,
  HiBriefcase,
  HiCake,
};

const gradientMap: Record<string, string> = {
  education: "from-teal-600 to-emerald-500",
  health: "from-rose-500 to-pink-500",
  drr: "from-amber-500 to-orange-500",
  wash: "from-blue-500 to-cyan-500",
  "food-security-and-livelihood": "from-green-600 to-lime-500",
  protection: "from-indigo-500 to-purple-500",
  "climate-change": "from-yellow-500 to-amber-500",
  agriculture: "from-lime-500 to-green-500",
  nutrition: "from-red-500 to-rose-500",
};

export default function SectorsPage() {
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
            <span className="text-white">Sectors</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our Sectors
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            Comprehensive development support across nine critical areas,
            working together to empower and uplift disadvantaged communities
            in Barisal Division.
          </p>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <h2 className="section-title">Explore Our Work</h2>
            <p className="section-subtitle mx-auto">
              Each sector addresses a vital aspect of community development,
              delivering targeted programs to meet the diverse needs of
              disadvantaged communities across Barisal Division.
            </p>
          </div>

          {sectors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Sector information is being updated. Please check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sectors.map(
                (sector) => {
                  const Icon = iconMap[sector.icon || ""] || HiAcademicCap;
                  const gradient =
                    gradientMap[sector.slug] || "from-brand to-brand-light";
                  return (
                    <Link
                      key={sector._id}
                      href={`/sectors/${sector.slug}`}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Gradient Image Placeholder */}
                      <div
                        className={`relative h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}
                      >
                        <Icon className="text-white/30 text-8xl group-hover:scale-110 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="text-brand text-xl" />
                          </div>
                          <h3 className="font-heading font-bold text-lg text-gray-900">
                            {sector.name}
                          </h3>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {sector.description}
                        </p>
                        <span className="inline-flex items-center gap-1 text-brand font-semibold text-sm group-hover:gap-2 transition-all duration-300">
                          Learn More
                          <HiArrowRight className="text-sm" />
                        </span>
                      </div>
                    </Link>
                  );
                }
              )}
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
