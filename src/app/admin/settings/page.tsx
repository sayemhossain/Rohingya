"use client";

import { useState, useEffect, useCallback } from "react";
import {
  HiPlus,
  HiTrash,
  HiChevronUp,
  HiChevronDown,
  HiCheck,
  HiRefresh,
  HiMenuAlt4,
  HiPhotograph,
  HiChartBar,
  HiUserGroup,
  HiFolder,
} from "react-icons/hi";

/* ---------- types ---------- */

interface MenuItem {
  label: string;
  href: string;
  order: number;
  children?: { label: string; href: string }[];
}

interface HeroSlide {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
}

interface Partner {
  name: string;
}

type TabKey = "menu" | "hero" | "stats" | "partners";

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "menu", label: "Menu", icon: HiMenuAlt4 },
  { key: "hero", label: "Hero Slides", icon: HiPhotograph },
  { key: "stats", label: "Stats", icon: HiChartBar },
  { key: "partners", label: "Partners", icon: HiUserGroup },
];

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

/* ================================================================
   MAIN PAGE
   ================================================================ */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("menu");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure menu, hero slides, statistics, and partners.
        </p>
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

      {/* Tab panels */}
      {activeTab === "menu" && <MenuTab />}
      {activeTab === "hero" && <HeroTab />}
      {activeTab === "stats" && <StatsTab />}
      {activeTab === "partners" && <PartnersTab />}
    </div>
  );
}

/* ================================================================
   MENU TAB
   ================================================================ */

