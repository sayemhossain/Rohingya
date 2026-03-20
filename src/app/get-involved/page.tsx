import Link from "next/link";
import type { Metadata } from "next";
import {
  HiHeart,
  HiUserGroup,
  HiCurrencyDollar,
  HiStar,
  HiGlobe,
  HiBriefcase,
  HiSpeakerphone,
  HiArrowRight,
  HiCheckCircle,
} from "react-icons/hi";

export const metadata: Metadata = {
  title: "Get Involved — Rohingya in Bangladesh",
  description:
    "Make a difference in the lives of Rohingya refugees. Donate, volunteer, explore careers, or partner with us to support humanitarian efforts in Bangladesh.",
};

const donationTiers = [
  {
    amount: "$25",
    title: "Essential Support",
    description:
      "Provides clean drinking water and hygiene supplies for a family of five for an entire month.",
    items: [
      "Water purification supplies",
      "Hygiene kits for a family",
      "Basic medical supplies",
    ],
    gradient: "from-brand-accent to-emerald-400",
  },
  {
    amount: "$50",
    title: "Family Care",
    description:
      "Feeds a refugee family for one month and provides educational materials for two children.",
    items: [
      "Monthly food rations for a family",
      "School supplies for 2 children",
      "Nutritional supplements",
    ],
    gradient: "from-brand to-brand-light",
    featured: true,
  },
  {
    amount: "$100",
    title: "Shelter & Safety",
    description:
      "Builds a weatherproof shelter for a displaced family, protecting them from monsoons and extreme heat.",
    items: [
      "Emergency shelter materials",
      "Monsoon-resistant upgrades",
      "Solar-powered lighting",
    ],
    gradient: "from-teal-600 to-cyan-500",
  },
];

const volunteerRoles = [
  {
    title: "Field Worker",
    icon: HiGlobe,
    description:
      "Work directly in Cox's Bazar refugee camps, assisting with distribution, education programs, and community engagement. Experience the impact of humanitarian work firsthand while making a tangible difference in people's daily lives.",
    requirements: [
      "Minimum 3-month commitment",
      "Prior humanitarian experience preferred",
      "Physically fit for field conditions",
    ],
  },
  {
    title: "Remote Support",
    icon: HiBriefcase,
    description:
      "Contribute your professional skills from anywhere in the world. Help with translation, data analysis, graphic design, grant writing, social media management, and other critical support functions.",
    requirements: [
      "Flexible hours, 10+ hrs/week",
      "Relevant professional skills",
      "Reliable internet connection",
    ],
  },
  {
    title: "Fundraiser",
    icon: HiSpeakerphone,
    description:
      "Organize events, campaigns, and outreach in your community to raise awareness and funds for Rohingya refugees. Become an ambassador for the cause and inspire others to take action.",
    requirements: [
      "Strong communication skills",
      "Community network or social reach",
      "Passion for advocacy",
    ],
  },
];

