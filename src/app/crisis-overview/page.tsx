import type { Metadata } from "next";
import Link from "next/link";
import {
  HiUserGroup,
  HiLocationMarker,
  HiAcademicCap,
  HiHeart,
  HiCurrencyDollar,
  HiClock,
  HiExclamationCircle,
  HiLightningBolt,
  HiChevronRight,
  HiArrowRight,
} from "react-icons/hi";

export const metadata: Metadata = {
  title: "The Rohingya Crisis — Crisis Overview | Rohingya in Bangladesh",
  description:
    "Comprehensive overview of the Rohingya refugee crisis in Bangladesh — key statistics, humanitarian needs, camp conditions, and how you can help.",
};

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const keyStats = [
  {
    icon: HiUserGroup,
    value: "1.1M+",
    label: "Rohingya Refugees",
    description: "Displaced persons currently sheltered in Cox's Bazar district",
  },
  {
    icon: HiLocationMarker,
    value: "33",
    label: "Refugee Camps",
    description:
      "Camps and settlements across Ukhiya and Teknaf sub-districts",
  },
  {
    icon: HiAcademicCap,
    value: "540K+",
    label: "Children Affected",
    description: "Children under 18 in need of education and protection",
  },
  {
    icon: HiHeart,
    value: "52%",
    label: "Women & Girls",
    description:
      "Of the refugee population are women and girls requiring targeted support",
  },
  {
    icon: HiCurrencyDollar,
    value: "48%",
    label: "Funding Gap",
    description:
      "Of the Joint Response Plan remains unfunded, limiting aid delivery",
  },
  {
    icon: HiClock,
    value: "7+ Years",
    label: "Of Displacement",
    description:
      "Since the mass exodus of August 2017 with no durable solution in sight",
  },
];

