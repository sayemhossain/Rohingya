"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  HiCheck,
  HiRefresh,
  HiPlus,
  HiTrash,
  HiPhotograph,
  HiInformationCircle,
} from "react-icons/hi";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface AboutData {
  heroTitle: string;
  heroSubtitle: string;
  missionLabel: string;
  missionTitle: string;
  missionBody: string;
  missionImage: string;
  timeline: TimelineEvent[];
  timelineLabel: string;
  timelineTitle: string;
  timelineSubtitle: string;
  values: Value[];
  valuesLabel: string;
  valuesTitle: string;
  valuesSubtitle: string;
}

const iconOptions = [
  "HiHeart",
  "HiShieldCheck",
  "HiLightBulb",
  "HiUserGroup",
  "HiStar",
  "HiGlobe",
  "HiAcademicCap",
  "HiBriefcase",
  "HiSparkles",
  "HiEye",
];

const defaultData: AboutData = {
  heroTitle: "",
  heroSubtitle: "",
  missionLabel: "Our Mission",
  missionTitle: "",
  missionBody: "",
  missionImage: "",
  timeline: [],
  timelineLabel: "Our Journey",
  timelineTitle: "",
  timelineSubtitle: "",
  values: [],
  valuesLabel: "What Drives Us",
  valuesTitle: "",
  valuesSubtitle: "",
};

