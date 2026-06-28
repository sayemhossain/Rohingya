"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiPlus,
  HiTrash,
  HiUpload,
  HiArrowUp,
  HiArrowDown,
  HiExternalLink,
} from "react-icons/hi";
import RichTextEditor from "@/components/admin/RichTextEditor";

/* ---------- types ---------- */

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface ProgrammeData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  iconImage: string;
  image: string;
  descriptionImage: string;
  gallery: GalleryImage[];
  subProgrammes: string[]; // ordered list of assigned SubProgramme ids
  achievements: string[];
  order: number;
  showOnHomepage: boolean;
}

export const emptyProgramme: ProgrammeData = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  icon: "",
  iconImage: "",
  image: "",
  descriptionImage: "",
  gallery: [],
  subProgrammes: [],
  achievements: [],
  order: 0,
  showOnHomepage: true,
};

interface PoolItem {
  _id: string;
  name: string;
  slug: string;
  published?: boolean;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";
const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

/* ---------- component ---------- */

export default function ProgrammeForm({
  mode,
  initial,
  editSlug,
}: {
  mode: "new" | "edit";
  initial?: ProgrammeData;
  editSlug?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProgrammeData>(initial ?? emptyProgramme);
  const [pool, setPool] = useState<PoolItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [descUploading, setDescUploading] = useState(false);
  const [iconUploading, setIconUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Load the sub-programme pool so the admin can assign from it.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/subprogrammes?all=1");
        const json = await res.json();
        setPool(json.data ?? []);
      } catch {
        /* ignore — assignment UI just shows empty */
      }
    })();
  }, []);

  const updateField = (
    field: keyof ProgrammeData,
    value: string | number | boolean
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && mode === "new") {
        next.slug = slugify(value as string);
      }
      return next;
    });
  };

  /* -- Achievements -- */
  const addAchievement = () =>
    setForm((p) => ({ ...p, achievements: [...p.achievements, ""] }));
  const removeAchievement = (i: number) =>
    setForm((p) => ({ ...p, achievements: p.achievements.filter((_, idx) => idx !== i) }));
  const updateAchievement = (i: number, value: string) =>
    setForm((p) => ({
      ...p,
      achievements: p.achievements.map((a, idx) => (idx === i ? value : a)),
    }));

  /* -- Gallery -- */
  const addGalleryImage = () =>
    setForm((p) => ({ ...p, gallery: [...p.gallery, { url: "", caption: "" }] }));
  const removeGalleryImage = (i: number) =>
    setForm((p) => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }));
  const updateGalleryImage = (i: number, field: keyof GalleryImage, value: string) =>
    setForm((p) => ({
      ...p,
      gallery: p.gallery.map((g, idx) => (idx === i ? { ...g, [field]: value } : g)),
    }));
  const handleGalleryUpload = async (i: number, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(i);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      updateGalleryImage(i, "url", json.url ?? json.secure_url ?? "");
    } catch {
      setError("Image upload failed.");
    } finally {
      setGalleryUploading(null);
    }
  };

  /* -- Icon upload (SVG / image) -- */
  const handleIconUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIconUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setForm((p) => ({ ...p, iconImage: json.url ?? json.secure_url ?? "" }));
    } catch {
      setError("Icon upload failed.");
    } finally {
      setIconUploading(false);
    }
  };

  /* -- Description-section image upload -- */
  const handleDescImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDescUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setForm((p) => ({ ...p, descriptionImage: json.url ?? json.secure_url ?? "" }));
    } catch {
      setError("Image upload failed.");
    } finally {
      setDescUploading(false);
    }
  };

  /* -- Sub-programme assignment -- */
  const assignSub = (id: string) =>
    setForm((p) =>
      p.subProgrammes.includes(id)
        ? p
        : { ...p, subProgrammes: [...p.subProgrammes, id] }
    );
  const unassignSub = (id: string) =>
    setForm((p) => ({ ...p, subProgrammes: p.subProgrammes.filter((x) => x !== id) }));
  const moveSub = (i: number, dir: -1 | 1) =>
    setForm((p) => {
      const next = [...p.subProgrammes];
      const j = i + dir;
      if (j < 0 || j >= next.length) return p;
      [next[i], next[j]] = [next[j], next[i]];
      return { ...p, subProgrammes: next };
    });

  const poolById = new Map(pool.map((s) => [s._id, s]));
  const assigned = form.subProgrammes.map((id) => poolById.get(id)).filter(Boolean) as PoolItem[];
  const available = pool.filter((s) => !form.subProgrammes.includes(s._id));

  /* -- Main image upload -- */
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const json = await res.json();
      setForm((p) => ({ ...p, image: json.url ?? json.secure_url ?? "" }));
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  /* -- Save -- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.slug.trim() || !form.description.trim()) {
      setError("Name, slug, and description are required.");
      return;
    }
    setSaving(true);
    try {
      const url = mode === "new" ? "/api/sectors" : `/api/sectors/${editSlug}`;
      const method = mode === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      router.push("/admin/sectors");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save programme.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic details */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-900">Basic Details</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Education"
              />
            </div>
            <div>
              <label className={labelClass}>
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-name"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={inputClass}
                rows={2}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief description shown on cards..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Long Description</label>
              <RichTextEditor
                value={form.longDescription}
                onChange={(val) => updateField("longDescription", val)}
                placeholder="Detailed description for the programme detail page..."
              />
            </div>

            {/* Description-section image (shown beside the long description) */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Description Image</label>
              <p className="-mt-1 mb-1.5 text-xs text-gray-400">
                Optional image shown next to the long description on the programme page. Falls back to the main image if left empty.
              </p>
              <div className="flex items-center gap-3">
                <input
                  className={inputClass}
                  value={form.descriptionImage}
                  onChange={(e) => updateField("descriptionImage", e.target.value)}
                  placeholder="Image URL or upload"
                />
                <label className="inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                  {descUploading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  ) : (
                    <HiUpload className="h-4 w-4" />
                  )}
                  {descUploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleDescImageUpload} disabled={descUploading} />
                </label>
              </div>
              {form.descriptionImage && (
                <div className="mt-2">
                  <Image src={form.descriptionImage} alt="Description preview" width={120} height={96} className="h-24 w-auto rounded-lg border object-cover" />
                  <button type="button" onClick={() => updateField("descriptionImage", "")} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-red-600">
                    <HiTrash className="h-3.5 w-3.5" /> Remove image
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Icon Name (fallback)</label>
              <input
                className={inputClass}
                value={form.icon}
                onChange={(e) => updateField("icon", e.target.value)}
                placeholder="e.g. HiAcademicCap"
              />
              <p className="mt-1 text-xs text-gray-400">Used only if no icon image is uploaded below.</p>
            </div>
            <div>
              <label className={labelClass}>Display Order</label>
              <input
                type="number"
                className={inputClass}
                value={form.order}
                onChange={(e) => updateField("order", parseInt(e.target.value) || 0)}
              />
            </div>

            {/* Icon image (SVG/PNG) — priority over the icon name */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Icon Image (SVG/PNG)</label>
              <p className="-mt-1 mb-1.5 text-xs text-gray-400">
                Upload a custom icon. When set, it is used instead of the icon name above.
              </p>
              <div className="flex items-center gap-3">
                <input
                  className={inputClass}
                  value={form.iconImage}
                  onChange={(e) => updateField("iconImage", e.target.value)}
                  placeholder="Icon URL or upload an SVG/PNG"
                />
                <label className="inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                  {iconUploading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  ) : (
                    <HiUpload className="h-4 w-4" />
                  )}
                  {iconUploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/svg+xml,image/png,image/*" className="hidden" onChange={handleIconUpload} disabled={iconUploading} />
                </label>
              </div>
              {form.iconImage && (
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-lg border bg-gray-50 p-2">
                    <Image src={form.iconImage} alt="Icon preview" width={40} height={40} className="h-10 w-10 object-contain" />
                  </div>
                  <button type="button" onClick={() => updateField("iconImage", "")} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-red-600">
                    <HiTrash className="h-3.5 w-3.5" /> Remove icon
                  </button>
                </div>
              )}
            </div>

            {/* Image */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Image</label>
              <div className="flex items-center gap-3">
                <input
                  className={inputClass}
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="Image URL or upload"
                />
                <label className="inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                  <HiUpload className="h-4 w-4" />
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
                <div className="mt-2">
                  <Image
                    src={form.image}
                    alt="Preview"
                    width={120}
                    height={96}
                    className="h-24 w-auto rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateField("image", "")}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-red-600"
                  >
                    <HiTrash className="h-3.5 w-3.5" />
                    Remove image
                  </button>
                </div>
              )}
            </div>

            {/* Show on homepage */}
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <input
                  type="checkbox"
                  checked={form.showOnHomepage}
                  onChange={(e) => updateField("showOnHomepage", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span>
                  <span className="block text-sm font-medium text-gray-700">
                    Show on homepage
                  </span>
                  <span className="block text-xs text-gray-500">
                    When checked, this programme appears in the &ldquo;Our Programmes&rdquo;
                    section on the homepage. It still has its own page either way.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Sub-programmes assignment */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Sub-programmes ({assigned.length})
            </h3>
            <Link
              href="/admin/subprogrammes/new"
              target="_blank"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
            >
              <HiExternalLink className="h-3.5 w-3.5" /> Create new
            </Link>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            Assign sub-programmes from the pool to this programme. They appear as
            pills on the programme page and as a flyout in the navbar, in this order.
          </p>

          {/* Assigned (ordered) */}
          {assigned.length === 0 ? (
            <p className="mb-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-center text-xs text-gray-400">
              No sub-programmes assigned yet.
            </p>
          ) : (
            <ul className="mb-4 space-y-2">
              {assigned.map((sub, i) => (
                <li key={sub._id} className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-800">{sub.name}</span>
                    <span className="text-[11px] text-gray-400">/{sub.slug}</span>
                  </div>
                  <button type="button" onClick={() => moveSub(i, -1)} disabled={i === 0} className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30" aria-label="Move up">
                    <HiArrowUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => moveSub(i, 1)} disabled={i === assigned.length - 1} className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30" aria-label="Move down">
                    <HiArrowDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => unassignSub(sub._id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500" aria-label="Remove">
                    <HiTrash className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add from pool */}
          {available.length > 0 ? (
            <div>
              <label className={labelClass}>Add a sub-programme</label>
              <div className="flex flex-wrap gap-2">
                {available.map((sub) => (
                  <button
                    key={sub._id}
                    type="button"
                    onClick={() => assignSub(sub._id)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-brand"
                  >
                    <HiPlus className="h-3 w-3" />
                    {sub.name}
                    {sub.published === false && (
                      <span className="ml-1 rounded bg-gray-100 px-1 text-[9px] uppercase text-gray-400">hidden</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : pool.length === 0 ? (
            <p className="text-xs text-gray-400">
              No sub-programmes in the pool yet.{" "}
              <Link href="/admin/subprogrammes/new" target="_blank" className="text-brand hover:underline">Create one</Link>.
            </p>
          ) : (
            <p className="text-xs text-gray-400">All sub-programmes are assigned.</p>
          )}
        </div>

        {/* Achievements */}
        <Repeater
          title="Achievements"
          count={form.achievements.length}
          onAdd={addAchievement}
          emptyText="No achievements added yet."
        >
          {form.achievements.map((ach, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={inputClass} placeholder="Achievement text" value={ach} onChange={(e) => updateAchievement(i, e.target.value)} />
              <RemoveBtn onClick={() => removeAchievement(i)} />
            </div>
          ))}
        </Repeater>

        {/* Gallery */}
        <Repeater
          title="Gallery Images"
          count={form.gallery.length}
          onAdd={addGalleryImage}
          emptyText="No gallery images yet. These power the smart image gallery on the programme page."
        >
          {form.gallery.map((img, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              {galleryUploading === i ? (
                <div className="flex h-[72px] w-[72px] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-brand/30 bg-brand/5 text-brand">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  <span className="text-[10px]">Uploading</span>
                </div>
              ) : img.url ? (
                <Image
                  src={img.url}
                  alt={img.caption || `Image ${i + 1}`}
                  width={72}
                  height={72}
                  className="h-[72px] w-[72px] flex-shrink-0 rounded-lg border object-cover"
                />
              ) : (
                <label className="flex h-[72px] w-[72px] flex-shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand">
                  <HiUpload className="h-4 w-4" />
                  <span className="text-[10px]">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryUpload(i, e)} disabled={galleryUploading !== null} />
                </label>
              )}
              <div className="flex-1 space-y-2">
                <input className={inputClass} placeholder="Image URL" value={img.url} onChange={(e) => updateGalleryImage(i, "url", e.target.value)} />
                <input className={inputClass} placeholder="Caption (optional)" value={img.caption} onChange={(e) => updateGalleryImage(i, "caption", e.target.value)} />
              </div>
              <RemoveBtn onClick={() => removeGalleryImage(i)} />
            </div>
          ))}
        </Repeater>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || uploading || descUploading || iconUploading || galleryUploading !== null}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {saving ? "Saving..." : mode === "new" ? "Create Programme" : "Update Programme"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/sectors")}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

/* ---------- small helpers ---------- */

function Repeater({
  title,
  count,
  onAdd,
  emptyText,
  children,
}: {
  title: string;
  count: number;
  onAdd: () => void;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          {title} ({count})
        </h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/20"
        >
          <HiPlus className="h-3 w-3" /> Add
        </button>
      </div>
      {count === 0 ? (
        <p className="text-xs text-gray-400">{emptyText}</p>
      ) : (
        <div className="space-y-3">{children}</div>
      )}
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
    >
      <HiTrash className="h-4 w-4" />
    </button>
  );
}
