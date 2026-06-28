"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface Story {
  image?: string;
  quote: string;
  name: string;
  designation: string;
}

const gradients = [
  "from-brand to-teal-700",
  "from-teal-700 to-brand-accent",
  "from-brand-accent to-emerald-600",
];

export default function ImpactStories({ stories }: { stories?: Story[] | null }) {
  const [current, setCurrent] = useState(0);

  const items = stories && stories.length > 0 ? stories : [];

  const next = useCallback(() => {
    if (items.length === 0) return;
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prev = useCallback(() => {
    if (items.length === 0) return;
    setCurrent((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, items.length]);

  // No stories yet — render nothing (no fallback data)
  if (items.length === 0) return null;

  const story = items[current];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Impact Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Real voices from the community — stories of resilience, hope, and
            the difference community development support makes every day.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image (or gradient placeholder if none) */}
              <div className="relative h-64 md:h-auto min-h-[280px]">
                {story.image ? (
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      gradients[current % gradients.length]
                    } flex items-center justify-center`}
                  >
                    <svg
                      className="w-20 h-20 text-white/20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Quote Content */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <svg
                  className="w-10 h-10 text-brand-accent/30 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-dark text-lg md:text-xl leading-relaxed font-medium italic mb-6">
                  &ldquo;{story.quote}&rdquo;
                </p>

                <div>
                  <p className="font-semibold text-brand text-base">
                    {story.name}
                  </p>
                  <p className="text-gray-500 text-sm">{story.designation}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Buttons */}
          {items.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous story"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-colors"
              >
                <HiChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={next}
                aria-label="Next story"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white w-10 h-10 rounded-full shadow-md flex items-center justify-center text-brand hover:bg-brand hover:text-white transition-colors"
              >
                <HiChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Navigation Dots */}
        {items.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to story ${idx + 1}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === current
                    ? "bg-brand w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
