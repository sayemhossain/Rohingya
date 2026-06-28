"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  HiUsers,
  HiUserGroup,
  HiOfficeBuilding,
  HiCurrencyDollar,
  HiGlobeAlt,
  HiCalendar,
  HiClock,
  HiLocationMarker,
  HiBriefcase,
  HiClipboardList,
  HiAcademicCap,
  HiHeart,
  HiSparkles,
  HiHome,
  HiShieldCheck,
} from "react-icons/hi";
import type { IconType } from "react-icons";

interface StatItem {
  icon: IconType;
  iconImage?: string;
  target: number | null; // null = non-numeric value, show as-is
  prefix: string;
  suffix: string;
  raw: string;
  label: string;
}

interface StatFromDB {
  label: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  icon?: string;
  iconImage?: string;
}

// Split a value like "50,000+" into { prefix: "", target: 50000, suffix: "+" }.
// Returns target: null when there's no number (e.g. plain text), so we show it verbatim.
function parseStatValue(value: string | number): { prefix: string; target: number | null; suffix: string } {
  const str = String(value ?? "").trim();
  const match = str.match(/^(\D*?)([\d.,]+)(.*)$/);
  if (!match) return { prefix: "", target: null, suffix: str };
  const target = parseFloat(match[2].replace(/,/g, ""));
  if (Number.isNaN(target)) return { prefix: "", target: null, suffix: str };
  return { prefix: match[1].trim(), target, suffix: match[3].trim() };
}

// Friendly / Hi-prefixed icon names -> component (keys normalised: lowercase, no "hi", letters only)
const iconMap: Record<string, IconType> = {
  users: HiUsers,
  people: HiUsers,
  usergroup: HiUserGroup,
  partners: HiUserGroup,
  calendar: HiCalendar,
  years: HiCalendar,
  clock: HiClock,
  mappin: HiLocationMarker,
  locationmarker: HiLocationMarker,
  location: HiLocationMarker,
  map: HiLocationMarker,
  briefcase: HiBriefcase,
  clipboardlist: HiClipboardList,
  clipboard: HiClipboardList,
  programs: HiClipboardList,
  globe: HiGlobeAlt,
  globealt: HiGlobeAlt,
  officebuilding: HiOfficeBuilding,
  building: HiOfficeBuilding,
  office: HiOfficeBuilding,
  academiccap: HiAcademicCap,
  education: HiAcademicCap,
  heart: HiHeart,
  sparkles: HiSparkles,
  star: HiSparkles,
  home: HiHome,
  shieldcheck: HiShieldCheck,
  currencydollar: HiCurrencyDollar,
  dollar: HiCurrencyDollar,
  money: HiCurrencyDollar,
};

const normalize = (s: string) =>
  s.toLowerCase().replace(/^hi/, "").replace(/[^a-z]/g, "");

// Resolve an icon from the admin-entered name, then fall back to guessing from the label.
function resolveIcon(iconName: string | undefined, label: string): IconType {
  if (iconName) {
    const hit = iconMap[normalize(iconName)];
    if (hit) return hit;
  }
  const l = label.toLowerCase();
  if (/(year|since|anniversar|decade)/.test(l)) return HiCalendar;
  if (/(district|village|area|region|location|upazila|coverage)/.test(l)) return HiLocationMarker;
  if (/(beneficiar|people|reach|served|member|famil|women|child|life|lives)/.test(l)) return HiUsers;
  if (/(program|project|initiative|sector|service)/.test(l)) return HiClipboardList;
  if (/(partner|organi|ngo)/.test(l)) return HiUserGroup;
  if (/(fund|donation|budget|raised)/.test(l)) return HiCurrencyDollar;
  if (/(school|student|education|train)/.test(l)) return HiAcademicCap;
  return HiSparkles;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function AnimatedCounter({ stat, isVisible }: { stat: StatItem; isVisible: boolean }) {
  const [count, setCount] = useState(0);
  const animated = stat.target !== null;

  useEffect(() => {
    if (!isVisible || stat.target === null) return;

    const target = stat.target;
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setCount(Math.min(Math.round(increment * step), target));
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, stat.target]);

  const Icon = stat.icon;

  return (
    <div className="group text-center text-white">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:bg-white/15">
        {stat.iconImage ? (
          <Image src={stat.iconImage} alt="" width={32} height={32} className="h-8 w-8 object-contain brightness-0 invert" />
        ) : (
          <Icon className="h-8 w-8 text-white" />
        )}
      </div>
      <div className="font-heading text-4xl md:text-5xl font-bold mb-2">
        {animated ? (
          <>
            {stat.prefix}
            {formatNumber(count)}
            {stat.suffix}
          </>
        ) : (
          stat.raw
        )}
      </div>
      <p className="text-sm font-medium uppercase tracking-wide text-white/75 md:text-base">
        {stat.label}
      </p>
    </div>
  );
}

function mapDBStats(dbStats: StatFromDB[]): StatItem[] {
  return dbStats.map((s) => {
    const { prefix, target, suffix } = parseStatValue(s.value);
    return {
      icon: resolveIcon(s.icon, s.label),
      iconImage: s.iconImage,
      target,
      prefix: s.prefix || prefix,
      suffix: s.suffix || suffix,
      raw: String(s.value ?? ""),
      label: s.label,
    };
  });
}

export default function StatsCounter({ stats: statsProp }: { stats?: StatFromDB[] | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const stats: StatItem[] = statsProp && statsProp.length > 0 ? mapDBStats(statsProp) : [];

  useEffect(() => {
    if (stats.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [stats.length]);

  if (stats.length === 0) return null;

  return (
    <section ref={sectionRef} className="section-padding bg-brand">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              stat={stat}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
