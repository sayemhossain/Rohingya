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
  HiSparkles,
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
  longDescription?: string;
  icon?: string;
  iconImage?: string;
  image?: string;
  gallery?: { url: string; caption?: string }[];
  stats?: { label: string; value: string; icon?: string }[];
  achievements?: string[];
}

export default function SubProgrammeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const subSlug = params.sub as string;

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

  const subProgrammes: SubProgramme[] = sector?.subProgrammes ?? [];
  const sub = subProgrammes.find((s) => s.slug === subSlug);

  if (isError || !sector || !sub) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sub-programme Not Found</h2>
        <p className="text-gray-500 mb-6">This sub-programme does not exist.</p>
        <Link href={`/programmes/${slug}`} className="text-brand font-medium hover:text-brand-accent transition-colors">
          Back to {sector?.name ?? "Programme"}
        </Link>
      </div>
    </div>
  );

  const Icon = iconMap[sub.icon || sector.icon || ""] || HiAcademicCap;
  const iconUrl =
    sub.iconImage ||
    (isIconImage(sub.icon) ? sub.icon : "") ||
    sector.iconImage ||
    (isIconImage(sector.icon) ? sector.icon : "");
  const gradient = gradientMap[sector.slug] || "from-brand to-brand-light";

  return (
    <>
      {/* Hero Banner — keeps the parent programme identity, path/breadcrumb updated */}
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
          <nav className="flex flex-wrap items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/programmes" className="hover:text-white transition-colors">Our Programmes</Link>
            <span>/</span>
            <Link href={`/programmes/${sector.slug}`} className="hover:text-white transition-colors">{sector.name}</Link>
            <span>/</span>
            <span className="text-white">{sub.name}</span>
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
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            <HiSparkles className="h-4 w-4" />
            {sub.name}
          </span>
        </div>
      </section>

      {/* Sub-programme pills (active highlighted) */}
      <SubProgrammePills
        parentSlug={sector.slug}
        items={subProgrammes.map((s) => ({ name: s.name, slug: s.slug }))}
        activeSlug={sub.slug}
      />

      {/* ---- Distinct sub-programme design from here down ---- */}

      {/* Description + image (overlapping editorial layout) */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {sub.image && (
              <div className="relative lg:col-span-5">
                <div className={`absolute -left-4 -top-4 h-24 w-24 rounded-2xl bg-gradient-to-br ${gradient} opacity-20`} />
                <Image
                  src={sub.image}
                  alt={sub.name}
                  width={640}
                  height={720}
                  className="relative h-full w-full rounded-3xl object-cover shadow-xl ring-1 ring-black/5"
                />
                <div className={`absolute -bottom-4 -right-4 h-28 w-28 rounded-2xl bg-gradient-to-br ${gradient} opacity-20`} />
              </div>
            )}
            <div className={sub.image ? "lg:col-span-7" : "lg:col-span-12 max-w-3xl mx-auto text-center"}>
              <span className={`mb-3 inline-block rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white`}>
                {sector.name} · Sub-programme
              </span>
              <h2 className="mb-5 text-3xl font-bold text-gray-900 md:text-4xl">
                {sub.name}
              </h2>
              {sub.longDescription ? (
                <div
                  className={`prose prose-sm max-w-none text-gray-600 prose-headings:text-gray-900 prose-strong:text-gray-800 sm:prose-base ${sub.image ? "" : "mx-auto text-left"}`}
                  dangerouslySetInnerHTML={{ __html: sub.longDescription }}
                />
              ) : (
                <p className="leading-relaxed text-gray-600">{sub.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Smart image gallery (sub-programme specific) */}
      <ProgrammeGallery
        images={sub.gallery}
        title="Gallery"
        subtitle={`Snapshots from our ${sub.name} work.`}
        accent={gradient}
      />

      {/* Our Impact — numbered list design */}
      {sub.achievements && sub.achievements.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <h2 className="section-title">Our Impact</h2>
                <p className="section-subtitle mx-auto">
                  Key outcomes of the {sub.name} initiative.
                </p>
              </div>
              <div className="space-y-4">
                {sub.achievements.map((achievement, i) => (
                  <div
                    key={achievement}
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5 transition-shadow hover:shadow-sm"
                  >
                    <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-sm font-bold text-white`}>
                      {i + 1}
                    </span>
                    <p className="leading-relaxed text-gray-700">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-brand-dark via-brand to-brand-light">
        <div className="container-custom text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Support Our {sector.name} Programs
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80">
            Your contribution can help expand the {sub.name} initiative and
            other {sector.name.toLowerCase()} services for disadvantaged
            communities across Barisal Division.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3.5 font-semibold text-brand transition-colors duration-300 hover:bg-gray-100"
            >
              Get Involved
              <HiArrowRight />
            </Link>
            <Link
              href={`/programmes/${sector.slug}`}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-white/10"
            >
              Back to {sector.name}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
