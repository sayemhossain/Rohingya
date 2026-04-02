import type { Metadata } from "next";
import Link from "next/link";
import {
  HiUserGroup,
  HiLocationMarker,
  HiAcademicCap,
  HiHeart,
  HiExclamationCircle,
  HiLightningBolt,
  HiChevronRight,
  HiArrowRight,
} from "react-icons/hi";

export const metadata: Metadata = {
  title: "Development Challenges — AROHI",
  description:
    "Overview of the development challenges faced by communities in Barisal Division, Bangladesh — poverty, climate vulnerability, health, education, and how AROHI is responding.",
};

const keyStats = [
  {
    icon: HiUserGroup,
    value: "50,000+",
    label: "Beneficiaries Served",
    description: "People across Barisal Division benefiting from AROHI programs",
  },
  {
    icon: HiLocationMarker,
    value: "3",
    label: "Working Districts",
    description:
      "Barisal, Patuakhali, and Bhola districts in southern Bangladesh",
  },
  {
    icon: HiAcademicCap,
    value: "300+",
    label: "Villages Reached",
    description: "Rural and remote communities including char (river island) areas",
  },
  {
    icon: HiHeart,
    value: "23+",
    label: "Years of Service",
    description:
      "Continuous community development work since 2002",
  },
];

const sectorNeeds = [
  {
    title: "Health & Nutrition",
    color: "border-red-500",
    bg: "bg-red-50",
    stat: "High",
    statLabel: "maternal and child mortality",
    description:
      "Rural and remote communities in Barisal Division face limited access to healthcare facilities. Maternal and child health services, nutrition support, and eye care are critical needs.",
  },
  {
    title: "Education",
    color: "border-blue-500",
    bg: "bg-blue-50",
    stat: "Low",
    statLabel: "enrollment in remote areas",
    description:
      "Underprivileged children in rural areas face barriers to quality education including poverty, distance, and lack of awareness about educational opportunities.",
  },
  {
    title: "Water & Sanitation",
    color: "border-cyan-500",
    bg: "bg-cyan-50",
    stat: "Critical",
    statLabel: "in char & coastal areas",
    description:
      "Safe drinking water and sanitary latrines remain scarce in char (river island) communities and remote coastal areas, leading to waterborne diseases.",
  },
  {
    title: "Climate & Disasters",
    color: "border-amber-500",
    bg: "bg-amber-50",
    stat: "Frequent",
    statLabel: "cyclones, floods, erosion",
    description:
      "Barisal Division sits in the coastal belt, making communities extremely vulnerable to cyclones, floods, tidal surges, river erosion, and climate change impacts.",
  },
  {
    title: "Livelihoods",
    color: "border-green-600",
    bg: "bg-green-50",
    stat: "Widespread",
    statLabel: "rural poverty",
    description:
      "Limited income-generating opportunities, lack of modern farming techniques, and poor market access keep rural families trapped in poverty cycles.",
  },
  {
    title: "Rights & Protection",
    color: "border-purple-500",
    bg: "bg-purple-50",
    stat: "Vulnerable",
    statLabel: "groups need support",
    description:
      "Persons with disabilities, women, children, indigenous and minority communities face discrimination and lack access to legal aid and protection services.",
  },
];

export default function CrisisOverviewPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="container-custom relative z-10 py-24 md:py-32 lg:py-40">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-white/70 mb-8"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <HiChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Development Challenges</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6">
            Development Challenges
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
            Communities in Barisal Division face interconnected challenges
            of poverty, climate vulnerability, limited services, and
            marginalization that AROHI works to address.
          </p>
        </div>
      </section>

      {/* Summary */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">
              Understanding the Context
            </span>
            <h2 className="section-title mb-6">
              The Challenges We Address
            </h2>
            <p className="text-lg md:text-xl text-dark-light leading-relaxed mb-8">
              Barisal Division in southern Bangladesh is home to millions of
              people living in coastal and riverine areas highly vulnerable to
              natural disasters and climate change. Poverty, limited
              infrastructure, and geographic isolation create complex
              development challenges.
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-left">
              {[
                "Coastal communities vulnerable to cyclones and flooding",
                "Remote char (river island) areas with limited services",
                "Persons with disabilities facing discrimination",
                "Women and children needing empowerment and protection",
              ].map((fact) => (
                <div key={fact} className="flex items-start gap-2">
                  <HiExclamationCircle className="w-5 h-5 text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-dark-light">{fact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="inline-block text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">
              Our Reach
            </span>
            <h2 className="section-title">AROHI&apos;s Impact</h2>
            <p className="section-subtitle mx-auto">
              Over 23 years of service, AROHI has built deep roots in
              communities across Barisal Division.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6 text-brand group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-brand">
                        {stat.value}
                      </p>
                      <p className="text-sm font-semibold text-dark uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                  <p className="text-dark-light text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Needs by Sector */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="inline-block text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">
              Development Needs
            </span>
            <h2 className="section-title">Challenges by Sector</h2>
            <p className="section-subtitle mx-auto">
              The interconnected development challenges require a multi-sector
              response spanning health, education, livelihoods, and protection.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectorNeeds.map((sector) => (
              <div
                key={sector.title}
                className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border-t-4 ${sector.color}`}
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-dark mb-3">
                    {sector.title}
                  </h3>
                  <div
                    className={`inline-flex items-center gap-2 ${sector.bg} rounded-full px-3 py-1 mb-4`}
                  >
                    <HiLightningBolt className="w-4 h-4 text-dark-light" />
                    <span className="text-sm font-semibold text-dark">
                      {sector.stat}
                    </span>
                    <span className="text-sm text-dark-light">
                      {sector.statLabel}
                    </span>
                  </div>
                  <p className="text-dark-light text-sm leading-relaxed">
                    {sector.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-brand-dark to-brand text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-accent rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us in Making a Difference
          </h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every contribution &mdash; whether financial, material, or your time
            &mdash; directly impacts the lives of disadvantaged communities.
            Learn how you can support AROHI&apos;s work.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/get-involved"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-accent hover:bg-brand-accent-dark text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Get Involved
              <HiArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white/30 hover:border-white text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
