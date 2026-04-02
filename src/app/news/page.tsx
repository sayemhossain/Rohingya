"use client";

import { useState } from "react";
import { useNewsList } from "@/hooks/use-api";
import Link from "next/link";
import Image from "next/image";
import { HiCalendar, HiArrowRight, HiChevronRight } from "react-icons/hi";

const gradientMap: Record<string, string> = {
  Education: "from-teal-600 to-emerald-500",
  Health: "from-cyan-600 to-teal-500",
  Protection: "from-sky-600 to-cyan-500",
  Community: "from-emerald-600 to-green-500",
  General: "from-brand to-brand-light",
  Agriculture: "from-lime-600 to-green-500",
  WaSH: "from-blue-500 to-cyan-500",
  Nutrition: "from-red-500 to-rose-500",
  DRR: "from-amber-500 to-orange-500",
  "Climate Change": "from-yellow-500 to-amber-500",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: articles = [], isLoading } = useNewsList() as { data: Record<string, any>[]; isLoading: boolean };
  const [activeCategory, setActiveCategory] = useState("All");

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );

  // Derive categories from articles
  const categorySet = new Set<string>(articles.map((a) => a.category));
  const categories = ["All", ...Array.from(categorySet)];

  const filtered = activeCategory === "All"
    ? articles
    : articles.filter((a) => a.category === activeCategory);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-brand-dark via-brand to-brand-light py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
        <div className="container-custom relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            News & Stories
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mb-6">
            Stay informed about the latest developments, programs,
            and inspiring stories from AROHI&apos;s community development work.
          </p>
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-white/60">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <HiChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">News & Stories</span>
          </nav>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="container-custom">
          <div className="flex items-center gap-2 overflow-x-auto py-4 -mb-px">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === activeCategory
                    ? "bg-brand text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {activeCategory === "All"
                  ? "No articles published yet. Check back soon for updates."
                  : `No articles found in "${activeCategory}" category.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((article) => {
                const gradient =
                  gradientMap[article.category] || gradientMap.General;
                return (
                  <article
                    key={article._id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
                  >
                    {/* Image or Gradient Placeholder */}
                    <div
                      className={`h-48 relative overflow-hidden ${
                        !article.image
                          ? `bg-gradient-to-br ${gradient}`
                          : ""
                      }`}
                    >
                      {article.image ? (
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/20 text-7xl font-bold">
                            {article.category.charAt(0)}
                          </span>
                        </div>
                      )}
                      {/* Category Badge */}
                      <span className="absolute top-4 left-4 bg-brand-accent text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                        {article.category}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      {/* Date */}
                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <HiCalendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{formatDate(article.createdAt)}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-semibold text-dark mb-2 leading-snug group-hover:text-brand transition-colors">
                        <Link href={`/news/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>

                      {/* Read More */}
                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center text-brand font-medium text-sm hover:text-brand-accent transition-colors"
                      >
                        Read More
                        <HiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
