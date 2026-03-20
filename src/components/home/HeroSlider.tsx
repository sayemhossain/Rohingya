"use client";

import { useState, useEffect, useCallback } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface Slide {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  gradient?: string;
  image?: string;
}

export default function HeroSlider({ slides }: { slides?: Slide[] | null }) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const items = slides && slides.length > 0 ? slides : [];

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === current || items.length === 0) return;
      setIsTransitioning(true);
      setCurrent(index);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [current, isTransitioning, items.length]
  );

  const next = useCallback(() => {
    if (items.length === 0) return;
    goTo((current + 1) % items.length);
  }, [current, goTo, items.length]);

  const prev = useCallback(() => {
    if (items.length === 0) return;
    goTo((current - 1 + items.length) % items.length);
  }, [current, goTo, items.length]);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, items.length]);

  // No slides yet — show nothing (parent handles loading)
  if (items.length === 0) return null;

  return (
    <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
      {items.map((slide, index) => {
        const gradient = slide.gradient || "from-brand-dark to-brand";
        const hasImage = !!slide.image;

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              !hasImage ? `bg-gradient-to-br ${gradient}` : ""
            } ${
              index === current
                ? "opacity-100 translate-x-0 z-10"
                : index < current
                ? "opacity-0 -translate-x-full z-0"
                : "opacity-0 translate-x-full z-0"
            }`}
            style={
              hasImage
                ? {
                    backgroundImage: `url(${slide.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-10" />

            {/* Content */}
            <div className="relative z-20 h-full flex items-center">
              <div className="container-custom">
                <div className="max-w-3xl">
                  <h1
                    className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 transition-all duration-700 delay-200 ${
                      index === current
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    {slide.title}
                  </h1>
                  <p
                    className={`text-base sm:text-lg md:text-xl text-white/90 mb-8 max-w-2xl leading-relaxed transition-all duration-700 delay-300 ${
                      index === current
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8"
                    }`}
                  >
                    {slide.subtitle}
                  </p>
                  {slide.ctaText && (
                    <a
                      href={slide.ctaLink}
                      className={`btn-accent inline-block px-8 py-3 rounded-md text-white font-semibold text-base md:text-lg bg-brand-accent hover:bg-brand-accent-dark transition-all duration-700 delay-[400ms] ${
                        index === current
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                    >
                      {slide.ctaText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-colors duration-300"
          >
            <HiChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-colors duration-300"
          >
            <HiChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots */}
      {items.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`rounded-full transition-all duration-300 ${
                index === current
                  ? "w-10 h-3 bg-brand-accent"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
