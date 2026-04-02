"use client";

import { useSector } from "@/hooks/use-api";
import { useParams } from "next/navigation";
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
  HiCheckCircle,
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

export default function SectorDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sector, isLoading, isError } = useSector(slug) as { data: Record<string, any> | undefined; isLoading: boolean; isError: boolean };

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );

  if (isError || !sector) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sector Not Found</h2>
        <p className="text-gray-500 mb-6">The sector you are looking for does not exist.</p>
        <Link href="/sectors" className="text-brand font-medium hover:text-brand-accent transition-colors">
          Back to Sectors
        </Link>
      </div>
    </div>
  );

  const Icon = iconMap[sector.icon || ""] || HiAcademicCap;
  const gradient = gradientMap[sector.slug] || "from-brand to-brand-light";

  return (
    <>
      {/* Hero Banner */}
      <section
        className={`relative bg-gradient-to-br ${gradient} py-20 md:py-28`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/sectors"
              className="hover:text-white transition-colors"
            >
              Sectors
            </Link>
            <span>/</span>
            <span className="text-white">{sector.name}</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="text-white text-3xl" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {sector.name}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            {sector.longDescription || sector.description}
          </p>
        </div>
      </section>

      {/* Key Stats */}
      {sector.stats && sector.stats.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Key Statistics</h2>
              <p className="section-subtitle mx-auto">
                Numbers that reflect the scale and impact of our{" "}
                {sector.name.toLowerCase()} programs.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {sector.stats.map(
                (stat: { label: string; value: string; icon?: string }) => (
                  <div
                    key={stat.label}
                    className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100 hover:shadow-md transition-shadow duration-300"
                  >
                    <p className="text-3xl md:text-4xl font-bold text-brand mb-2">
                      {stat.value}
                    </p>
                    <p className="font-heading font-semibold text-gray-900 mb-1">
                      {stat.label}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Our Programs */}
      {sector.programs && sector.programs.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="section-title">Our Programs</h2>
              <p className="section-subtitle mx-auto">
                Targeted interventions designed to address the most pressing{" "}
                {sector.name.toLowerCase()} needs in our communities.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sector.programs.map(
                (
                  program: { title: string; description: string },
                  index: number
                ) => (
                  <div
                    key={program.title}
                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                          {program.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {program.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* Impact / Achievements */}
      {sector.achievements && sector.achievements.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="section-title">Our Impact</h2>
                <p className="section-subtitle mx-auto">
                  Key achievements and milestones in our{" "}
                  {sector.name.toLowerCase()} response.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sector.achievements.map((achievement: string) => (
                  <div
                    key={achievement}
                    className="flex items-start gap-3 bg-gray-50 rounded-xl p-5"
                  >
                    <HiCheckCircle className="text-brand-accent text-xl flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 leading-relaxed">
                      {achievement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-brand-dark via-brand to-brand-light">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Support Our {sector.name} Programs
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Your contribution can help expand {sector.name.toLowerCase()}{" "}
            services for disadvantaged communities. Join us in making a lasting
            difference in the lives of vulnerable people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Get Involved
              <HiArrowRight />
            </Link>
            <Link
              href="/sectors"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              Explore All Sectors
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
