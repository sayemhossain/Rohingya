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
} from "react-icons/hi";
import type { IconType } from "react-icons";

interface SectorItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

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

export default function SectorsGrid({ sectors }: { sectors?: SectorItem[] }) {
  if (!sectors || sectors.length === 0) return null;
  const items = sectors;

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="section-title">Our Sectors</h2>
          <p className="section-subtitle mx-auto">
            Comprehensive development support across key areas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((sector) => {
            const Icon = iconMap[sector.icon || ""] || HiAcademicCap;
            return (
              <Link
                key={sector._id}
                href={`/sectors/${sector.slug}`}
                className="group bg-white rounded-xl p-6 border-t-4 border-transparent hover:border-brand-accent shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <Icon className="text-brand text-4xl mb-4" />
                <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2">
                  {sector.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {sector.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
