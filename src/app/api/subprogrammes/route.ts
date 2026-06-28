export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SubProgramme from "@/models/SubProgramme";
import { revalidateSubProgrammes } from "@/lib/revalidate";

// GET /api/subprogrammes
//   ?all=1   → include unpublished (admin listing)
// Sub-programmes are a standalone pool; programmes pick which to include.
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const includeUnpublished = searchParams.get("all") === "1";

    const query: Record<string, unknown> = {};
    if (!includeUnpublished) query.published = true;

    const subs = await SubProgramme.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    return NextResponse.json({ success: true, data: subs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sub-programmes:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sub-programmes" },
      { status: 500 }
    );
  }
}

// POST /api/subprogrammes — create a standalone sub-programme (pool item).
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const sub = await SubProgramme.create(body);

    revalidateSubProgrammes();

    return NextResponse.json({ success: true, data: sub }, { status: 201 });
  } catch (error) {
    console.error("Error creating sub-programme:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    // Duplicate (parentSlug + slug) compound index violation.
    if (error instanceof Error && "code" in error && (error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { success: false, error: "A sub-programme with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create sub-programme" },
      { status: 500 }
    );
  }
}
