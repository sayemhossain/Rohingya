"use client";

import { useState } from "react";
import { useGallery } from "@/hooks/use-api";
import Link from "next/link";
import Image from "next/image";
import { HiChevronRight, HiX } from "react-icons/hi";

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

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const { data: galleryItems = [], isLoading: loading, isError } = useGallery() as unknown as { data: GalleryItem[]; isLoading: boolean; isError: boolean };
  const error = isError ? "Failed to load gallery items." : "";

  // Derive categories from fetched data
  const categorySet = new Set(galleryItems.map((item) => item.category));
  const categories =
    categorySet.size > 0
      ? ["All", ...Array.from(categorySet)]
      : defaultCategories;

  const filtered =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand to-brand-light py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <HiChevronRight className="mx-2 w-4 h-4" />
            <span className="text-white font-medium">Gallery</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Photo Gallery
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Visual stories from the Rohingya humanitarian response — documenting
            resilience, recovery, and the daily lives of refugees in Bangladesh.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  activeFilter === cat
                    ? "bg-brand text-white"
                    : "bg-white text-gray-600 hover:bg-brand/10 hover:text-brand border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
              <p className="text-gray-500 mt-4">Loading gallery...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && galleryItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No gallery items available yet. Check back soon.
              </p>
            </div>
          )}

          {/* Masonry-like Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filtered.map((item, index) => (
                <button
                  key={item._id}
                  onClick={() => setLightbox(item)}
                  className={`relative w-full rounded-xl overflow-hidden group cursor-pointer break-inside-avoid block ${
                    index % 3 === 0 ? "h-80" : "h-56"
                  }`}
                >
                  {/* Image or gradient fallback */}
                  {item.imageUrl && item.imageUrl.startsWith("http") ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.caption || item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${
                      item.category === "Camps" ? "from-amber-600 to-orange-500" :
                      item.category === "Education" ? "from-teal-600 to-emerald-500" :
                      item.category === "Health" ? "from-cyan-600 to-blue-500" :
                      item.category === "Community" ? "from-emerald-600 to-green-500" :
                      "from-brand to-brand-accent"
                    }`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white/20 text-7xl font-bold">
                          {item.category.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                    <div className="p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 w-full">
                      <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
                        {item.category}
                      </span>
                      <p className="text-white text-sm mt-1 leading-snug">
                        {item.caption || item.title}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>

            {/* Large Image or Gradient */}
            <div className="w-full h-[60vh] relative flex items-center justify-center">
              {lightbox.imageUrl && lightbox.imageUrl.startsWith("http") ? (
                <Image
                  src={lightbox.imageUrl}
                  alt={lightbox.caption || lightbox.title}
                  fill
                  className="object-contain bg-black"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${
                  lightbox.category === "Camps" ? "from-amber-600 to-orange-500" :
                  lightbox.category === "Education" ? "from-teal-600 to-emerald-500" :
                  lightbox.category === "Health" ? "from-cyan-600 to-blue-500" :
                  lightbox.category === "Community" ? "from-emerald-600 to-green-500" :
                  "from-brand to-brand-accent"
                } flex items-center justify-center`}>
                  <span className="text-white/20 text-9xl font-bold">
                    {lightbox.category.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Caption Bar */}
            <div className="bg-white p-5">
              <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
                {lightbox.category}
              </span>
              <p className="text-dark font-medium mt-1">
                {lightbox.caption || lightbox.title}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
