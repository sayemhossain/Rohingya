"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  HiPlus,
  HiTrash,
  HiChevronUp,
  HiChevronDown,
  HiCheck,
  HiRefresh,
  HiMenuAlt4,
  HiFolder,
  HiPhotograph,
  HiUpload,
} from "react-icons/hi";

/* ---------- types ---------- */

interface MenuItem {
  label: string;
  href: string;
  order: number;
  children?: { label: string; href: string }[];
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

/* ================================================================
   SETTINGS PAGE — Menu management
   ================================================================ */

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
          <HiMenuAlt4 className="h-5 w-5 text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-500">
            Configure the website logo and header navigation menu.
          </p>
        </div>
      </div>

      <LogoSection />
      <MenuTab />
    </div>
  );
}

/* ================================================================
   LOGO SECTION
   ================================================================ */

function LogoSection() {
  const [logo, setLogo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", type: "success" as "success" | "error" });

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings?key=site_logo");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.value) setLogo(json.data.value);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFeedback({ msg: "", type: "success" });
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url || data.secure_url) {
        setLogo(data.url || data.secure_url);
      } else {
        setFeedback({ msg: "Failed to upload logo", type: "error" });
      }
    } catch {
      setFeedback({ msg: "Failed to upload logo", type: "error" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "site_logo", value: logo }),
      });
      setFeedback({
        msg: res.ok ? "Logo saved successfully" : "Failed to save logo",
        type: res.ok ? "success" : "error",
      });
    } catch {
      setFeedback({ msg: "Failed to save logo", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback({ msg: "", type: "success" }), 3000);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <HiPhotograph className="h-5 w-5 text-brand" />
          Website Logo
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload a logo to replace the text logo in the header. Leave empty to keep the
          default “AROHI” text. Transparent PNG, around 200×56px, works best.
        </p>
      </div>

      <Feedback msg={feedback.msg} type={feedback.type} onDismiss={() => setFeedback({ msg: "", type: "success" })} />

      {/* Preview */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-16 min-w-[180px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4">
          {logo ? (
            <Image src={logo} alt="Logo preview" width={180} height={48} className="h-12 w-auto object-contain" />
          ) : (
            <span className="flex flex-col leading-tight">
              <span className="font-heading text-xl font-bold tracking-tight text-brand">AROHI</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-500">
                Rural Opportunities &amp; Human Initiatives
              </span>
            </span>
          )}
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50">
          <HiUpload className="h-4 w-4" />
          {uploading ? "Uploading..." : logo ? "Change logo" : "Upload logo"}
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>

        {logo && (
          <button
            onClick={() => setLogo("")}
            className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-600"
          >
            <HiTrash className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>

      <SaveButton saving={saving || uploading} onClick={save} />
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
