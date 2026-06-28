"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import SubProgrammeForm, {
  SubProgrammeData,
  emptySubProgramme,
} from "@/components/admin/SubProgrammeForm";

export default function EditSubProgrammePage() {
  const params = useParams();
  const id = params.id as string;

  const [initial, setInitial] = useState<SubProgrammeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/subprogrammes/${id}`);
        const json = await res.json();
        if (!res.ok || !json.data) throw new Error("Sub-programme not found");
        const d = json.data;
        setInitial({
          ...emptySubProgramme,
          name: d.name ?? "",
          slug: d.slug ?? "",
          description: d.description ?? "",
          longDescription: d.longDescription ?? "",
          icon: d.icon ?? "",
          iconImage: d.iconImage ?? "",
          image: d.image ?? "",
          gallery: d.gallery ?? [],
          achievements: d.achievements ?? [],
          order: d.order ?? 0,
          published: d.published !== false,
          showInNavbar: d.showInNavbar !== false,
        });
      } catch {
        setError("Failed to load this sub-programme.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/sectors?tab=subprogrammes"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-brand"
      >
        <HiArrowLeft className="h-4 w-4" />
        Back to Programmes
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Sub-programme</h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
        </div>
      ) : error || !initial ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Sub-programme not found."}
        </div>
      ) : (
        <SubProgrammeForm mode="edit" initial={initial} editId={id} />
      )}
    </div>
  );
}