const sectorNeeds = [
  {
    title: "Education",
    color: "border-blue-500",
    bg: "bg-blue-50",
    stat: "75%",
    statLabel: "of children lack formal education",
    description:
      "Over 400,000 Rohingya children have limited access to quality learning. Temporary learning centres serve a fraction of the need, and the Myanmar curriculum remains inaccessible to most.",
  },
  {
    title: "Health",
    color: "border-red-500",
    bg: "bg-red-50",
    stat: "1:8,000",
    statLabel: "doctor-to-patient ratio in camps",
    description:
      "Health facilities are overwhelmed. Communicable diseases, malnutrition, and mental health conditions are widespread, exacerbated by overcrowding and limited medical infrastructure.",
  },
  {
    title: "WASH",
    color: "border-cyan-500",
    bg: "bg-cyan-50",
    stat: "35%",
    statLabel: "lack safe water access",
    description:
      "Water, sanitation, and hygiene services remain critically under-resourced. Contaminated water sources and inadequate latrines heighten disease risk, especially during monsoon season.",
  },
  {
    title: "Shelter",
    color: "border-amber-500",
    bg: "bg-amber-50",
    stat: "90%",
    statLabel: "in temporary bamboo shelters",
    description:
      "Most families live in makeshift bamboo-and-tarpaulin structures vulnerable to cyclones, flooding, and fire. Repeated disasters destroy shelters faster than they can be rebuilt.",
  },
  {
    title: "Food Security",
    color: "border-green-600",
    bg: "bg-green-50",
    stat: "61%",
    statLabel: "face food insecurity",
    description:
      "Ration cuts due to funding shortfalls have reduced daily caloric intake below minimum standards. Refugees depend almost entirely on humanitarian food assistance for survival.",
  },
  {
    title: "Protection",
    color: "border-purple-500",
    bg: "bg-purple-50",
    stat: "40%",
    statLabel: "report safety concerns",
    description:
      "Gender-based violence, trafficking, child labour, and exploitation remain pervasive threats. Women, children, and persons with disabilities face the greatest protection risks.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CrisisOverviewPage() {
  return (
    <>
      {/* ============================================================ */}
      {/* 1. PAGE HERO                                                  */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="container-custom relative z-10 py-24 md:py-32 lg:py-40">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-white/70 mb-8"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <HiChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Crisis Overview</span>
          </nav>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6">
            The Rohingya Crisis
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
            One of the world&rsquo;s most severe refugee emergencies &mdash;
            over a million stateless Rohingya depend on humanitarian aid in
            Bangladesh&rsquo;s Cox&rsquo;s Bazar, the largest refugee settlement
            on earth.
          </p>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. CRISIS SUMMARY                                            */}
      {/* ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">
              Understanding the Crisis
            </span>
            <h2 className="section-title mb-6">
              A Humanitarian Emergency of Staggering Scale
            </h2>
            <p className="text-lg md:text-xl text-dark-light leading-relaxed mb-8">
              Since August 2017, more than 740,000 Rohingya fled targeted
              violence in Myanmar&rsquo;s Rakhine State, joining hundreds of
              thousands already displaced in earlier waves. Today, an estimated
              1.1 million refugees live in 33 congested camps across Cox&rsquo;s
              Bazar district &mdash; making it the largest and most densely
              populated refugee settlement in the world.
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-left">
              {[
                "Denied citizenship in Myanmar since 1982",
                "Systematic persecution and ethnic cleansing",
                "No legal right to work, own property, or move freely",
                "Entirely dependent on humanitarian assistance",
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

      {/* ============================================================ */}
      {/* 3. KEY STATISTICS                                            */}
      {/* ============================================================ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="inline-block text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">
              By the Numbers
            </span>
            <h2 className="section-title">Key Statistics</h2>
            <p className="section-subtitle mx-auto">
              The scope of the crisis reflected in data from UNHCR, ISCG, and
              partner agencies.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* ============================================================ */}
      {/* 4. THE SITUATION — Two columns                               */}
      {/* ============================================================ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text column */}
            <div>
              <span className="inline-block text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">
                On the Ground
              </span>
              <h2 className="section-title mb-6">
                Life Inside the World&rsquo;s Largest Refugee Camp
              </h2>

              <div className="space-y-5 text-dark-light leading-relaxed">
                <p>
                  The Kutupalong-Balukhali mega-camp spans roughly 26 square
                  kilometres of hilly terrain — an area smaller than many city
                  parks — yet houses over 600,000 people. Overcrowding drives
                  rapid disease transmission, limits access to clean water, and
                  makes the camps highly vulnerable to natural disasters.
                </p>
                <p>
                  Monsoon rains and cyclones routinely trigger landslides and
                  flooding, displacing families multiple times. In March 2023, a
                  devastating fire destroyed thousands of shelters, leaving
                  12,000 refugees homeless overnight. The camps sit in one of
                  Bangladesh&rsquo;s most climate-vulnerable regions.
                </p>
                <p>
                  Refugees have no legal right to work in Bangladesh and are
                  confined to the camps, creating a cycle of aid dependency.
                  Mental health challenges — including trauma, anxiety, and
                  depression — are widespread, with far too few services
                  available to address them.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { figure: "26 km²", caption: "Total camp area" },
                  { figure: "40,000+", caption: "People per km²" },
                  { figure: "200+", caption: "Health facilities" },
                  { figure: "3,900+", caption: "Learning centres" },
                ].map((item) => (
                  <div
                    key={item.caption}
                    className="bg-gray-50 rounded-lg p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-brand">
                      {item.figure}
                    </p>
                    <p className="text-sm text-dark-light">{item.caption}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image / map placeholder */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-full min-h-[360px]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand to-brand-accent opacity-90" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                <HiLocationMarker className="w-16 h-16 mb-4 opacity-80" />
                <p className="text-xl font-semibold mb-1">
                  Cox&rsquo;s Bazar, Bangladesh
                </p>
                <p className="text-white/70 text-sm max-w-xs">
                  Satellite view of the refugee camps — the densest human
                  settlement on earth
                </p>
              </div>
              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. NEEDS BY SECTOR                                           */}
      {/* ============================================================ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="inline-block text-brand-accent font-semibold tracking-wider uppercase text-sm mb-3">
              Humanitarian Needs
            </span>
            <h2 className="section-title">Needs by Sector</h2>
            <p className="section-subtitle mx-auto">
              The crisis demands a multi-sector response spanning health,
              education, shelter, and protection for over one million refugees.
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

      {/* ============================================================ */}
      {/* 6. HOW TO HELP CTA                                           */}
      {/* ============================================================ */}
      <section className="relative bg-gradient-to-r from-brand-dark to-brand text-white overflow-hidden">
        {/* Decorative */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-accent rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10 py-20 md:py-28 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            The Crisis Demands Action
          </h2>
          <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Every contribution &mdash; whether financial, material, or your time
            &mdash; directly impacts the lives of Rohingya refugees. Learn how
            you can be part of the response.
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
