"use client";

import { useState, useEffect, useCallback } from "react";
import { useGallery } from "@/hooks/use-api";
import Link from "next/link";
import Image from "next/image";
import { HiChevronRight, HiChevronLeft, HiX, HiZoomIn } from "react-icons/hi";

interface GalleryItem {
  _id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  order: number;
}

const defaultCategories = ["All", "Camps", "Education", "Health", "Community"];

const categoryGradient = (category: string) =>
  category === "Camps" ? "from-amber-600 to-orange-500" :
  category === "Education" ? "from-teal-600 to-emerald-500" :
  category === "Health" ? "from-cyan-600 to-blue-500" :
  category === "Community" ? "from-emerald-600 to-green-500" :
  "from-brand to-brand-accent";

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { data: galleryItems = [], isLoading: loading, isError } = useGallery() as unknown as { data: GalleryItem[]; isLoading: boolean; isError: boolean };
  const error = isError ? "Failed to load gallery items." : "";

  const categorySet = new Set(galleryItems.map((item) => item.category));
  const categories = categorySet.size > 0 ? ["All", ...Array.from(categorySet)] : defaultCategories;

  const filtered =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const count = (cat: string) =>
    cat === "All" ? galleryItems.length : galleryItems.filter((i) => i.category === cat).length;

  // Reset lightbox when the filter changes (indices would no longer match).
  useEffect(() => { setLightbox(null); }, [activeFilter]);

  const close = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
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
  }, [lightbox, close, prev, next]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-brand-light py-20 md:py-28">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
        <div className="container-custom relative z-10">
          <nav className="mb-6 flex items-center text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <HiChevronRight className="mx-2 h-4 w-4" />
            <span className="font-medium text-white">Gallery</span>
          </nav>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Photo Gallery</h1>
          <p className="max-w-2xl text-lg text-white/80">
            Visual stories from AROHI&apos;s programs — documenting community
            empowerment, development, and impact across Barisal Division.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-gradient-to-b from-white to-gray-50">
        <div className="container-custom">
          {/* Filter Tabs */}
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  activeFilter === cat
                    ? "bg-gradient-to-r from-brand to-brand-accent text-white shadow-md shadow-brand/20"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-brand/40 hover:text-brand"
                }`}
              >
                {cat}
                <span className={`rounded-full px-1.5 text-[11px] ${activeFilter === cat ? "bg-white/20" : "bg-gray-100 text-gray-500"}`}>
                  {count(cat)}
                </span>
              </button>
            ))}
          </div>

          {loading && (
            <div className="py-16 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand/30 border-t-brand" />
              <p className="mt-4 text-gray-500">Loading gallery...</p>
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center"><p className="text-lg text-gray-500">{error}</p></div>
          )}

          {!loading && !error && galleryItems.length === 0 && (
            <div className="py-16 text-center"><p className="text-lg text-gray-500">No gallery items available yet. Check back soon.</p></div>
          )}

          {/* Masonry grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
              {filtered.map((item, index) => {
                const isHttp = item.imageUrl && item.imageUrl.startsWith("http");
                return (
                  <button
                    key={item._id}
                    onClick={() => setLightbox(index)}
                    className={`group relative block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                      index % 5 === 0 ? "h-80" : index % 3 === 0 ? "h-72" : "h-56"
                    }`}
                  >
                    {isHttp ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.caption || item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradient(item.category)}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-7xl font-bold text-white/20">{item.category.charAt(0)}</span>
                        </div>
                      </div>
                    )}

                    {/* Gradient + hover wash */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Category chip */}
                    <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/30">
                      {item.category}
                    </span>

                    {/* Zoom button */}
                    <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 scale-90 items-center justify-center rounded-full bg-white/20 text-white opacity-0 ring-1 ring-white/40 backdrop-blur-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                      <HiZoomIn className="h-4 w-4" />
                    </span>

                    {/* Caption */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="text-sm font-medium leading-snug text-white">{item.caption || item.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {current && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md" onClick={close}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-medium text-white/70">
              {lightbox! + 1} <span className="text-white/40">/ {filtered.length}</span>
            </span>
            <button onClick={close} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
              <HiX className="h-6 w-6" />
            </button>
          </div>

          {/* Stage */}
          <div className="relative flex flex-1 items-center justify-center px-4 sm:px-16">
            {filtered.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-5">
                  <HiChevronLeft className="h-7 w-7" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-5">
                  <HiChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            <figure className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
              {current.imageUrl && current.imageUrl.startsWith("http") ? (
                <Image key={current._id} src={current.imageUrl} alt={current.caption || current.title} fill sizes="100vw" className="object-contain" />
              ) : (
                <div className={`flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br ${categoryGradient(current.category)}`}>
                  <span className="text-9xl font-bold text-white/20">{current.category.charAt(0)}</span>
                </div>
              )}
            </figure>
          </div>

          {/* Caption + thumbnails */}
          <div className="px-4 pb-5 pt-2 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <p className="mx-auto mb-3 max-w-3xl text-center text-sm text-white/80">
              <span className="font-semibold text-brand-accent">{current.category}</span>
              <span className="mx-2 text-white/30">·</span>
              {current.caption || current.title}
            </p>
            {filtered.length > 1 && (
              <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {filtered.map((item, i) => (
                  <button
                    key={`thumb-${item._id}`}
                    onClick={() => setLightbox(i)}
                    aria-label={`Go to image ${i + 1}`}
                    className={`relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${i === lightbox ? "opacity-100 ring-brand-accent" : "opacity-50 ring-transparent hover:opacity-90"}`}
                  >
                    {item.imageUrl && item.imageUrl.startsWith("http") ? (
                      <Image src={item.imageUrl} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${categoryGradient(item.category)}`} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