export default function GetInvolvedPage() {
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
            <span className="text-white">Get Involved</span>
          </nav>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Get Involved
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            Your support can transform lives. Whether through donations,
            volunteering, or partnerships, every contribution brings hope to
            Rohingya refugees in Bangladesh.
          </p>
        </div>
      </section>

      {/* Donate Section */}
      <section className="section-padding bg-white" id="donate">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <HiHeart className="text-lg" />
              Make a Donation
            </div>
            <h2 className="section-title">Your Generosity Saves Lives</h2>
            <p className="section-subtitle mx-auto">
              Every dollar you give goes directly toward providing food, shelter,
              healthcare, and education to over one million Rohingya refugees
              living in Cox&apos;s Bazar. Even a small contribution creates a
              ripple of lasting impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {donationTiers.map((tier) => (
              <div
                key={tier.amount}
                className={`relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
                  tier.featured
                    ? "ring-2 ring-brand md:-translate-y-2"
                    : "border border-gray-100"
                }`}
              >
                {tier.featured && (
                  <div className="bg-brand text-white text-center py-1.5 text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div
                  className={`bg-gradient-to-br ${tier.gradient} px-6 py-8 text-center`}
                >
                  <span className="text-5xl font-bold text-white">
                    {tier.amount}
                  </span>
                  <p className="text-white/80 mt-1 text-sm">per donation</p>
                </div>

                <div className="p-6">
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                    {tier.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {tier.description}
                  </p>
                  <ul className="space-y-2.5 mb-6">
                    {tier.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <HiCheckCircle className="text-brand-accent text-lg flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="#" className="btn-accent text-lg px-10 py-4">
              Donate Now
            </Link>
            <p className="text-gray-500 text-sm mt-3">
              Secure payment. 100% of your donation reaches those in need.
            </p>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="section-padding bg-gray-50" id="volunteer">
        <div className="container-custom">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <HiUserGroup className="text-lg" />
              Volunteer With Us
            </div>
            <h2 className="section-title">Lend Your Skills & Time</h2>
            <p className="section-subtitle mx-auto">
              Volunteers are the backbone of our humanitarian response. Whether
              you can join us on the ground in Bangladesh or contribute remotely,
              your time and expertise make a world of difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {volunteerRoles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.title}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
                >
                  <div className="w-14 h-14 rounded-xl bg-brand/10 flex items-center justify-center mb-5">
                    <Icon className="text-brand text-2xl" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5">
                    {role.description}
                  </p>
                  <ul className="space-y-2">
                    {role.requirements.map((req) => (
                      <li
                        key={req}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <HiCheckCircle className="text-brand-accent text-lg flex-shrink-0 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/contact" className="btn-primary">
              Apply to Volunteer
              <HiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="section-padding bg-white" id="careers">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <HiBriefcase className="text-lg" />
                Careers
              </div>
              <h2 className="section-title">
                Build a Career in Humanitarian Work
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Join our team of dedicated professionals working on the front
                lines of one of the world&apos;s largest refugee crises. We
                offer meaningful careers across program management, logistics,
                communications, finance, and more.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                We are committed to diversity, equity, and inclusion. We welcome
                applicants from all backgrounds and provide competitive
                compensation, professional development opportunities, and a
                supportive working environment.
              </p>
              <Link href="#" className="btn-outline">
                View Open Positions
                <HiArrowRight className="ml-2" />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-brand/5 to-brand-accent/5 rounded-2xl p-8 md:p-10">
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-6">
                Why Work With Us?
              </h3>
              <ul className="space-y-4">
                {[
                  "Direct impact on the lives of over 1 million refugees",
                  "Work alongside experienced humanitarian professionals",
                  "Professional growth and training opportunities",
                  "Competitive compensation and benefits",
                  "Inclusive and supportive team culture",
                  "Field and remote positions available",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <HiStar className="text-brand-accent text-xl flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partner With Us Section */}
      <section className="section-padding bg-gray-50" id="partner">
        <div className="container-custom text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <HiCurrencyDollar className="text-lg" />
              Partner With Us
            </div>
            <h2 className="section-title">
              Organizational & Corporate Partnerships
            </h2>
            <p className="section-subtitle mx-auto mb-8">
              We collaborate with NGOs, corporations, government agencies, and
              academic institutions to amplify our humanitarian impact. Together,
              we can achieve more for Rohingya refugees than any of us can alone.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 text-left">
              {[
                {
                  title: "Funding Partners",
                  description:
                    "Support programs through grants, CSR initiatives, or co-funding arrangements.",
                },
                {
                  title: "Technical Partners",
                  description:
                    "Share expertise in technology, logistics, health, education, or engineering.",
                },
                {
                  title: "Implementing Partners",
                  description:
                    "Collaborate on program delivery, community engagement, and field operations.",
                },
                {
                  title: "Advocacy Partners",
                  description:
                    "Amplify the voices of Rohingya refugees and advocate for policy changes.",
                },
              ].map((partner) => (
                <div
                  key={partner.title}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="font-heading font-bold text-gray-900 mb-2">
                    {partner.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {partner.description}
                  </p>
                </div>
              ))}
            </div>

            <Link href="/contact" className="btn-primary">
              Discuss a Partnership
              <HiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
