"use client";

import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import SubProgrammeForm from "@/components/admin/SubProgrammeForm";

export default function NewSubProgrammePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/sectors?tab=subprogrammes"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-brand"
      >
        <HiArrowLeft className="h-4 w-4" />
        Back to Programmes
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-gray-900">Add Sub-programme</h1>

      <SubProgrammeForm mode="new" />
    </div>
  );
}
