"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  HiPlus,
  HiTrash,
  HiCheck,
  HiRefresh,
  HiPhotograph,
  HiChartBar,
  HiUserGroup,
  HiUpload,
  HiHome,
  HiChatAlt2,
} from "react-icons/hi";
import RichTextEditor from "@/components/admin/RichTextEditor";

/* ---------- types ---------- */

interface HeroSlide {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image?: string;
}

interface JourneyData {
  label: string;
  title: string;
  body: string;
  image: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
  iconImage?: string;
}

interface Partner {
  name: string;
  logo?: string;
}

interface Story {
  image?: string;
  quote: string;
  name: string;
  designation: string;
}

type TabKey = "hero" | "journey" | "stats" | "partners" | "stories";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "hero", label: "Hero Slider", icon: HiPhotograph },
  { key: "journey", label: "Journey", icon: HiHome },
  { key: "stats", label: "Stats", icon: HiChartBar },
  { key: "partners", label: "Partners", icon: HiUserGroup },
  { key: "stories", label: "Impact Stories", icon: HiChatAlt2 },
];

const JOURNEY_DEFAULT_BODY =
  "<p>Association of Rural Opportunity and Human Initiative (AROHI) is a community-based development organization established in 2002, registered from NGO Affairs Bureau &amp; Department of Social Welfare, Government of Bangladesh, working to improve the socio-economic condition of disadvantaged and vulnerable communities across the Barisal Division.</p><p>AROHI believes in building an inclusive and resilient society where poor and marginalized people can live with dignity, access essential services, and participate actively in community development. Through strong collaboration with government institutions, local authorities, national and international NGOs, and community stakeholders, the organization has reached thousands of vulnerable households in remote and climate-affected areas.</p>";

/* ---------- shared helpers ---------- */

async function uploadFile(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  return data.url || data.secure_url || null;
}

async function saveSetting(key: string, value: unknown): Promise<boolean> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  return res.ok;
}

