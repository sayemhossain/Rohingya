"use client";

import { useEffect, useRef, useState } from "react";
import {
  HiUsers,
  HiOfficeBuilding,
  HiCurrencyDollar,
  HiGlobe,
} from "react-icons/hi";

interface StatItem {
  icon: React.ReactNode;
  target: number;
  prefix?: string;
  suffix: string;
  label: string;
}

interface StatFromDB {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  HiUsers: <HiUsers className="w-10 h-10" />,
  HiOfficeBuilding: <HiOfficeBuilding className="w-10 h-10" />,
  HiCurrencyDollar: <HiCurrencyDollar className="w-10 h-10" />,
  HiGlobe: <HiGlobe className="w-10 h-10" />,
};

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function AnimatedCounter({ stat, isVisible }: { stat: StatItem; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = stat.target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), stat.target);
      setCount(current);

      if (step >= steps) {
        setCount(stat.target);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, stat.target]);

  return (
    <div className="text-center text-white">
      <div className="flex justify-center mb-4 opacity-80">{stat.icon}</div>
      <div className="font-heading text-4xl md:text-5xl font-bold mb-2">
        {stat.prefix || ""}
        {formatNumber(count)}
        {stat.suffix}
      </div>
      <p className="text-white/80 text-lg">{stat.label}</p>
    </div>
  );
}

function mapDBStats(dbStats: StatFromDB[]): StatItem[] {
  return dbStats.map((s) => ({
    icon: iconMap[s.icon || ""] || <HiGlobe className="w-10 h-10" />,
    target: s.value,
    prefix: s.prefix || "",
    suffix: s.suffix || "",
    label: s.label,
  }));
}

export default function StatsCounter({ stats: statsProp }: { stats?: StatFromDB[] | null }) {
  if (!statsProp || statsProp.length === 0) return null;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const stats: StatItem[] = mapDBStats(statsProp);

  useEffect(() => {
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
  }, []);

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
