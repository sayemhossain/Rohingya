"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiSearch,
  HiPhotograph,
  HiViewGrid,
  HiCollection,
  HiEye,
  HiEyeOff,
  HiChevronDown,
  HiExternalLink,
} from "react-icons/hi";

interface SubProgramme {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  order: number;
  published?: boolean;
}

interface Sector {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  order: number;
  subProgrammes?: string[];
  showOnHomepage?: boolean;
}

type Msg = { type: "success" | "error"; text: string } | null;

function ProgrammesInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") === "subprogrammes" ? "subprogrammes" : "programmes";

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [subs, setSubs] = useState<SubProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [poolSearch, setPoolSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [message, setMessage] = useState<Msg>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [secRes, subRes] = await Promise.all([
        fetch("/api/sectors"),
        fetch("/api/subprogrammes?all=1"),
      ]);
      const secJson = await secRes.json();
      const subJson = await subRes.json();
      setSectors(secJson.data ?? []);
      setSubs(subJson.data ?? []);
    } catch {
      setMessage({ type: "error", text: "Failed to load data." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const setTab = (t: "programmes" | "subprogrammes") =>
    router.replace(`/admin/sectors?tab=${t}`);

  const deleteProgramme = async (slug: string, name: string) => {
    if (!window.confirm(`Delete programme "${name}"?`)) return;
    try {
      const res = await fetch(`/api/sectors/${slug}`, { method: "DELETE" });
      if (res.ok) { load(); setMessage({ type: "success", text: "Programme deleted." }); }
      else setMessage({ type: "error", text: "Failed to delete programme." });
    } catch { setMessage({ type: "error", text: "Failed to delete programme." }); }
  };

  const deleteSub = async (id: string, name: string) => {
    if (!window.confirm(`Delete sub-programme "${name}"? It will be removed from any programmes it is assigned to.`)) return;
    try {
      const res = await fetch(`/api/subprogrammes/${id}`, { method: "DELETE" });
      if (res.ok) { load(); setMessage({ type: "success", text: "Sub-programme deleted." }); }
      else setMessage({ type: "error", text: "Failed to delete." });
    } catch { setMessage({ type: "error", text: "Failed to delete." }); }
  };

  const subById = new Map(subs.map((s) => [s._id, s]));
  const filteredSectors = sectors.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredSubs = subs.filter((s) => s.name.toLowerCase().includes(poolSearch.toLowerCase()));
  const onHomeCount = sectors.filter((s) => s.showOnHomepage !== false).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-accent text-white shadow-sm">
          <HiViewGrid className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Our Programmes</h1>
          <p className="text-sm text-gray-500">
            {sectors.length} programmes · {onHomeCount} on homepage · {subs.length} sub-programmes in pool
          </p>
        </div>
      </div>

      {message && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm sm:w-fit">
        <button
          onClick={() => setTab("programmes")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
            tab === "programmes" ? "bg-brand text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <HiViewGrid className="h-4 w-4" /> Programmes
          <span className={`rounded-full px-1.5 text-[11px] ${tab === "programmes" ? "bg-white/20" : "bg-gray-100"}`}>{sectors.length}</span>
        </button>
        <button
          onClick={() => setTab("subprogrammes")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
            tab === "subprogrammes" ? "bg-brand text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <HiCollection className="h-4 w-4" /> Sub-programmes
          <span className={`rounded-full px-1.5 text-[11px] ${tab === "subprogrammes" ? "bg-white/20" : "bg-gray-100"}`}>{subs.length}</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : tab === "programmes" ? (
        /* ============ PROGRAMMES TAB ============ */
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search programmes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <Link href="/admin/sectors/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90">
              <HiPlus className="h-4 w-4" /> Add Programme
            </Link>
          </div>

          {filteredSectors.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <HiPhotograph className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">{search ? "No programmes match your search." : "No programmes yet."}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSectors.map((sector) => {
                const assigned = (sector.subProgrammes ?? []).map((id) => subById.get(id)).filter(Boolean) as SubProgramme[];
                const isOpen = expanded === sector._id;
                return (
                  <div key={sector._id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex gap-4 p-4">
                      {sector.image ? (
                        <Image src={sector.image} alt={sector.name} width={72} height={72} className="h-[72px] w-[72px] flex-shrink-0 rounded-xl border border-gray-100 object-cover" />
                      ) : (
                        <div className="flex h-[72px] w-[72px] flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/10 to-brand-accent/10 text-brand">
                          <HiPhotograph className="h-6 w-6" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-gray-900">{sector.name}</h3>
                          <span className="flex-shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">/{sector.slug}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{sector.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {sector.showOnHomepage === false ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500"><HiEyeOff className="h-3 w-3" /> Hidden</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600"><HiEye className="h-3 w-3" /> On homepage</span>
                          )}
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-600">{assigned.length} sub-programmes</span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500">Order: {sector.order}</span>
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 flex-col items-end gap-1">
                        <Link href={`/admin/sectors/edit/${sector.slug}`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-brand/10 hover:text-brand">
                          <HiPencil className="h-4 w-4" /> Edit
                        </Link>
                        <button onClick={() => deleteProgramme(sector.slug, sector.name)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600">
                          <HiTrash className="h-4 w-4" /> Delete
                        </button>
                      </div>
                    </div>

                    {/* Assigned sub-programmes (expandable) */}
                    <div className="border-t border-gray-100 bg-gray-50/60 px-4 py-2.5">
                      <button onClick={() => setExpanded(isOpen ? null : sector._id)} className="flex w-full items-center justify-between text-left">
                        <span className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <HiCollection className="h-4 w-4" />
                          {assigned.length > 0 ? `${assigned.length} sub-programme${assigned.length > 1 ? "s" : ""} assigned` : "No sub-programmes assigned"}
                        </span>
                        <span className="flex items-center gap-3">
                          <Link href={`/admin/sectors/edit/${sector.slug}`} className="text-[11px] font-medium text-brand hover:underline">Manage</Link>
                          {assigned.length > 0 && <HiChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />}
                        </span>
                      </button>
                      {isOpen && assigned.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {assigned.map((sub, i) => (
                            <Link
                              key={sub._id}
                              href={`/admin/subprogrammes/edit/${sub._id}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 transition-colors hover:border-brand/40 hover:text-brand"
                            >
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand/10 text-[9px] font-bold text-brand">{i + 1}</span>
                              {sub.name}
                              {sub.published === false && <span className="rounded bg-gray-100 px-1 text-[8px] uppercase text-gray-400">hidden</span>}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* ============ SUB-PROGRAMMES TAB ============ */
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
            Sub-programmes are a reusable pool. Create them here, then assign them to any programme from that programme&rsquo;s <strong>Edit</strong> page.
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-sm flex-1">
              <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search sub-programmes..."
                value={poolSearch}
                onChange={(e) => setPoolSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <Link href="/admin/subprogrammes/new" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand/90">
              <HiPlus className="h-4 w-4" /> Add Sub-programme
            </Link>
          </div>

          {filteredSubs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <HiCollection className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">{poolSearch ? "No sub-programmes match your search." : "No sub-programmes yet."}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {filteredSubs.map((sub) => {
                const usedBy = sectors.filter((sec) => (sec.subProgrammes ?? []).includes(sub._id));
                return (
                  <div key={sub._id} className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex gap-4 p-4">
                      {sub.image ? (
                        <Image src={sub.image} alt={sub.name} width={64} height={64} className="h-16 w-16 flex-shrink-0 rounded-xl border border-gray-100 object-cover" />
                      ) : (
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand/10 to-brand-accent/10 text-brand">
                          <HiPhotograph className="h-5 w-5" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate text-sm font-semibold text-gray-900">{sub.name}</h3>
                          <span className="flex-shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">/{sub.slug}</span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">{sub.description}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {sub.published === false ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500"><HiEyeOff className="h-3 w-3" /> Hidden</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600"><HiEye className="h-3 w-3" /> Published</span>
                          )}
                          {usedBy.length > 0 ? (
                            <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">In {usedBy.map((u) => u.name).join(", ")}</span>
                          ) : (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">Unassigned</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-end gap-1 border-t border-gray-100 bg-gray-50/60 px-4 py-2.5">
                      <Link href={`/admin/subprogrammes/edit/${sub._id}`} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-brand/10 hover:text-brand">
                        <HiPencil className="h-4 w-4" /> Edit
                      </Link>
                      <button onClick={() => deleteSub(sub._id, sub.name)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600">
                        <HiTrash className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Quick link to seed/help could go here */}
      <div className="pt-2 text-right">
        <Link href="/programmes" target="_blank" className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-brand">
          <HiExternalLink className="h-3.5 w-3.5" /> View public programmes page
        </Link>
      </div>
    </div>
  );
}

export default function AdminProgrammesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" /></div>}>
      <ProgrammesInner />
    </Suspense>
  );
}
