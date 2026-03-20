"use client";

import { useState, useEffect, useCallback } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const stories = [
  {
    id: 1,
    quote:
      "Thanks to the education program, my children can now read and write. For the first time since we fled, I feel hope for their future.",
    name: "Fatima Begum",
    role: "Mother of three, Camp 14",
    gradient: "from-brand to-teal-700",
  },
  {
    id: 2,
    quote:
      "The skills training gave me the ability to support my family. I now work as a tailor and earn enough to provide for my children every day.",
    name: "Mohammed Rahim",
    role: "Vocational Training Graduate, Camp 8",
    gradient: "from-teal-700 to-brand-accent",
  },
  {
    id: 3,
    quote:
      "When the mobile clinic came to our area, they detected my daughter's illness early. The doctors saved her life. We are forever grateful.",
    name: "Rashida Khatun",
    role: "Healthcare Beneficiary, Camp 21",
    gradient: "from-brand-accent to-emerald-600",
  },
];

export default function ImpactStories() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % stories.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + stories.length) % stories.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next]);

  const story = stories[current];

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Impact Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Real voices from the community — stories of resilience, hope, and
            the difference humanitarian support makes every day.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Gradient Image Placeholder */}
              <div
                className={`h-64 md:h-auto min-h-[280px] bg-gradient-to-br ${story.gradient} relative flex items-center justify-center`}
              >
                <svg
                  className="w-20 h-20 text-white/20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
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
                  <p className="text-gray-500 text-sm">{story.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow Buttons */}
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
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {stories.map((_, idx) => (
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
      </div>
    </section>
  );
}
