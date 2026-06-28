"use client";

import { useState } from "react";
import Image from "next/image";

interface JourneyData {
  label?: string;
  title?: string;
  body?: string;
  image?: string;
}

export default function Journey({ journey }: { journey?: JourneyData | null }) {
  const [expanded, setExpanded] = useState(false);

  // No content yet — render nothing (parent handles loading)
  if (!journey || (!journey.body && !journey.title)) return null;

  const title = journey.title || "Journey of AROHI";

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Text Content */}
          <div>
            {journey.label && (
              <span className="inline-block text-sm font-semibold uppercase tracking-wide text-brand-accent mb-3">
                {journey.label}
              </span>
            )}
            <h2 className="section-title">{title}</h2>

            {journey.body && (
              <div
                className={`text-dark-light text-lg leading-relaxed [&>p]:mb-6 transition-all duration-500 ${
                  expanded ? "" : "line-clamp-[8] overflow-hidden"
                }`}
                dangerouslySetInnerHTML={{ __html: journey.body }}
              />
            )}

            {journey.body && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="btn-outline mt-4 inline-block"
              >
                {expanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>

          {/* Right Side - Image (pinned to top, sticks while reading) */}
          <div className="relative lg:sticky lg:top-24">
            <div className="rounded-2xl overflow-hidden aspect-[4/3] relative">
              {journey.image ? (
                <Image
                  src={journey.image}
                  alt={title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center">
                  <div className="text-center text-white/80 p-8">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 opacity-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium">{title}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