export default function AdminAboutPage() {
  const [data, setData] = useState<AboutData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"hero" | "mission" | "timeline" | "values">("hero");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      const json = await res.json();
      if (json.success && json.data) {
        setData({
          heroTitle: json.data.heroTitle || "",
          heroSubtitle: json.data.heroSubtitle || "",
          missionLabel: json.data.missionLabel || "Our Mission",
          missionTitle: json.data.missionTitle || "",
          missionBody: json.data.missionBody || "",
          missionImage: json.data.missionImage || "",
          timeline: json.data.timeline || [],
          timelineLabel: json.data.timelineLabel || "Our Journey",
          timelineTitle: json.data.timelineTitle || "",
          timelineSubtitle: json.data.timelineSubtitle || "",
          values: json.data.values || [],
          valuesLabel: json.data.valuesLabel || "What Drives Us",
          valuesTitle: json.data.valuesTitle || "",
          valuesSubtitle: json.data.valuesSubtitle || "",
        });
      }
    } catch {
      setError("Failed to load about content");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Failed to save");
        return;
      }

      setSuccess("About page content saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to save about content");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const result = await res.json();
        setData((prev) => ({ ...prev, missionImage: result.url || result.secure_url || "" }));
      } else {
        setError("Failed to upload image");
      }
    } catch {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  // Timeline helpers
  function addTimelineEvent() {
    setData((prev) => ({
      ...prev,
      timeline: [...prev.timeline, { year: "", title: "", description: "" }],
    }));
  }

  function updateTimeline(index: number, field: keyof TimelineEvent, value: string) {
    setData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    }));
  }

  function removeTimeline(index: number) {
    setData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((_, i) => i !== index),
    }));
  }

  // Values helpers
  function addValue() {
    setData((prev) => ({
      ...prev,
      values: [...prev.values, { icon: "HiHeart", title: "", description: "" }],
    }));
  }

  function updateValue(index: number, field: keyof Value, value: string) {
    setData((prev) => ({
      ...prev,
      values: prev.values.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  }

  function removeValue(index: number) {
    setData((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  const tabs = [
    { key: "hero" as const, label: "Hero Section" },
    { key: "mission" as const, label: "Mission" },
    { key: "timeline" as const, label: "Timeline" },
    { key: "values" as const, label: "Values" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
            <HiInformationCircle className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">About Page</h1>
            <p className="text-sm text-gray-500">
              Manage the content displayed on the About page.
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
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
      </div>

      {/* Feedback */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={() => setError("")} className="ml-2 font-medium underline">
            Dismiss
          </button>
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <HiCheck className="mr-1 inline h-4 w-4" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {/* Hero Section */}
        {activeTab === "hero" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Hero Title
              </label>
              <input
                type="text"
                value={data.heroTitle}
                onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="About AROHI"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Hero Subtitle
              </label>
              <textarea
                rows={3}
                value={data.heroSubtitle}
                onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                placeholder="A brief subtitle for the about page hero..."
              />
            </div>
          </div>
        )}

        {/* Mission Section */}
        {activeTab === "mission" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Mission Section</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Section Label
                </label>
                <input
                  type="text"
                  value={data.missionLabel}
                  onChange={(e) => setData({ ...data, missionLabel: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="Our Mission"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Mission Title
                </label>
                <input
                  type="text"
                  value={data.missionTitle}
                  onChange={(e) => setData({ ...data, missionTitle: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="Working for the Disadvantaged"
                />
              </div>
            </div>

            {/* Mission Body */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mission Content
              </label>
              <RichTextEditor
                value={data.missionBody}
                onChange={(val) => setData({ ...data, missionBody: val })}
                placeholder="Write your mission content here..."
              />
            </div>

            {/* Mission Image */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Mission Image
              </label>
              <div className="flex items-center gap-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                  <HiPhotograph className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                {data.missionImage && (
                  <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-gray-200">
                    <Image src={data.missionImage} alt="Mission" fill className="object-cover" />
                    <button
                      onClick={() => setData({ ...data, missionImage: "" })}
                      className="absolute right-1 top-1 rounded-full bg-black/50 p-0.5 text-white hover:bg-red-500"
                    >
                      <HiTrash className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline Section */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Timeline Section</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Section Label</label>
                <input
                  type="text"
                  value={data.timelineLabel}
                  onChange={(e) => setData({ ...data, timelineLabel: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={data.timelineTitle}
                  onChange={(e) => setData({ ...data, timelineTitle: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  value={data.timelineSubtitle}
                  onChange={(e) => setData({ ...data, timelineSubtitle: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Timeline Events ({data.timeline.length})
              </label>
              <button
                onClick={addTimelineEvent}
                className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/20"
              >
                <HiPlus className="h-3.5 w-3.5" />
                Add Event
              </button>
            </div>

            <div className="space-y-4">
              {data.timeline.map((event, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Event #{i + 1}
                    </span>
                    <button
                      onClick={() => removeTimeline(i)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                    >
                      <HiTrash className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Year
                      </label>
                      <input
                        type="text"
                        value={event.year}
                        onChange={(e) => updateTimeline(i, "year", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        placeholder="2002"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Title
                      </label>
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => updateTimeline(i, "title", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        placeholder="Event title"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={event.description}
                      onChange={(e) => updateTimeline(i, "description", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      placeholder="Describe what happened..."
                    />
                  </div>
                </div>
              ))}
              {data.timeline.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    No timeline events yet. Click &quot;Add Event&quot; above.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Values Section */}
        {activeTab === "values" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Values Section</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Section Label</label>
                <input
                  type="text"
                  value={data.valuesLabel}
                  onChange={(e) => setData({ ...data, valuesLabel: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={data.valuesTitle}
                  onChange={(e) => setData({ ...data, valuesTitle: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Subtitle</label>
                <input
                  type="text"
                  value={data.valuesSubtitle}
                  onChange={(e) => setData({ ...data, valuesSubtitle: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Values ({data.values.length})
              </label>
              <button
                onClick={addValue}
                className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-medium text-brand hover:bg-brand/20"
              >
                <HiPlus className="h-3.5 w-3.5" />
                Add Value
              </button>
            </div>

            <div className="space-y-4">
              {data.values.map((val, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Value #{i + 1}
                    </span>
                    <button
                      onClick={() => removeValue(i)}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                    >
                      <HiTrash className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Icon
                      </label>
                      <select
                        value={val.icon}
                        onChange={(e) => updateValue(i, "icon", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      >
                        {iconOptions.map((icon) => (
                          <option key={icon} value={icon}>
                            {icon.replace("Hi", "")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Title
                      </label>
                      <input
                        type="text"
                        value={val.title}
                        onChange={(e) => updateValue(i, "title", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        placeholder="Value title"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="mb-1 block text-xs font-medium text-gray-600">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={val.description}
                      onChange={(e) => updateValue(i, "description", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                      placeholder="Describe this value..."
                    />
                  </div>
                </div>
              ))}
              {data.values.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center">
                  <p className="text-sm text-gray-500">
                    No values yet. Click &quot;Add Value&quot; above.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
