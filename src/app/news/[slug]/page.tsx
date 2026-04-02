"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiCalendar,
  HiUser,
  HiTag,
  HiChevronRight,
  HiArrowLeft,
  HiShare,
} from "react-icons/hi";
import { useNewsArticle, useNewsList } from "@/hooks/use-api";

const gradientMap: Record<string, string> = {
  Education: "from-teal-600 to-emerald-500",
  Health: "from-cyan-600 to-teal-500",
  Protection: "from-sky-600 to-cyan-500",
  Community: "from-emerald-600 to-green-500",
  General: "from-brand to-brand-light",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: article, isLoading, isError } = useNewsArticle(slug) as { data: Record<string, any> | undefined; isLoading: boolean; isError: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allArticles = [] } = useNewsList() as { data: Record<string, any>[] };

  const relatedArticles = article
    ? allArticles
        .filter((a) => a.category === article.category && a.slug !== slug)
        .slice(0, 3)
    : [];

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );

  if (isError || !article) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
        <p className="text-gray-500 mb-6">The article you are looking for does not exist or has been removed.</p>
        <Link href="/news" className="text-brand font-medium hover:text-brand-accent transition-colors">
          <HiArrowLeft className="inline w-4 h-4 mr-1" />
          Back to News & Stories
        </Link>
      </div>
    </div>
  );

  const gradient = gradientMap[article.category] || gradientMap.General;

  const htmlContent = article.content || "";

  return (
    <>
      {/* Hero Image Area */}
      <section
        className={`relative py-24 md:py-32 ${
          article.image ? "" : `bg-gradient-to-br ${gradient}`
        }`}
        style={
          article.image
            ? {
                backgroundImage: `url(${article.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <HiChevronRight className="w-4 h-4 mx-2" />
            <Link href="/news" className="hover:text-white transition-colors">
              News & Stories
            </Link>
            <HiChevronRight className="w-4 h-4 mx-2" />
            <span className="text-white">{article.category}</span>
          </nav>

          {/* Category Badge */}
          <span className="inline-block bg-brand-accent text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            {article.category}
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white max-w-4xl leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 mt-6 text-white/80 text-sm">
            {article.author && (
              <div className="flex items-center gap-2">
                <HiUser className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <HiCalendar className="w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <HiTag className="w-4 h-4" />
              <span>{article.category}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content + Sidebar */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="prose prose-lg max-w-none">
                <div
                  className="prose prose-gray max-w-none [&>p]:text-gray-700 [&>p]:leading-relaxed [&>p]:mb-6"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </article>

              {/* Share Section */}
              <div className="border-t border-gray-200 mt-10 pt-8">
                <div className="flex items-center gap-3">
                  <HiShare className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    Share this article:
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-sm font-bold hover:opacity-80 transition-opacity">
                      f
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center text-sm font-bold hover:opacity-80 transition-opacity">
                      t
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-sm font-bold hover:opacity-80 transition-opacity">
                      in
                    </button>
                    <button className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center text-sm font-bold hover:opacity-80 transition-opacity">
                      w
                    </button>
                  </div>
                </div>
              </div>

              {/* Back to News */}
              <div className="mt-8">
                <Link
                  href="/news"
                  className="inline-flex items-center text-brand font-medium hover:text-brand-accent transition-colors"
                >
                  <HiArrowLeft className="w-4 h-4 mr-2" />
                  Back to News & Stories
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="text-lg font-bold text-dark mb-6">
                  Related Articles
                </h3>
                {relatedArticles.length === 0 ? (
                  <p className="text-gray-500 text-sm">No related articles found.</p>
                ) : (
                  <div className="space-y-5">
                    {relatedArticles.map(
                      (related) => {
                        const relGradient =
                          gradientMap[related.category] || gradientMap.General;
                        return (
                          <Link
                            key={related._id}
                            href={`/news/${related.slug}`}
                            className="block group"
                          >
                            <div className="flex gap-4">
                              {/* Mini thumbnail */}
                              <div
                                className={`w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative ${
                                  !related.image
                                    ? `bg-gradient-to-br ${relGradient}`
                                    : ""
                                }`}
                              >
                                {related.image ? (
                                  <Image
                                    src={related.image}
                                    alt={related.title}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <span className="text-white/30 text-xl font-bold">
                                    {related.category.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs text-brand-accent font-semibold">
                                  {related.category}
                                </span>
                                <h4 className="text-sm font-semibold text-dark leading-snug group-hover:text-brand transition-colors line-clamp-2">
                                  {related.title}
                                </h4>
                                <span className="text-xs text-gray-500 mt-1 block">
                                  {formatDate(related.createdAt)}
                                </span>
                              </div>
                            </div>
                          </Link>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