function MenuTab() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings?key=menu_order");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.value) {
          setItems(json.data.value);
        }
      }
    } catch {
      setFeedback({ msg: "Failed to load menu", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function moveItem(index: number, dir: -1 | 1) {
    const next = [...items];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((item, i) => (item.order = i));
    setItems(next);
  }

  function addItem() {
    if (!newLabel.trim() || !newHref.trim()) return;
    setItems((prev) => [
      ...prev,
      { label: newLabel.trim(), href: newHref.trim(), order: prev.length },
    ]);
    setNewLabel("");
    setNewHref("");
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index).map((item, i) => ({ ...item, order: i })));
  }

  function addChild(parentIndex: number) {
    const next = [...items];
    const children = next[parentIndex].children ? [...next[parentIndex].children!] : [];
    children.push({ label: "", href: "" });
    next[parentIndex] = { ...next[parentIndex], children };
    setItems(next);
  }

  function updateChild(parentIndex: number, childIndex: number, field: "label" | "href", value: string) {
    const next = [...items];
    const children = [...(next[parentIndex].children || [])];
    children[childIndex] = { ...children[childIndex], [field]: value };
    next[parentIndex] = { ...next[parentIndex], children };
    setItems(next);
  }

  function removeChild(parentIndex: number, childIndex: number) {
    const next = [...items];
    const children = (next[parentIndex].children || []).filter((_, i) => i !== childIndex);
    next[parentIndex] = { ...next[parentIndex], children: children.length > 0 ? children : undefined };
    setItems(next);
  }

  function moveChild(parentIndex: number, childIndex: number, dir: -1 | 1) {
    const next = [...items];
    const children = [...(next[parentIndex].children || [])];
    const target = childIndex + dir;
    if (target < 0 || target >= children.length) return;
    [children[childIndex], children[target]] = [children[target], children[childIndex]];
    next[parentIndex] = { ...next[parentIndex], children };
    setItems(next);
  }

  async function save() {
    setSaving(true);
    setFeedback({ msg: "", type: "success" });
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "menu_order", value: items }),
      });
      if (res.ok) {
        setFeedback({ msg: "Menu saved successfully", type: "success" });
      } else {
        setFeedback({ msg: "Failed to save menu", type: "error" });
      }
    } catch {
      setFeedback({ msg: "Failed to save menu", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          {items.map((item, idx) => (
            <div key={idx}>
              {/* Parent menu item row */}
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="w-8 text-center text-xs font-medium text-gray-400">
                  {idx + 1}
                </span>
                {item.children && item.children.length > 0 && (
                  <HiFolder className="h-4 w-4 flex-shrink-0 text-brand-accent" />
                )}
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...next[idx], label: e.target.value };
                    setItems(next);
                  }}
                  className="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="Label"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...next[idx], href: e.target.value };
                    setItems(next);
                  }}
                  className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="/url"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => addChild(idx)}
                    title="Add submenu item"
                    className="rounded p-1 text-gray-400 hover:bg-brand-accent/10 hover:text-brand-accent"
                  >
                    <HiPlus className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                  >
                    <HiChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-30"
                  >
                    <HiChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(idx)}
                    className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <HiTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Children submenu items */}
              {item.children && item.children.length > 0 && (
                <div className="ml-10 border-l-2 border-brand-accent pb-2">
                  {item.children.map((child, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-center gap-3 px-4 py-2"
                    >
                      <span className="w-6 text-center text-[11px] font-medium text-gray-300">
                        {cIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={child.label}
                        onChange={(e) => updateChild(idx, cIdx, "label", e.target.value)}
                        className="w-36 rounded border border-gray-200 px-2 py-1 text-xs focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        placeholder="Sub label"
                      />
                      <input
                        type="text"
                        value={child.href}
                        onChange={(e) => updateChild(idx, cIdx, "href", e.target.value)}
                        className="flex-1 rounded border border-gray-200 px-2 py-1 text-xs focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                        placeholder="/sub-url"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveChild(idx, cIdx, -1)}
                          disabled={cIdx === 0}
                          className="rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-30"
                        >
                          <HiChevronUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveChild(idx, cIdx, 1)}
                          disabled={cIdx === (item.children?.length ?? 0) - 1}
                          className="rounded p-0.5 text-gray-300 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-30"
                        >
                          <HiChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => removeChild(idx, cIdx)}
                          className="rounded p-0.5 text-gray-300 hover:bg-red-50 hover:text-red-500"
                        >
                          <HiTrash className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 pt-1">
                    <button
                      onClick={() => addChild(idx)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-accent hover:text-brand-accent/80"
                    >
                      <HiPlus className="h-3 w-3" />
                      Add submenu item
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add new item */}
        <div className="flex items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3">
          <span className="w-8" />
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="New label"
          />
          <input
            type="text"
            value={newHref}
            onChange={(e) => setNewHref(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            placeholder="/new-url"
          />
          <button
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-lg bg-brand-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-accent/90"
          >
            <HiPlus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      <SaveButton saving={saving} onClick={save} />
    </div>
  );
}

/* ================================================================
   HERO SLIDES TAB
   ================================================================ */

function HeroTab() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings?key=hero_slides");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.value) {
          setSlides(json.data.value);
        }
      }
    } catch {
      setFeedback({ msg: "Failed to load hero slides", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function updateSlide(index: number, field: keyof HeroSlide, value: string) {
    const next = [...slides];
    next[index] = { ...next[index], [field]: value };
    setSlides(next);
  }

  function addSlide() {
    setSlides((prev) => [
      ...prev,
      { title: "", subtitle: "", ctaText: "", ctaLink: "" },
    ]);
  }

  function removeSlide(index: number) {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    setFeedback({ msg: "", type: "success" });
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_slides", value: slides }),
      });
      if (res.ok) {
        setFeedback({ msg: "Hero slides saved successfully", type: "success" });
      } else {
        setFeedback({ msg: "Failed to save hero slides", type: "error" });
      }
    } catch {
      setFeedback({ msg: "Failed to save hero slides", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      {slides.map((slide, idx) => (
        <div
          key={idx}
          className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Slide {idx + 1}
            </h3>
            <button
              onClick={() => removeSlide(idx)}
              className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Title
              </label>
              <input
                type="text"
                value={slide.title}
                onChange={(e) => updateSlide(idx, "title", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Subtitle
              </label>
              <input
                type="text"
                value={slide.subtitle}
                onChange={(e) => updateSlide(idx, "subtitle", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                CTA Text
              </label>
              <input
                type="text"
                value={slide.ctaText}
                onChange={(e) => updateSlide(idx, "ctaText", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                CTA Link
              </label>
              <input
                type="text"
                value={slide.ctaLink}
                onChange={(e) => updateSlide(idx, "ctaLink", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
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

      <SaveButton saving={saving} onClick={save} />
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
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings?key=stats");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.value) {
          const fetched = json.data.value as StatItem[];
          // Ensure always 4 items
          while (fetched.length < 4) fetched.push({ label: "", value: "", icon: "" });
          setStats(fetched.slice(0, 4));
        }
      }
    } catch {
      setFeedback({ msg: "Failed to load stats", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function updateStat(index: number, field: keyof StatItem, value: string) {
    const next = [...stats];
    next[index] = { ...next[index], [field]: value };
    setStats(next);
  }

  async function save() {
    setSaving(true);
    setFeedback({ msg: "", type: "success" });
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "stats", value: stats }),
      });
      if (res.ok) {
        setFeedback({ msg: "Stats saved successfully", type: "success" });
      } else {
        setFeedback({ msg: "Failed to save stats", type: "error" });
      }
    } catch {
      setFeedback({ msg: "Failed to save stats", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <h3 className="mb-3 text-sm font-semibold text-gray-700">
              Stat {idx + 1}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Label
                </label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={(e) => updateStat(idx, "label", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="e.g., Refugees"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Value
                </label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(idx, "value", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="e.g., 1,000,000+"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Icon
                </label>
                <input
                  type="text"
                  value={stat.icon}
                  onChange={(e) => updateStat(idx, "icon", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  placeholder="e.g., HiUsers"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <SaveButton saving={saving} onClick={save} />
    </div>
  );
}

/* ================================================================
   PARTNERS TAB
   ================================================================ */

function PartnersTab() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });
  const [newName, setNewName] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings?key=partner_logos");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.value) {
          setPartners(json.data.value);
        }
      }
    } catch {
      setFeedback({ msg: "Failed to load partners", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function addPartner() {
    if (!newName.trim()) return;
    setPartners((prev) => [...prev, { name: newName.trim() }]);
    setNewName("");
  }

  function removePartner(index: number) {
    setPartners((prev) => prev.filter((_, i) => i !== index));
  }

  async function save() {
    setSaving(true);
    setFeedback({ msg: "", type: "success" });
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "partner_logos", value: partners }),
      });
      if (res.ok) {
        setFeedback({ msg: "Partners saved successfully", type: "success" });
      } else {
        setFeedback({ msg: "Failed to save partners", type: "error" });
      }
    } catch {
      setFeedback({ msg: "Failed to save partners", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4">
      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {partners.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            No partners added yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-brand/10 text-xs font-bold text-brand">
                    {partner.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {partner.name}
                  </span>
                </div>
                <button
                  onClick={() => removePartner(idx)}
                  className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                >
                  <HiTrash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new partner */}
        <div className="flex items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-3">
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
      </div>

      <SaveButton saving={saving} onClick={save} />
    </div>
  );
}

/* ================================================================
   SHARED COMPONENTS
   ================================================================ */

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
