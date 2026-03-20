"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiNewspaper,
} from "react-icons/hi";

interface NewsArticle {
  _id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  date: string;
  published: boolean;
  image?: string;
}

const categoryColors: Record<string, string> = {
  Education: "bg-blue-100 text-blue-700",
  Health: "bg-green-100 text-green-700",
  Protection: "bg-purple-100 text-purple-700",
  Community: "bg-orange-100 text-orange-700",
  General: "bg-gray-100 text-gray-700",
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/news?limit=100");
      const data = await res.json();
      setArticles(data.articles ?? data ?? []);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/news/${slug}`, { method: "DELETE" });
      if (res.ok) {
        fetchArticles();
      } else {
        alert("Failed to delete article.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete article.");
    }
  };

  const filtered = articles.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
            <HiNewspaper className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage News</h1>
            <p className="text-sm text-gray-500">
              {articles.length} article{articles.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
        >
          <HiPlus className="h-4 w-4" />
          Add New Article
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              <p className="text-sm text-gray-500">Loading articles...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <HiNewspaper className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              {search ? "No articles match your search." : "No articles yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Author
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Published
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((article) => (
                  <tr
                    key={article._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="max-w-xs truncate px-4 py-3 font-medium text-gray-900">
                      {article.title}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          categoryColors[article.category] ??
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {article.author}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          article.published ? "bg-green-500" : "bg-gray-300"
                        }`}
                        title={article.published ? "Published" : "Draft"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/news/edit/${article.slug}`}
                          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-brand/10 hover:text-brand"
                          title="Edit"
                        >
                          <HiPencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(article.slug, article.title)
                          }
                          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                          title="Delete"
                        >
                          <HiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
