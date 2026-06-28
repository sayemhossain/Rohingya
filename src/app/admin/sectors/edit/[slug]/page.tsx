"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import ProgrammeForm, {
  ProgrammeData,
  emptyProgramme,
} from "@/components/admin/ProgrammeForm";

export default function EditProgrammePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [initial, setInitial] = useState<ProgrammeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/sectors/${slug}`);
        const json = await res.json();
        if (!res.ok || !json.data) throw new Error("Programme not found");
        const d = json.data;
        setInitial({
          ...emptyProgramme,
          name: d.name ?? "",
          slug: d.slug ?? "",
          description: d.description ?? "",
          longDescription: d.longDescription ?? "",
          icon: d.icon ?? "",
          iconImage: d.iconImage ?? "",
          image: d.image ?? "",
          descriptionImage: d.descriptionImage ?? "",
          gallery: d.gallery ?? [],
          // subProgrammes come back as the assigned id list; normalise to strings.
          subProgrammes: (d.subProgrammes ?? []).map((x: unknown) =>
            typeof x === "string" ? x : String((x as { _id?: unknown })?._id ?? x)
          ),
          achievements: d.achievements ?? [],
          order: d.order ?? 0,
          showOnHomepage: d.showOnHomepage !== false,
        });
      } catch {
        setError("Failed to load this programme.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/sectors"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-brand"
      >
        <HiArrowLeft className="h-4 w-4" />
        Back to Programmes
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Programme</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : error || !initial ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Programme not found."}
        </div>
      ) : (
        <ProgrammeForm mode="edit" initial={initial} editSlug={slug} />
      )}
    </div>
  );
}