async function loadSetting<T>(key: string): Promise<T | null> {
  const res = await fetch(`/api/settings?key=${key}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.success && json.data?.value ? (json.data.value as T) : null;
}

/* ---------- small feedback component ---------- */

function Feedback({
  msg,
  type,
  onDismiss,
}: {
  msg: string;
  type: "success" | "error";
  onDismiss: () => void;
}) {
  if (!msg) return null;
  const cls =
    type === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";
  return (
    <div className={`rounded-lg border p-3 text-sm ${cls}`}>
      {type === "success" && <HiCheck className="mr-1 inline h-4 w-4" />}
      {msg}
      <button onClick={onDismiss} className="ml-2 font-medium underline">
        Dismiss
      </button>
    </div>
  );
}

function Loader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
    </div>
  );
}

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90 disabled:opacity-50"
    >
      {saving ? (
        <>
          <HiRefresh className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <HiCheck className="h-4 w-4" />
          Save Changes
        </>
      )}
    </button>
  );
}

/* ---------- reusable image uploader box ---------- */

function ImageUploader({
  value,
  uploading,
  onPick,
  onRemove,
  aspect = "aspect-[16/9]",
  hint = "Recommended 1920×1080 (16:9) · PNG, JPG, WEBP up to 10MB",
}: {
  value?: string;
  uploading: boolean;
  onPick: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  aspect?: string;
  hint?: string;
}) {
  return (
    <div>
      <label className="group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-brand">
        {value ? (
          <div className={`relative w-full ${aspect}`}>
            <Image src={value} alt="Preview" fill className="object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700">
                <HiUpload className="h-4 w-4" />
                Change image
              </span>
            </div>
          </div>
        ) : (
          <div className={`flex w-full flex-col items-center justify-center ${aspect}`}>
            {uploading ? (
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
            ) : (
              <>
                <HiUpload className="mb-2 h-8 w-8 text-gray-400 group-hover:text-brand" />
                <p className="text-sm text-gray-500">Click to upload an image</p>
                <p className="mt-1 text-xs text-gray-400">{hint}</p>
              </>
            )}
          </div>
        )}
        <input type="file" accept="image/*" onChange={onPick} className="hidden" />
      </label>
      {value && (
        <button
          onClick={onRemove}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-red-600"
        >
          <HiTrash className="h-3.5 w-3.5" />
          Remove image
        </button>
      )}
    </div>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function HomeContentPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("hero");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
          <HiHome className="h-5 w-5 text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Home Page</h1>
          <p className="text-sm text-gray-500">
            Manage hero slider, journey, stats, partners, and impact stories.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-4 overflow-x-auto" aria-label="Tabs">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
                  active
                    ? "border-brand text-brand"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === "hero" && <HeroTab />}
      {activeTab === "journey" && <JourneyTab />}
      {activeTab === "stats" && <StatsTab />}
      {activeTab === "partners" && <PartnersTab />}
      {activeTab === "stories" && <StoriesTab />}
    </div>
  );
}

/* ================================================================
   HERO SLIDER TAB
   ================================================================ */

function HeroTab() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });

  useEffect(() => {
    loadSetting<HeroSlide[]>("hero_slides")
      .then((v) => v && setSlides(v))
      .finally(() => setLoading(false));
  }, []);

  function updateSlide(index: number, field: keyof HeroSlide, value: string) {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function handleImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const url = await uploadFile(file);
      if (url) updateSlide(index, "image", url);
      else setFeedback({ msg: "Failed to upload image", type: "error" });
    } catch {
      setFeedback({ msg: "Failed to upload image", type: "error" });
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
    }
  }

  function addSlide() {
    setSlides((prev) => [...prev, { title: "", subtitle: "", ctaText: "", ctaLink: "", image: "" }]);
  }

  function removeSlide(index: number) {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    const ok = await saveSetting("hero_slides", slides);
    setFeedback({
      msg: ok ? "Hero slides saved successfully" : "Failed to save hero slides",
      type: ok ? "success" : "error",
    });
    setSaving(false);
    setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      {slides.map((slide, idx) => (
        <div key={idx} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Slide {idx + 1}</h3>
            <button
              onClick={() => removeSlide(idx)}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-500">Banner Image</label>
            <ImageUploader
              value={slide.image}
              uploading={uploadingIndex === idx}
              onPick={(e) => handleImageUpload(idx, e)}
              onRemove={() => updateSlide(idx, "image", "")}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" value={slide.title} onChange={(v) => updateSlide(idx, "title", v)} />
            <Field label="Subtitle" value={slide.subtitle} onChange={(v) => updateSlide(idx, "subtitle", v)} />
            <Field label="CTA Text" value={slide.ctaText} onChange={(v) => updateSlide(idx, "ctaText", v)} />
            <Field label="CTA Link" value={slide.ctaLink} onChange={(v) => updateSlide(idx, "ctaLink", v)} />
          </div>
        </div>
      ))}

      <button
        onClick={addSlide}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-brand hover:text-brand"
      >
        <HiPlus className="h-4 w-4" />
        Add Slide
      </button>

      <SaveButton saving={saving || uploadingIndex !== null} onClick={save} />
    </div>
  );
}

/* ================================================================
   JOURNEY TAB
   ================================================================ */

function JourneyTab() {
  const [data, setData] = useState<JourneyData>({
    label: "About AROHI",
    title: "Journey of AROHI",
    body: JOURNEY_DEFAULT_BODY,
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });

  useEffect(() => {
    loadSetting<JourneyData>("home_journey")
      .then((v) => v && setData((prev) => ({ ...prev, ...v })))
      .finally(() => setLoading(false));
  }, []);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      if (url) setData((prev) => ({ ...prev, image: url }));
      else setFeedback({ msg: "Failed to upload image", type: "error" });
    } catch {
      setFeedback({ msg: "Failed to upload image", type: "error" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save() {
    setSaving(true);
    const ok = await saveSetting("home_journey", data);
    setFeedback({
      msg: ok ? "Journey section saved successfully" : "Failed to save journey",
      type: ok ? "success" : "error",
    });
    setSaving(false);
    setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Section Label"
            value={data.label}
            placeholder="About AROHI"
            onChange={(v) => setData((p) => ({ ...p, label: v }))}
          />
          <Field
            label="Title"
            value={data.title}
            placeholder="Journey of AROHI"
            onChange={(v) => setData((p) => ({ ...p, title: v }))}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Content</label>
          <RichTextEditor
            value={data.body}
            onChange={(val) => setData((p) => ({ ...p, body: val }))}
            placeholder="Write the Journey of AROHI content here..."
          />
          <p className="mt-1 text-xs text-gray-400">
            On the homepage this is shown collapsed with a “Read More / Read Less” toggle.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Section Image</label>
          <ImageUploader
            value={data.image}
            uploading={uploading}
            onPick={handleImageUpload}
            onRemove={() => setData((p) => ({ ...p, image: "" }))}
            aspect="aspect-[4/3]"
            hint="Recommended 4:3 · PNG, JPG, WEBP up to 10MB"
          />
        </div>
      </div>

      <SaveButton saving={saving || uploading} onClick={save} />
    </div>
  );
}

/* ================================================================
   STATS TAB
   ================================================================ */

function StatsTab() {
  const [stats, setStats] = useState<StatItem[]>([
    { label: "", value: "", icon: "" },
    { label: "", value: "", icon: "" },
    { label: "", value: "", icon: "" },
    { label: "", value: "", icon: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });

  useEffect(() => {
    loadSetting<StatItem[]>("stats")
      .then((v) => {
        if (v) {
          while (v.length < 4) v.push({ label: "", value: "", icon: "" });
          setStats(v.slice(0, 4));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function updateStat(index: number, field: keyof StatItem, value: string) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function handleIconUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const url = await uploadFile(file);
      if (url) updateStat(index, "iconImage", url);
      else setFeedback({ msg: "Failed to upload icon", type: "error" });
    } catch {
      setFeedback({ msg: "Failed to upload icon", type: "error" });
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
    }
  }

  async function save() {
    setSaving(true);
    const ok = await saveSetting("stats", stats);
    setFeedback({
      msg: ok ? "Stats saved successfully" : "Failed to save stats",
      type: ok ? "success" : "error",
    });
    setSaving(false);
    setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-700">Stat {idx + 1}</h3>
            <div className="space-y-3">
              <Field label="Label" value={stat.label} placeholder="e.g., Villages" onChange={(v) => updateStat(idx, "label", v)} />
              <Field label="Value" value={stat.value} placeholder="e.g., 300+" onChange={(v) => updateStat(idx, "value", v)} />

              {/* Icon image (SVG/PNG) — priority over the icon name */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Icon Image (SVG/PNG)</label>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-brand">
                    {stat.iconImage ? (
                      <Image src={stat.iconImage} alt="" width={28} height={28} className="h-7 w-7 object-contain brightness-0 invert" />
                    ) : (
                      <span className="text-[10px] text-white/60">icon</span>
                    )}
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    <HiPhotograph className="h-4 w-4" />
                    {uploadingIndex === idx ? "Uploading..." : stat.iconImage ? "Change" : "Upload"}
                    <input type="file" accept="image/svg+xml,image/png,image/*" onChange={(e) => handleIconUpload(idx, e)} className="hidden" disabled={uploadingIndex === idx} />
                  </label>
                  {stat.iconImage && (
                    <button type="button" onClick={() => updateStat(idx, "iconImage", "")} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
                      <HiTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <Field label="Icon Name (fallback)" value={stat.icon} placeholder="e.g., HiUsers" onChange={(v) => updateStat(idx, "icon", v)} />
            </div>
          </div>
        ))}
      </div>

      <SaveButton saving={saving || uploadingIndex !== null} onClick={save} />
    </div>
  );
}

/* ================================================================
   PARTNERS TAB (with logo upload)
   ================================================================ */

function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });
  const [newName, setNewName] = useState("");

  useEffect(() => {
    loadSetting<Partner[]>("partner_logos")
      .then((v) => v && setPartners(v.map((p) => (typeof p === "string" ? { name: p } : p))))
      .finally(() => setLoading(false));
  }, []);

  function updatePartner(index: number, field: keyof Partner, value: string) {
    setPartners((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  }

  async function handleLogoUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const url = await uploadFile(file);
      if (url) updatePartner(index, "logo", url);
      else setFeedback({ msg: "Failed to upload logo", type: "error" });
    } catch {
      setFeedback({ msg: "Failed to upload logo", type: "error" });
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
    }
  }

  function addPartner() {
    if (!newName.trim()) return;
    setPartners((prev) => [...prev, { name: newName.trim(), logo: "" }]);
    setNewName("");
  }

  function removePartner(index: number) {
    setPartners((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    const ok = await saveSetting("partner_logos", partners);
    setFeedback({
      msg: ok ? "Partners saved successfully" : "Failed to save partners",
      type: ok ? "success" : "error",
    });
    setSaving(false);
    setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((partner, idx) => (
          <div key={idx} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Partner {idx + 1}</span>
              <button
                onClick={() => removePartner(idx)}
                className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
              >
                <HiTrash className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
              {partner.logo ? (
                <Image src={partner.logo} alt={partner.name} width={120} height={60} className="max-h-16 object-contain" />
              ) : (
                <span className="text-sm font-semibold text-gray-400">No logo</span>
              )}
            </div>

            <label className="mb-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50">
              <HiPhotograph className="h-4 w-4" />
              {uploadingIndex === idx ? "Uploading..." : partner.logo ? "Change logo" : "Upload logo"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLogoUpload(idx, e)}
                className="hidden"
                disabled={uploadingIndex === idx}
              />
            </label>

            <Field label="Name" value={partner.name} onChange={(v) => updatePartner(idx, "name", v)} />
          </div>
        ))}
      </div>

      {/* Add new partner */}
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addPartner()}
          className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          placeholder="Partner name"
        />
        <button
          onClick={addPartner}
          className="inline-flex items-center gap-1 rounded-lg bg-brand-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-accent/90"
        >
          <HiPlus className="h-4 w-4" />
          Add
        </button>
      </div>

      <SaveButton saving={saving || uploadingIndex !== null} onClick={save} />
    </div>
  );
}

/* ================================================================
   IMPACT STORIES TAB
   ================================================================ */

function StoriesTab() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });

  useEffect(() => {
    loadSetting<Story[]>("impact_stories")
      .then((v) => v && setStories(v))
      .finally(() => setLoading(false));
  }, []);

  function updateStory(index: number, field: keyof Story, value: string) {
    setStories((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  async function handleImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const url = await uploadFile(file);
      if (url) updateStory(index, "image", url);
      else setFeedback({ msg: "Failed to upload image", type: "error" });
    } catch {
      setFeedback({ msg: "Failed to upload image", type: "error" });
    } finally {
      setUploadingIndex(null);
      e.target.value = "";
    }
  }

  function addStory() {
    setStories((prev) => [...prev, { image: "", quote: "", name: "", designation: "" }]);
  }

  function removeStory(index: number) {
    setStories((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    const ok = await saveSetting("impact_stories", stories);
    setFeedback({
      msg: ok ? "Impact stories saved successfully" : "Failed to save impact stories",
      type: ok ? "success" : "error",
    });
    setSaving(false);
    setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      {stories.map((story, idx) => (
        <div key={idx} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Story {idx + 1}</h3>
            <button
              onClick={() => removeStory(idx)}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Photo</label>
              <ImageUploader
                value={story.image}
                uploading={uploadingIndex === idx}
                onPick={(e) => handleImageUpload(idx, e)}
                onRemove={() => updateStory(idx, "image", "")}
                aspect="aspect-square"
                hint="Square works best · PNG, JPG, WEBP up to 10MB"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Quote</label>
                <textarea
                  rows={4}
                  value={story.quote}
                  onChange={(e) => updateStory(idx, "quote", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="What this person said..."
                />
              </div>
              <Field label="Name" value={story.name} onChange={(v) => updateStory(idx, "name", v)} />
              <Field
                label="Designation"
                value={story.designation}
                placeholder="e.g., Beneficiary, Barisal"
                onChange={(v) => updateStory(idx, "designation", v)}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addStory}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-brand hover:text-brand"
      >
        <HiPlus className="h-4 w-4" />
        Add Story
      </button>

      <SaveButton saving={saving || uploadingIndex !== null} onClick={save} />
    </div>
  );
}

/* ---------- reusable text field ---------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
    </div>
  );
}
