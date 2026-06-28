"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiPlus, HiTrash, HiUpload } from "react-icons/hi";
import RichTextEditor from "@/components/admin/RichTextEditor";

/* ---------- types ---------- */

export interface SubGalleryImage {
  url: string;
  caption: string;
}

export interface SubProgrammeData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  icon: string;
  iconImage: string;
  image: string;
  gallery: SubGalleryImage[];
  achievements: string[];
  order: number;
  published: boolean;
  showInNavbar: boolean;
}

export const emptySubProgramme: SubProgrammeData = {
  name: "",
  slug: "",
  description: "",
  longDescription: "",
  icon: "",
  iconImage: "",
  image: "",
  gallery: [],
  achievements: [],
  order: 0,
  published: true,
  showInNavbar: true,
};

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

export default function SubProgrammeForm({
  mode,
  initial,
  editId,
}: {
  mode: "new" | "edit";
  initial?: SubProgrammeData;
  editId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SubProgrammeData>(initial ?? emptySubProgramme);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [iconUploading, setIconUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState<number | null>(null);
  const [error, setError] = useState("");

  const updateField = (
    field: keyof SubProgrammeData,
    value: string | number | boolean
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && mode === "new") next.slug = slugify(value as string);
      return next;
    });
  };

  /* repeaters */
  const addAch = () => setForm((p) => ({ ...p, achievements: [...p.achievements, ""] }));
  const removeAch = (i: number) => setForm((p) => ({ ...p, achievements: p.achievements.filter((_, idx) => idx !== i) }));
  const updateAch = (i: number, v: string) =>
    setForm((p) => ({ ...p, achievements: p.achievements.map((a, idx) => (idx === i ? v : a)) }));

  const addImg = () => setForm((p) => ({ ...p, gallery: [...p.gallery, { url: "", caption: "" }] }));
  const removeImg = (i: number) => setForm((p) => ({ ...p, gallery: p.gallery.filter((_, idx) => idx !== i) }));
  const updateImg = (i: number, f: keyof SubGalleryImage, v: string) =>
    setForm((p) => ({ ...p, gallery: p.gallery.map((g, idx) => (idx === i ? { ...g, [f]: v } : g)) }));

  const uploadTo = async (
    e: ChangeEvent<HTMLInputElement>,
    onUrl: (url: string) => void
  ) => {
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
      onUrl(json.url ?? json.secure_url ?? "");
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

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
      updateImg(i, "url", json.url ?? json.secure_url ?? "");
    } catch {
      setError("Image upload failed.");
    } finally {
      setGalleryUploading(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.slug.trim() || !form.description.trim()) {
      setError("Name, slug, and description are required.");
      return;
    }
    setSaving(true);
    try {
      const url = mode === "new" ? "/api/subprogrammes" : `/api/subprogrammes/${editId}`;
      const method = mode === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      router.push("/admin/sectors?tab=subprogrammes");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save sub-programme.");
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
            <div className="sm:col-span-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
              Sub-programmes are a reusable pool. After saving, open a programme
              under <strong>Our Programmes</strong> to assign this sub-programme to it.
            </div>
            <div>
              <label className={labelClass}>
                Name <span className="text-red-500">*</span>
              </label>
              <input className={inputClass} value={form.name} onChange={(e) => updateField("name", e.target.value)} placeholder="e.g. Eye Camp Program" />
            </div>
            <div>
              <label className={labelClass}>
                Slug <span className="text-red-500">*</span>
              </label>
              <input className={inputClass} value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="auto-generated-from-name" />
            </div>
            <div>
              <label className={labelClass}>Default Display Order</label>
              <input
                type="number"
                className={inputClass}
                value={form.order}
                onChange={(e) => updateField("order", parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Brief summary shown on cards/pills hover…" />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Long Description</label>
              <RichTextEditor
                value={form.longDescription}
                onChange={(val) => updateField("longDescription", val)}
                placeholder="Detailed description for the sub-programme page…"
              />
            </div>

            <div>
              <label className={labelClass}>Icon Name (fallback)</label>
              <input className={inputClass} value={form.icon} onChange={(e) => updateField("icon", e.target.value)} placeholder="e.g. HiHeart" />
              <p className="mt-1 text-xs text-gray-400">Used only if no icon image is uploaded.</p>
            </div>

            {/* Icon image (SVG/PNG) — priority over the icon name */}
            <div>
              <label className={labelClass}>Icon Image (SVG/PNG)</label>
              <div className="flex items-center gap-3">
                <input className={inputClass} value={form.iconImage} onChange={(e) => updateField("iconImage", e.target.value)} placeholder="Icon URL or upload" />
                <label className="inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                  {iconUploading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  ) : (
                    <HiUpload className="h-4 w-4" />
                  )}
                  {iconUploading ? "..." : "Upload"}
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

            {/* Hero/feature image */}
            <div className="sm:col-span-2">
              <label className={labelClass}>Feature Image</label>
              <div className="flex items-center gap-3">
                <input className={inputClass} value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="Image URL or upload" />
                <label className="inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                  <HiUpload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadTo(e, (u) => updateField("image", u))} disabled={uploading} />
                </label>
              </div>
              {form.image && (
                <Image src={form.image} alt="Preview" width={120} height={96} className="mt-2 h-24 w-auto rounded-lg border object-cover" />
              )}
            </div>

            <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <input type="checkbox" checked={form.published} onChange={(e) => updateField("published", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
                <span>
                  <span className="block text-sm font-medium text-gray-700">Published</span>
                  <span className="block text-xs text-gray-500">When unchecked, this sub-programme is hidden from the public site entirely.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <input type="checkbox" checked={form.showInNavbar} onChange={(e) => updateField("showInNavbar", e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand" />
                <span>
                  <span className="block text-sm font-medium text-gray-700">Show in navbar</span>
                  <span className="block text-xs text-gray-500">When unchecked, it still appears on the programme page but is hidden from the navbar dropdown.</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <Repeater title="Gallery Images" count={form.gallery.length} onAdd={addImg} emptyText="No gallery images yet. These power the smart image gallery.">
          {form.gallery.map((img, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3">
              {galleryUploading === i ? (
                <div className="flex h-[72px] w-[72px] flex-shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-brand/30 bg-brand/5 text-brand">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                  <span className="text-[10px]">Uploading</span>
                </div>
              ) : img.url ? (
                <Image src={img.url} alt={img.caption || `Image ${i + 1}`} width={72} height={72} className="h-[72px] w-[72px] flex-shrink-0 rounded-lg border object-cover" />
              ) : (
                <label className="flex h-[72px] w-[72px] flex-shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-brand hover:text-brand">
                  <HiUpload className="h-4 w-4" />
                  <span className="text-[10px]">Upload</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleGalleryUpload(i, e)} disabled={galleryUploading !== null} />
                </label>
              )}
              <div className="flex-1 space-y-2">
                <input className={inputClass} placeholder="Image URL" value={img.url} onChange={(e) => updateImg(i, "url", e.target.value)} />
                <input className={inputClass} placeholder="Caption (optional)" value={img.caption} onChange={(e) => updateImg(i, "caption", e.target.value)} />
              </div>
              <RemoveBtn onClick={() => removeImg(i)} />
            </div>
          ))}
        </Repeater>

        {/* Achievements */}
        <Repeater title="Achievements" count={form.achievements.length} onAdd={addAch} emptyText="No achievements added yet.">
          {form.achievements.map((ach, i) => (
            <div key={i} className="flex items-center gap-2">
              <input className={inputClass} placeholder="Achievement text" value={ach} onChange={(e) => updateAch(i, e.target.value)} />
              <RemoveBtn onClick={() => removeAch(i)} />
            </div>
          ))}
        </Repeater>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving || uploading || iconUploading || galleryUploading !== null} className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60">
            {saving && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {saving ? "Saving..." : mode === "new" ? "Create Sub-programme" : "Update Sub-programme"}
          </button>
          <button type="button" onClick={() => router.back()} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
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
        <h3 className="text-base font-semibold text-gray-900">{title} ({count})</h3>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/20">
          <HiPlus className="h-3 w-3" /> Add
        </button>
      </div>
      {count === 0 ? <p className="text-xs text-gray-400">{emptyText}</p> : <div className="space-y-3">{children}</div>}
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-1 rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-500">
      <HiTrash className="h-4 w-4" />
    </button>
  );
}
