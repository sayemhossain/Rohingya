"use client";

import { useSector } from "@/hooks/use-api";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
import SubProgrammePills from "@/components/programmes/SubProgrammePills";
import ProgrammeGallery from "@/components/programmes/ProgrammeGallery";
import { isIconImage } from "@/lib/icons";

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

interface SubProgramme {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
}

export default function ProgrammeDetailPage() {
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Programme Not Found</h2>
        <p className="text-gray-500 mb-6">The programme you are looking for does not exist.</p>
        <Link href="/programmes" className="text-brand font-medium hover:text-brand-accent transition-colors">
          Back to Programmes
        </Link>
      </div>
    </div>
  );

  const Icon = iconMap[sector.icon || ""] || HiAcademicCap;
  const iconUrl = sector.iconImage || (isIconImage(sector.icon) ? sector.icon : "");
  const gradient = gradientMap[sector.slug] || "from-brand to-brand-light";
  const subProgrammes: SubProgramme[] = sector.subProgrammes ?? [];

  return (
    <>
      {/* Hero Banner */}
      <section className="relative py-20 md:py-28">
        {sector.image ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${sector.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />
          </>
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )}
        <div className="container-custom relative z-10">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/programmes"
              className="hover:text-white transition-colors"
            >
              Our Programmes
            </Link>
            <span>/</span>
            <span className="text-white">{sector.name}</span>
          </nav>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              {iconUrl ? (
                <Image src={iconUrl} alt="" width={32} height={32} className="h-8 w-8 object-contain brightness-0 invert" />
              ) : (
                <Icon className="text-white text-3xl" />
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {sector.name}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl">
            {sector.description}
          </p>
        </div>
      </section>

      {/* Sub-programme pills */}
      <SubProgrammePills
        parentSlug={sector.slug}
        items={subProgrammes.map((s) => ({ name: s.name, slug: s.slug }))}
      />

      {/* Description + image */}
      {(() => {
        const descImage = sector.descriptionImage || sector.image;
        return (sector.longDescription || descImage) ? (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="mb-3 inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand">
                  About this programme
                </span>
                <h2 className="mb-5 text-2xl font-bold text-gray-900 md:text-3xl">
                  How {sector.name} works at AROHI
                </h2>
                {sector.longDescription ? (
                  <div
                    className="prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-800 sm:prose-base"
                    dangerouslySetInnerHTML={{ __html: sector.longDescription }}
                  />
                ) : (
                  <p className="leading-relaxed text-gray-600">{sector.description}</p>
                )}
              </div>
              {descImage && (
                <div className="relative">
                  <div className={`absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br ${gradient} opacity-10 blur-xl`} />
                  <Image
                    src={descImage}
                    alt={sector.name}
                    width={720}
                    height={540}
                    className="h-full w-full rounded-3xl object-cover shadow-lg ring-1 ring-black/5"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
        ) : null;
      })()}

      {/* Smart image gallery */}
      <ProgrammeGallery
        images={sector.gallery}
        title={`${sector.name} Gallery`}
        subtitle={`Moments from our ${sector.name.toLowerCase()} work across Barisal Division.`}
        accent={gradient}
      />

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
              href="/programmes"
              className="inline-flex items-center justify-center px-8 py-3.5 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300"
            >
              Explore All Programmes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
