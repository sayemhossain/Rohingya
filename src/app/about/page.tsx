"use client";

import { useTeam } from "@/hooks/use-api";
import Link from "next/link";
import Image from "next/image";
import { HiHeart, HiShieldCheck, HiLightBulb, HiUserGroup } from "react-icons/hi";

const timelineEvents = [
  {
    year: "1978",
    title: "First Exodus from Myanmar",
    description:
      "Over 200,000 Rohingya fled to Bangladesh following Operation Nagamin, a military campaign by the Myanmar army targeting the Rohingya population in Rakhine State.",
  },
  {
    year: "1991\u201392",
    title: "Second Major Displacement",
    description:
      "Approximately 250,000 Rohingya refugees crossed into Bangladesh fleeing widespread persecution, forced labor, and violence by Myanmar's military regime.",
  },
  {
    year: "2012",
    title: "Violence in Rakhine State",
    description:
      "Sectarian violence erupted in Rakhine State, displacing over 100,000 Rohingya into internal displacement camps with severely restricted movement and access to services.",
  },
  {
    year: "2016",
    title: "Military Operations Begin",
    description:
      "Myanmar's military launched 'clearance operations' in northern Rakhine State, forcing tens of thousands to flee across the border amid reports of serious human rights abuses.",
  },
  {
    year: "2017",
    title: "Largest Exodus \u2014 700,000+ Flee",
    description:
      "The most devastating wave of violence drove over 700,000 Rohingya to Bangladesh in a matter of weeks, creating the world's largest refugee settlement in Cox's Bazar.",
  },
  {
    year: "2024",
    title: "Ongoing Humanitarian Response",
    description:
      "Nearly one million Rohingya refugees remain in Bangladesh. Humanitarian organizations continue providing essential services while advocating for long-term solutions and safe repatriation.",
  },
];

const values = [
  {
    icon: HiHeart,
    title: "Compassion",
    description:
      "We place the dignity and well-being of every refugee at the center of everything we do, responding with empathy and care.",
  },
  {
    icon: HiShieldCheck,
    title: "Integrity",
    description:
      "We uphold the highest standards of transparency, accountability, and ethical conduct in all our operations and partnerships.",
  },
  {
    icon: HiLightBulb,
    title: "Innovation",
    description:
      "We continuously seek creative and sustainable solutions to address the evolving needs of displaced communities.",
  },
  {
    icon: HiUserGroup,
    title: "Partnership",
    description:
      "We collaborate with local communities, governments, and international organizations to maximize our collective impact.",
  },
];

export default function AboutPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: teamMembers = [], isLoading: loading } = useTeam() as { data: Record<string, any>[]; isLoading: boolean };

  return (
    <>
      {/* Page Hero Banner */}
      <section className="relative bg-gradient-to-r from-brand-dark to-brand py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/images/pattern-overlay.png')] opacity-10" />
        <div className="container-custom relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-6 max-w-2xl mx-auto">
            Dedicated to supporting Rohingya refugees and building a path toward
            dignity, safety, and hope.
          </p>
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Column */}
            <div>
              <p className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-2">
                Our Mission
              </p>
              <h2 className="section-title">
                Standing with the Rohingya People
              </h2>
              <div className="space-y-4 text-dark-light leading-relaxed mt-6">
                <p>
                  We are committed to providing life-saving humanitarian
                  assistance and long-term development support to Rohingya
                  refugees living in Bangladesh. Our mission is rooted in the
                  belief that every person deserves access to safety, education,
                  healthcare, and the opportunity to rebuild their lives with
                  dignity.
                </p>
                <p>
                  Since the devastating crisis of 2017, we have worked alongside
                  local communities, international partners, and the refugees
                  themselves to deliver critical programs across education,
                  health, shelter, water and sanitation, food security, and
                  protection. Our approach is community-driven, ensuring that the
                  voices of those we serve shape every decision we make.
                </p>
                <p>
                  Looking ahead, we remain steadfast in our commitment to
                  advocating for the rights of the Rohingya people, supporting
                  durable solutions, and empowering refugees to become agents of
                  change within their own communities.
                </p>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="relative">
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
              {/* Decorative accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-accent/20 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-2">
              Understanding the Crisis
            </p>
            <h2 className="section-title">History of the Crisis</h2>
            <p className="section-subtitle mx-auto mt-4">
              Decades of persecution have forced millions of Rohingya to flee
              their homeland in Myanmar.
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-brand/20" />

            <div className="space-y-12">
              {timelineEvents.map((event, index) => (
                <div key={index} className="relative flex gap-6 md:gap-8">
                  {/* Date circle */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand text-white flex items-center justify-center font-heading font-bold text-xs md:text-sm shadow-lg">
                      {event.year}
                    </div>
                  </div>

                  {/* Content card */}
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
              humanitarian service.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
                <p className="mt-4 text-sm text-gray-500">Loading...</p>
              </div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Team information is being updated.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map(
                (
                  member,
                  index: number
                ) => (
                  <div key={member._id || index} className="group text-center">
                    {/* Photo or placeholder */}
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
                          <svg
                            className="w-16 h-16"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-dark mb-1">
                      {member.name}
                    </h3>
                    <p className="text-brand-accent font-semibold text-sm mb-3">
                      {member.role}
                    </p>
                    <p className="text-dark-light text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-brand-accent font-semibold uppercase tracking-wider text-sm mb-2">
              What Drives Us
            </p>
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle mx-auto mt-4">
              These core principles guide our work and define who we are as an
              organization.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-16 h-16 mx-auto rounded-xl bg-brand/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-brand" />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3">
                    {value.title}
                  </h3>
                  <p className="text-dark-light text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
