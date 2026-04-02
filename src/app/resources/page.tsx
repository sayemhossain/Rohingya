"use client";

import { useResources } from "@/hooks/use-api";
import Link from "next/link";
import {
  HiDocumentText,
  HiDownload,
  HiCalendar,
  HiChevronRight,
} from "react-icons/hi";

const gradientMap: Record<string, string> = {
  Reports: "from-brand to-brand-light",
  "Data Sheets": "from-emerald-600 to-green-500",
  Guidelines: "from-brand-dark to-brand",
  Publications: "from-emerald-700 to-teal-500",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ResourceCard({
  resource,
}: {
  resource: {
    _id: string;
    title: string;
    description: string;
    category: string;
    fileType: string;
    fileSize: string;
    fileUrl: string;
    createdAt: string;
  };
}) {
  const isExcel = resource.fileType === "XLSX";
  const gradient = gradientMap[resource.category] || gradientMap.Reports;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 group">
      <div className="p-6">
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
          >
            <HiDocumentText className="text-white text-xl" />
          </div>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              isExcel
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {resource.fileType}
          </span>
        </div>

        {/* Category */}
        <span className="text-xs font-medium text-brand-accent uppercase tracking-wider">
          {resource.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-semibold text-dark mt-1 mb-2 leading-snug group-hover:text-brand transition-colors">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
          {resource.description}
        </p>

        {/* Meta + Download */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <HiCalendar className="w-3.5 h-3.5" />
              {formatDate(resource.createdAt)}
            </span>
            {resource.fileSize && (
              <>
                <span className="text-gray-300">|</span>
                <span>{resource.fileSize}</span>
              </>
            )}
          </div>
          <a
            href={resource.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-accent transition-colors"
          >
            <HiDownload className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: resources = [], isLoading } = useResources() as { data: Record<string, any>[]; isLoading: boolean };

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );

  // Derive categories from resources
  const categorySet = new Set<string>(
    resources.map((r) => r.category)
  );
  const categories = ["All", ...Array.from(categorySet)];

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
            <span className="text-white font-medium">Resources</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Resources & Reports
          </h1>
          <p className="text-lg text-white/80 max-w-2xl">
            Access key documents, data sheets, and publications from
            AROHI&apos;s development programs. Download reports to stay informed on
            progress and priorities.
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  cat === "All"
                    ? "bg-brand text-white"
                    : "bg-white text-gray-600 hover:bg-brand/10 hover:text-brand border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          {resources.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No resources available at the moment. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map(
                (resource) => (
                  <ResourceCard key={resource._id} resource={resource as { _id: string; title: string; description: string; category: string; fileType: string; fileSize: string; fileUrl: string; createdAt: string }} />
                )
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
