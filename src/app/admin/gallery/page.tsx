"use client";

import { useState, useEffect, FormEvent, useRef } from "react";
import Image from "next/image";
import {
  HiPlus,
  HiTrash,
  HiPencil,
  HiX,
  HiPhotograph,
  HiStar,
  HiUpload,
} from "react-icons/hi";

interface GalleryItem {
  _id: string;
  title: string;
  caption: string;
  imageUrl: string;
  category: "Camps" | "Education" | "Health" | "Community" | "General";
  featured: boolean;
  order: number;
  createdAt: string;
}

const CATEGORIES = [
  "Camps",
  "Education",
  "Health",
  "Community",
  "General",
] as const;

const categoryColors: Record<string, string> = {
  Camps: "bg-amber-100 text-amber-700",
  Education: "bg-blue-100 text-blue-700",
  Health: "bg-red-100 text-red-700",
  Community: "bg-purple-100 text-purple-700",
  General: "bg-gray-100 text-gray-700",
};

const emptyForm = {
  title: "",
  caption: "",
  imageUrl: "",
  category: "General" as GalleryItem["category"],
  featured: false,
};

function isRealImage(url: string) {
  return url && url.startsWith("http");
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState({ msg: "", type: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const showFeedback = (msg: string, type: "success" | "error") => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback({ msg: "", type: "" }), 3000);
  };

  const openNewForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreviewUrl(null);
    setShowForm(true);
  };

  const openEditForm = (item: GalleryItem) => {
    setEditingId(item._id);
    setForm({
      title: item.title,
      caption: item.caption || "",
      imageUrl: item.imageUrl,
      category: item.category,
      featured: item.featured,
    });
    setPreviewUrl(isRealImage(item.imageUrl) ? item.imageUrl : null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setPreviewUrl(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
        setPreviewUrl(data.url);
      } else {
        showFeedback("Upload failed: " + (data.error || "Unknown error"), "error");
        setPreviewUrl(null);
      }
    } catch {
      showFeedback("Failed to upload image", "error");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showFeedback("Title is required", "error");
      return;
    }
    setSaving(true);

    try {
      if (editingId) {
        // Update existing
        const res = await fetch("/api/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: editingId, ...form }),
        });
        const data = await res.json();
        if (data.success) {
          setItems((prev) => prev.map((i) => (i._id === editingId ? data.data : i)));
          showFeedback("Photo updated successfully", "success");
          closeForm();
        } else {
          showFeedback("Failed to update: " + (data.error || ""), "error");
        }
      } else {
        // Create new
        if (!form.imageUrl) {
          showFeedback("Please upload an image first", "error");
          setSaving(false);
          return;
        }
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (data.success) {
          setItems((prev) => [data.data, ...prev]);
          showFeedback("Photo added successfully", "success");
          closeForm();
        } else {
          showFeedback("Failed to save: " + (data.error || ""), "error");
        }
      }
    } catch {
      showFeedback("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        showFeedback("Photo deleted", "success");
      } else {
        showFeedback("Failed to delete", "error");
      }
    } catch {
      showFeedback("Failed to delete", "error");
    }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: item._id, featured: !item.featured }),
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.map((i) => (i._id === item._id ? data.data : i)));
      }
    } catch {
      showFeedback("Failed to update", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
          <p className="text-sm text-gray-500">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-heading">Manage Gallery</h1>
          <p className="mt-1 text-sm text-gray-500">
            {items.length} photo{items.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button
          onClick={openNewForm}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90"
        >
          <HiPlus className="h-5 w-5" />
          Upload Photo
        </button>
      </div>

      {/* Feedback */}
      {feedback.msg && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.msg}
        </div>
      )}

      {/* Form (Add / Edit) */}
      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 font-heading">
              {editingId ? "Edit Photo" : "Upload New Photo"}
            </h2>
            <button onClick={closeForm} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <HiX className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Image {!editingId && "*"}
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-colors hover:border-brand hover:bg-brand/5"
              >
                {previewUrl ? (
                  <div className="relative h-48 w-full overflow-hidden rounded-lg">
                    <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <HiUpload className="mb-2 h-8 w-8 text-gray-400 group-hover:text-brand" />
                    <p className="text-sm text-gray-500">
                      {editingId ? "Click to change image" : "Click to upload an image"}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP up to 10MB</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Photo title"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as GalleryItem["category"] })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Caption</label>
                <textarea
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                  placeholder="Brief caption for this photo"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  Featured photo
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Photo"
                ) : (
                  "Save Photo"
                )}
              </button>
              <button type="button" onClick={closeForm} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <HiPhotograph className="mb-3 h-12 w-12 text-gray-300" />
          <h3 className="text-sm font-medium text-gray-900">No photos yet</h3>
          <p className="mt-1 text-sm text-gray-500">Upload your first photo to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item._id} className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {isRealImage(item.imageUrl) ? (
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/20 to-brand-accent/20">
                    <HiPhotograph className="h-12 w-12 text-brand/40" />
                  </div>
                )}

                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-medium text-white">
                    <HiStar className="h-3 w-3" />
                    Featured
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="truncate text-sm font-semibold text-gray-900">{item.title}</h3>
                {item.caption && (
                  <p className="mt-0.5 truncate text-xs text-gray-500">{item.caption}</p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[item.category] || "bg-gray-100 text-gray-700"}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action buttons — always visible */}
              <div className="flex items-center border-t border-gray-100">
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`flex flex-1 items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                    item.featured
                      ? "text-yellow-600 hover:bg-yellow-50"
                      : "text-gray-400 hover:bg-gray-50 hover:text-yellow-600"
                  }`}
                  title={item.featured ? "Unfeature" : "Feature"}
                >
                  <HiStar className="h-3.5 w-3.5" />
                  {item.featured ? "Featured" : "Feature"}
                </button>
                <div className="w-px self-stretch bg-gray-100" />
                <button
                  onClick={() => openEditForm(item)}
                  className="flex flex-1 items-center justify-center gap-1 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  title="Edit"
                >
                  <HiPencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <div className="w-px self-stretch bg-gray-100" />
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex flex-1 items-center justify-center gap-1 py-2 text-xs font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Delete"
                >
                  <HiTrash className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
