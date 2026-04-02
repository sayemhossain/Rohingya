"use client";

import { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiX,
  HiChevronUp,
  HiPhotograph,
} from "react-icons/hi";
import RichTextEditor from "@/components/admin/RichTextEditor";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SectorStat {
  label: string;
  value: string;
  icon: string;
}

interface SectorProgram {
  title: string;
  description: string;
}

interface Sector {
  _id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  image: string;
  stats: SectorStat[];
  programs: SectorProgram[];
  achievements: string[];
  order: number;
}

const emptySector: Omit<Sector, "_id"> = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  icon: "",
  image: "",
  stats: [],
  programs: [],
  achievements: [],
  order: 0,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminSectorsPage() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Form state
  const [editingSlug, setEditingSlug] = useState<string | null>(null); // slug of sector being edited, or "__new__" for add
  const [form, setForm] = useState<Omit<Sector, "_id">>(emptySector);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  /* ---------- Fetch sectors ---------- */
  const fetchSectors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sectors");
      const json = await res.json();
      setSectors(json.data ?? []);
    } catch (err) {
      console.error("Failed to fetch sectors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectors();
  }, []);

  /* ---------- Message auto-dismiss ---------- */
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  /* ---------- Open / Close form ---------- */
  const openAddForm = () => {
    setEditingSlug("__new__");
    setForm({ ...emptySector, order: sectors.length });
    setMessage(null);
  };

  const openEditForm = (sector: Sector) => {
    setEditingSlug(sector.slug);
    setForm({
      name: sector.name,
      slug: sector.slug,
      description: sector.description,
      longDescription: sector.longDescription ?? "",
      icon: sector.icon ?? "",
      image: sector.image ?? "",
      stats: sector.stats?.length ? sector.stats : [],
      programs: sector.programs?.length ? sector.programs : [],
      achievements: sector.achievements?.length ? sector.achievements : [],
      order: sector.order ?? 0,
    });
    setMessage(null);
  };

  const closeForm = () => {
    setEditingSlug(null);
    setForm(emptySector);
  };

  /* ---------- Form field handlers ---------- */
  const updateField = (
    field: keyof Omit<Sector, "_id">,
    value: string | number
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from name when adding new
      if (field === "name" && editingSlug === "__new__") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  /* -- Stats -- */
  const addStat = () =>
    setForm((p) => ({
      ...p,
      stats: [...p.stats, { label: "", value: "", icon: "" }],
    }));

  const removeStat = (i: number) =>
    setForm((p) => ({ ...p, stats: p.stats.filter((_, idx) => idx !== i) }));

  const updateStat = (i: number, field: keyof SectorStat, value: string) =>
    setForm((p) => ({
      ...p,
      stats: p.stats.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    }));

  /* -- Programs -- */
  const addProgram = () =>
    setForm((p) => ({
      ...p,
      programs: [...p.programs, { title: "", description: "" }],
    }));

  const removeProgram = (i: number) =>
    setForm((p) => ({
      ...p,
      programs: p.programs.filter((_, idx) => idx !== i),
    }));

  const updateProgram = (
    i: number,
    field: keyof SectorProgram,
    value: string
  ) =>
    setForm((p) => ({
      ...p,
      programs: p.programs.map((pr, idx) =>
        idx === i ? { ...pr, [field]: value } : pr
      ),
    }));

  /* -- Achievements -- */
  const addAchievement = () =>
    setForm((p) => ({ ...p, achievements: [...p.achievements, ""] }));

  const removeAchievement = (i: number) =>
    setForm((p) => ({
      ...p,
      achievements: p.achievements.filter((_, idx) => idx !== i),
    }));

  const updateAchievement = (i: number, value: string) =>
    setForm((p) => ({
      ...p,
      achievements: p.achievements.map((a, idx) => (idx === i ? value : a)),
    }));

  /* ---------- Image upload ---------- */
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const json = await res.json();
      setForm((p) => ({ ...p, image: json.url ?? json.data?.url ?? "" }));
    } catch (err) {
      console.error("Upload error:", err);
      setMessage({ type: "error", text: "Image upload failed." });
    } finally {
      setUploading(false);
    }
  };

  /* ---------- Save ---------- */
  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim() || !form.description.trim()) {
      setMessage({
        type: "error",
        text: "Name, slug, and description are required.",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const isNew = editingSlug === "__new__";
      const url = isNew ? "/api/sectors" : `/api/sectors/${editingSlug}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Save failed");
      }

      setMessage({
        type: "success",
        text: isNew
          ? "Sector created successfully!"
          : "Sector updated successfully!",
      });
      closeForm();
      fetchSectors();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save sector.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Delete ---------- */
  const handleDelete = async (slug: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/sectors/${slug}`, { method: "DELETE" });
      if (res.ok) {
        if (editingSlug === slug) closeForm();
        fetchSectors();
        setMessage({ type: "success", text: "Sector deleted." });
      } else {
        setMessage({ type: "error", text: "Failed to delete sector." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete sector." });
    }
  };

  /* ---------- Filtered list ---------- */
  const filtered = sectors.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

  const labelClass = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
            <HiPhotograph className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Sectors
            </h1>
            <p className="text-sm text-gray-500">
              {sectors.length} sector{sectors.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90"
        >
          <HiPlus className="h-4 w-4" />
          Add Sector
        </button>
      </div>

      {/* Global message */}
      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search sectors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      {/* ============================================================ */}
      {/*  ADD / EDIT FORM (shown above the list when active)          */}
      {/* ============================================================ */}
      {editingSlug && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingSlug === "__new__" ? "Add New Sector" : "Edit Sector"}
            </h2>
            <button
              onClick={closeForm}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <HiX className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className={labelClass}>Name *</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Education"
              />
            </div>

            {/* Slug */}
            <div>
              <label className={labelClass}>Slug *</label>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-name"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Short Description *</label>
              <textarea
                className={inputClass}
                rows={2}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description shown on cards..."
              />
            </div>

            {/* Long Description */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Long Description</label>
              <RichTextEditor
                value={form.longDescription}
                onChange={(val) => updateField("longDescription", val)}
                placeholder="Detailed description for the sector detail page..."
              />
            </div>

            {/* Icon */}
            <div>
              <label className={labelClass}>Icon Name</label>
              <input
                className={inputClass}
                value={form.icon}
                onChange={(e) => updateField("icon", e.target.value)}
                placeholder="e.g. HiAcademicCap"
              />
            </div>

            {/* Order */}
            <div>
              <label className={labelClass}>Display Order</label>
              <input
                type="number"
                className={inputClass}
                value={form.order}
                onChange={(e) =>
                  updateField("order", parseInt(e.target.value) || 0)
                }
              />
            </div>

            {/* Image */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Image</label>
              <div className="flex items-center gap-3">
                <input
                  className={inputClass}
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="Image URL or upload below"
                />
                <label className="flex-shrink-0 cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                  {uploading ? "Uploading..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </div>
              {form.image && (
                <Image
                  src={form.image}
                  alt="Preview"
                  width={96}
                  height={96}
                  className="mt-2 h-24 w-auto rounded-lg border object-cover"
                />
              )}
            </div>
          </div>

          {/* ---- Stats ---- */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">
                Stats ({form.stats.length})
              </h3>
              <button
                type="button"
                onClick={addStat}
                className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/20"
              >
                <HiPlus className="h-3 w-3" /> Add Stat
              </button>
            </div>
            {form.stats.length === 0 && (
              <p className="text-xs text-gray-400">No stats added yet.</p>
            )}
            <div className="space-y-3">
              {form.stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="grid flex-1 gap-2 sm:grid-cols-3">
                    <input
                      className={inputClass}
                      placeholder="Label"
                      value={stat.label}
                      onChange={(e) => updateStat(i, "label", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Value"
                      value={stat.value}
                      onChange={(e) => updateStat(i, "value", e.target.value)}
                    />
                    <input
                      className={inputClass}
                      placeholder="Icon name"
                      value={stat.icon}
                      onChange={(e) => updateStat(i, "icon", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStat(i)}
                    className="mt-1 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Programs ---- */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">
                Programs ({form.programs.length})
              </h3>
              <button
                type="button"
                onClick={addProgram}
                className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/20"
              >
                <HiPlus className="h-3 w-3" /> Add Program
              </button>
            </div>
            {form.programs.length === 0 && (
              <p className="text-xs text-gray-400">No programs added yet.</p>
            )}
            <div className="space-y-3">
              {form.programs.map((prog, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      className={inputClass}
                      placeholder="Program title"
                      value={prog.title}
                      onChange={(e) =>
                        updateProgram(i, "title", e.target.value)
                      }
                    />
                    <textarea
                      className={inputClass}
                      rows={2}
                      placeholder="Program description"
                      value={prog.description}
                      onChange={(e) =>
                        updateProgram(i, "description", e.target.value)
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeProgram(i)}
                    className="mt-1 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Achievements ---- */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">
                Achievements ({form.achievements.length})
              </h3>
              <button
                type="button"
                onClick={addAchievement}
                className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/20"
              >
                <HiPlus className="h-3 w-3" /> Add Achievement
              </button>
            </div>
            {form.achievements.length === 0 && (
              <p className="text-xs text-gray-400">
                No achievements added yet.
              </p>
            )}
            <div className="space-y-2">
              {form.achievements.map((ach, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={inputClass}
                    placeholder="Achievement text"
                    value={ach}
                    onChange={(e) => updateAchievement(i, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeAchievement(i)}
                    className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ---- Save / Cancel ---- */}
          <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {saving
                ? "Saving..."
                : editingSlug === "__new__"
                ? "Create Sector"
                : "Update Sector"}
            </button>
            <button
              onClick={closeForm}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Sectors list                                                 */}
      {/* ============================================================ */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              <p className="text-sm text-gray-500">Loading sectors...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <HiPhotograph className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-500">
              {search ? "No sectors match your search." : "No sectors yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((sector) => (
              <div
                key={sector._id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-gray-50 ${
                  editingSlug === sector.slug ? "bg-brand/5" : ""
                }`}
              >
                {/* Thumbnail */}
                {sector.image ? (
                  <Image
                    src={sector.image}
                    alt={sector.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 flex-shrink-0 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <HiPhotograph className="h-5 w-5" />
                  </div>
                )}

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {sector.name}
                    </h3>
                    <span className="flex-shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      /{sector.slug}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {sector.description}
                  </p>
                </div>

                {/* Meta badges */}
                <div className="hidden flex-shrink-0 items-center gap-2 md:flex">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">
                    {sector.programs?.length ?? 0} programs
                  </span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">
                    Order: {sector.order}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    onClick={() =>
                      editingSlug === sector.slug
                        ? closeForm()
                        : openEditForm(sector)
                    }
                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-brand/10 hover:text-brand"
                    title="Edit"
                  >
                    {editingSlug === sector.slug ? (
                      <HiChevronUp className="h-4 w-4" />
                    ) : (
                      <HiPencil className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(sector.slug, sector.name)}
                    className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Delete"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
