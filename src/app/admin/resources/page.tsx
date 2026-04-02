"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiX,
  HiDocumentText,
  HiDownload,
} from "react-icons/hi";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface Resource {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: "PDF" | "XLSX" | "DOC" | "PPT";
  category: "Reports" | "Data Sheets" | "Guidelines" | "Publications";
  fileSize: string;
  published: boolean;
  createdAt: string;
}

const FILE_TYPES = ["PDF", "XLSX", "DOC", "PPT"] as const;
const CATEGORIES = ["Reports", "Data Sheets", "Guidelines", "Publications"] as const;

const emptyForm = {
  title: "",
  description: "",
  fileUrl: "",
  fileType: "PDF" as Resource["fileType"],
  category: "Reports" as Resource["category"],
  fileSize: "",
  published: true,
};

const typeBadgeColors: Record<string, string> = {
  PDF: "bg-red-100 text-red-700",
  XLSX: "bg-green-100 text-green-700",
  DOC: "bg-blue-100 text-blue-700",
  PPT: "bg-orange-100 text-orange-700",
};

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/resources?limit=100&all=true");
      const data = await res.json();
      if (data.success) {
        setResources(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (resource: Resource) => {
    setEditingId(resource._id);
    setForm({
      title: resource.title,
      description: resource.description || "",
      fileUrl: resource.fileUrl,
      fileType: resource.fileType,
      category: resource.category,
      fileSize: resource.fileSize || "",
      published: resource.published,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const res = await fetch("/api/resources", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editingId, ...form }),
        });
        const data = await res.json();
        if (data.success) {
          setResources((prev) =>
            prev.map((r) => (r._id === editingId ? data.data : r))
          );
          closeForm();
        }
      } else {
        const res = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setResources((prev) => [data.data, ...prev]);
          closeForm();
        }
      }
    } catch (err) {
      console.error("Failed to save resource:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const res = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const data = await res.json();
      if (data.success) {
        setResources((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete resource:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-sm text-gray-500">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">
            Manage Resources
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {resources.length} resource{resources.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          <HiPlus className="h-5 w-5" />
          Add Resource
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 font-heading">
              {editingId ? "Edit Resource" : "Add New Resource"}
            </h2>
            <button
              onClick={closeForm}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Resource title"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <RichTextEditor
                  value={form.description}
                  onChange={(val) => setForm({ ...form, description: val })}
                  placeholder="Brief description of this resource"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  File URL *
                </label>
                <input
                  type="url"
                  required
                  value={form.fileUrl}
                  onChange={(e) =>
                    setForm({ ...form, fileUrl: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="https://example.com/file.pdf"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  File Type
                </label>
                <select
                  value={form.fileType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      fileType: e.target.value as Resource["fileType"],
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {FILE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as Resource["category"],
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  File Size
                </label>
                <input
                  type="text"
                  value={form.fileSize}
                  onChange={(e) =>
                    setForm({ ...form, fileSize: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="e.g. 2.5 MB"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      setForm({ ...form, published: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  Published
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Resource"
                ) : (
                  "Save Resource"
                )}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resources Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <HiDocumentText className="mb-3 h-12 w-12 text-gray-300" />
            <h3 className="text-sm font-medium text-gray-900">
              No resources yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first resource to get started.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500">Title</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Type</th>
                  <th className="px-6 py-3 font-medium text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-500">Size</th>
                  <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                  <th className="px-6 py-3 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.map((resource) => (
                  <tr
                    key={resource._id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                          <HiDocumentText className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-gray-900">
                            {resource.title}
                          </p>
                          {resource.fileUrl && (
                            <a
                              href={resource.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
                            >
                              <HiDownload className="h-3 w-3" />
                              Download
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          typeBadgeColors[resource.fileType] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {resource.fileType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {resource.category}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {resource.fileSize || "--"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          resource.published
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {resource.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(resource)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand"
                          title="Edit"
                        >
                          <HiPencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(resource._id)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
