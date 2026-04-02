import Link from "next/link";
import Image from "next/image";
import { HiCalendar, HiArrowRight } from "react-icons/hi";

interface NewsItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
  category: string;
  createdAt: string;
}

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

export default function LatestNews({ news }: { news?: NewsItem[] }) {
  if (!news || news.length === 0) return null;
  const items = news;

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="section-title">Latest News & Updates</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg">
            Stay informed about the latest developments, programs,
            and stories from AROHI&apos;s community development work.
          </p>
        </div>

        {/* News Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => {
            const gradient =
              gradientMap[item.category] || gradientMap.General;
            return (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image or Gradient Placeholder */}
                <div
                  className={`h-48 rounded-t-xl relative overflow-hidden ${
                    !item.image ? `bg-gradient-to-br ${gradient}` : ""
                  }`}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/30 text-6xl font-bold">
                        {item.category.charAt(0)}
                      </span>
                    </div>
                  )}
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-brand-accent text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                    {item.category}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Date */}
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <HiCalendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold text-dark mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {item.excerpt}
                  </p>

                  {/* Read More Link */}
                  <Link
                    href={`/news/${item.slug}`}
                    className="inline-flex items-center text-brand font-medium text-sm hover:text-brand-accent transition-colors"
                  >
                    Read More
                    <HiArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/news" className="btn-outline inline-flex items-center gap-2">
            View All News
            <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
