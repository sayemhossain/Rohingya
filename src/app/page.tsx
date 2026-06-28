"use client";

import { useHomepage } from "@/hooks/use-api";
import HeroSlider from "@/components/home/HeroSlider";
import Journey from "@/components/home/Journey";
import StatsCounter from "@/components/home/StatsCounter";
import SectorsGrid from "@/components/home/SectorsGrid";
import LatestNews from "@/components/home/LatestNews";
import ImpactStories from "@/components/home/ImpactStories";
import GetInvolvedCTA from "@/components/home/GetInvolvedCTA";
import Partners from "@/components/home/Partners";

function HomeLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero skeleton */}
      <div className="relative h-[600px] md:h-[700px] bg-gradient-to-br from-brand-dark to-brand overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container-custom">
            <div className="max-w-3xl space-y-6 animate-pulse">
              <div className="h-4 w-24 bg-white/20 rounded" />
              <div className="space-y-3">
                <div className="h-10 w-3/4 bg-white/20 rounded" />
                <div className="h-10 w-1/2 bg-white/20 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-full bg-white/10 rounded" />
                <div className="h-5 w-2/3 bg-white/10 rounded" />
              </div>
              <div className="h-12 w-40 bg-white/15 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="container-custom py-16 space-y-16">
        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse text-center space-y-3">
              <div className="h-12 w-12 mx-auto bg-gray-200 rounded-full" />
              <div className="h-8 w-20 mx-auto bg-gray-200 rounded" />
              <div className="h-4 w-16 mx-auto bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* Sectors skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-50 rounded-xl p-6 space-y-3">
              <div className="h-10 w-10 bg-gray-200 rounded" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* News skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-48 bg-gray-200" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-5 w-full bg-gray-200 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
                <div className="h-3 w-2/3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, isLoading } = useHomepage() as { data: Record<string, any> | undefined; isLoading: boolean };

  if (isLoading) return <HomeLoading />;

  return (
    <>
      <HeroSlider slides={data?.heroSlides} />
      <Journey journey={data?.journey} />
      <StatsCounter stats={data?.stats} />
      <SectorsGrid sectors={data?.sectors} />
      <LatestNews news={data?.news} />
      <ImpactStories stories={data?.impactStories} />
      <GetInvolvedCTA />
      <Partners partners={data?.partnerLogos} />
    </>
  );
}
