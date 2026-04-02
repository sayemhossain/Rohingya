"use client";

import { useAbout, useTeam } from "@/hooks/use-api";
import Link from "next/link";
import Image from "next/image";
import { HiHeart, HiShieldCheck, HiLightBulb, HiUserGroup, HiStar, HiGlobe, HiAcademicCap, HiSparkles, HiEye } from "react-icons/hi";
import { HiBriefcase } from "react-icons/hi";
import type { IconType } from "react-icons";

const iconMap: Record<string, IconType> = {
  HiHeart,
  HiShieldCheck,
  HiLightBulb,
  HiUserGroup,
  HiStar,
  HiGlobe,
  HiAcademicCap,
  HiBriefcase,
  HiSparkles,
  HiEye,
};

export default function AboutPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: about, isLoading: aboutLoading } = useAbout() as { data: Record<string, any> | undefined; isLoading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: teamMembers = [], isLoading: teamLoading } = useTeam() as { data: Record<string, any>[]; isLoading: boolean };

  const loading = aboutLoading || teamLoading;

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );

  const heroTitle = about?.heroTitle || "About AROHI";
  const heroSubtitle = about?.heroSubtitle || "";
  const missionLabel = about?.missionLabel || "Our Mission";
  const missionTitle = about?.missionTitle || "";
  const missionBody: string = about?.missionBody || "";
  const missionImage: string = about?.missionImage || "";
  const timelineLabel = about?.timelineLabel || "Our Journey";
  const timelineTitle = about?.timelineTitle || "History of AROHI";
  const timelineSubtitle = about?.timelineSubtitle || "";
  const timeline: { year: string; title: string; description: string }[] = about?.timeline || [];
  const valuesLabel = about?.valuesLabel || "What Drives Us";
  const valuesTitle = about?.valuesTitle || "Our Values";
  const valuesSubtitle = about?.valuesSubtitle || "";
  const values: { icon: string; title: string; description: string }[] = about?.values || [];

  return (
    <>
      {/* Page Hero Banner */}
      <section className="relative bg-gradient-to-r from-brand-dark to-brand py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/images/pattern-overlay.png')] opacity-10" />
        <div className="container-custom relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl mx-auto">
              {heroSubtitle}
            </p>
          )}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-white/70">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white">About</span>
          </nav>
        </div>
      </section>

      {/* Our Mission */}
      {(missionTitle || missionBody) && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                {missionLabel && (
                  <p className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-2">
                    {missionLabel}
                  </p>
                )}
                {missionTitle && (
                  <h2 className="section-title">{missionTitle}</h2>
                )}
                {missionBody && (
                  <div
                    className="space-y-4 text-dark-light leading-relaxed mt-6 [&>p]:mb-4"
                    dangerouslySetInnerHTML={{ __html: missionBody }}
                  />
                )}
              </div>

              <div className="relative">
                {missionImage ? (
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                    <Image
                      src={missionImage}
                      alt="Mission"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center overflow-hidden">
                    <div className="text-center text-white/60">
                      <svg
                        className="w-16 h-16 mx-auto mb-3 opacity-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Mission Image</span>
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-accent/20 rounded-2xl -z-10" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              {timelineLabel && (
                <p className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-2">
                  {timelineLabel}
                </p>
              )}
              {timelineTitle && <h2 className="section-title">{timelineTitle}</h2>}
              {timelineSubtitle && (
                <p className="section-subtitle mx-auto mt-4">{timelineSubtitle}</p>
              )}
            </div>

            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-brand/20" />
              <div className="space-y-12">
                {timeline.map((event, index) => (
                  <div key={index} className="relative flex gap-6 md:gap-8">
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand text-white flex items-center justify-center font-heading font-bold text-xs md:text-sm shadow-lg">
                        {event.year}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex-1 mt-1">
                      <h3 className="text-lg md:text-xl font-bold text-dark mb-2">
                        {event.title}
                      </h3>
                      <p className="text-dark-light leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Our Team */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-2">
              The People Behind Our Work
            </p>
            <h2 className="section-title">Our Team</h2>
            <p className="section-subtitle mx-auto mt-4">
              A dedicated group of professionals united by a shared commitment to
              community development.
            </p>
          </div>

          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Team information is being updated.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index: number) => (
                <div key={member._id || index} className="group text-center">
                  <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-brand to-brand-accent mb-6 flex items-center justify-center overflow-hidden shadow-lg relative">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-white/60">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-1">{member.name}</h3>
                  <p className="text-brand-accent font-semibold text-sm mb-3">{member.role}</p>
                  <p className="text-dark-light text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      {values.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              {valuesLabel && (
                <p className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-2">
                  {valuesLabel}
                </p>
              )}
              {valuesTitle && <h2 className="section-title">{valuesTitle}</h2>}
              {valuesSubtitle && (
                <p className="section-subtitle mx-auto mt-4">{valuesSubtitle}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = iconMap[value.icon] || HiHeart;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-16 h-16 mx-auto rounded-xl bg-brand/10 flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-brand" />
                    </div>
                    <h3 className="text-xl font-bold text-dark mb-3">{value.title}</h3>
                    <p className="text-dark-light text-sm leading-relaxed">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
