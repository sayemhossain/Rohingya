"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { HiX, HiChevronLeft, HiChevronRight, HiZoomIn } from "react-icons/hi";

export interface GalleryImage {
  url: string;
  caption?: string;
}

// Bento size pattern (applied at sm+). `grid-flow-dense` backfills the gaps
// left by the larger tiles, so the layout stays tight for any image count.
function tileSpan(i: number): string {
  switch (i % 7) {
    case 0:
      return "sm:col-span-2 sm:row-span-2"; // large feature
    case 4:
      return "sm:row-span-2"; // tall
    case 6:
      return "sm:col-span-2"; // wide
    default:
      return "";
  }
}

/**
 * Smart, modern image gallery with a built-in lightbox.
 * - Bento mosaic layout (varied tile sizes, dense packing — no gaps)
 * - Hover zoom + caption reveal + glass zoom button
 * - Full-screen lightbox with keyboard nav and a thumbnail filmstrip
 */
export default function ProgrammeGallery({
  images,
  title = "Gallery",
  subtitle,
  accent = "from-brand to-brand-accent",
}: {
  images?: GalleryImage[];
  title?: string;
  subtitle?: string;
  accent?: string;
}) {
  const valid = (images ?? []).filter((i) => i && i.url);
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + valid.length) % valid.length)),
    [valid.length]
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % valid.length)),
    [valid.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, prev, next]);

  if (valid.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-10 text-center">
          <span className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            <span className={`h-px w-6 bg-gradient-to-r ${accent}`} />
            {valid.length} photo{valid.length > 1 ? "s" : ""}
            <span className={`h-px w-6 bg-gradient-to-r ${accent}`} />
          </span>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
          {subtitle && <p className="mx-auto mt-3 max-w-2xl text-gray-500">{subtitle}</p>}
        </div>

        {/* Bento mosaic */}
        <div className="grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:gap-4 md:grid-cols-4">
          {valid.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={img.caption || `Open image ${i + 1}`}
              className={`group relative overflow-hidden rounded-2xl bg-gray-200 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:z-10 hover:-translate-y-1 hover:shadow-xl hover:ring-brand-accent/30 ${tileSpan(i)}`}
            >
              <Image
                src={img.url}
                alt={img.caption || `${title} image ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.12]"
              />

              {/* Bottom gradient — always faintly present, deepens on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              {/* Brand wash on hover */}
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${accent} opacity-0 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-25`} />

              {/* Glass zoom button */}
              <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 scale-90 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md ring-1 ring-white/40 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <HiZoomIn className="h-4 w-4" />
              </span>

              {/* Caption */}
              {img.caption && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3.5 text-left text-xs font-medium leading-snug text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {img.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md"
          onClick={close}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-medium text-white/70">
              {active + 1} <span className="text-white/40">/ {valid.length}</span>
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex flex-1 items-center justify-center px-4 sm:px-16">
            {valid.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-5"
                >
                  <HiChevronLeft className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5"
                >
                  <HiChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            <figure className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              <Image
                key={valid[active].url}
                src={valid[active].url}
                alt={valid[active].caption || `Image ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </figure>
          </div>

          {/* Caption + thumbnail filmstrip */}
          <div className="px-4 pb-5 pt-2 sm:px-6" onClick={(e) => e.stopPropagation()}>
            {valid[active].caption && (
              <p className="mx-auto mb-3 max-w-3xl text-center text-sm text-white/80">
                {valid[active].caption}
              </p>
            )}
            {valid.length > 1 && (
              <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {valid.map((img, i) => (
                  <button
                    key={`thumb-${img.url}-${i}`}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                      i === active ? "ring-brand-accent opacity-100" : "ring-transparent opacity-50 hover:opacity-90"
                    }`}
                  >
                    <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
