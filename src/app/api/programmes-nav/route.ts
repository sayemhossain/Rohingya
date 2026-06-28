export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Sector from "@/models/Sector";
import SubProgramme from "@/models/SubProgramme";

// Lightweight tree of programmes + their published sub-programmes.
// Powers the Navbar's auto-generated 3rd-level flyout.
export async function GET() {
  try {
    await connectDB();

    const [sectors, subs] = await Promise.all([
      Sector.find({}, "name slug order subProgrammes").sort({ order: 1 }).lean(),
      SubProgramme.find({ published: true, showInNavbar: { $ne: false } }, "name slug").lean(),
    ]);

    const byId = new Map(subs.map((sub) => [String(sub._id), sub]));

    const data = sectors.map((s) => ({
      name: s.name,
      slug: s.slug,
      subProgrammes: ((s as { subProgrammes?: unknown[] }).subProgrammes ?? [])
        .map((id) => byId.get(String(id)))
        .filter(Boolean)
        .map((sub) => ({ name: sub!.name, slug: sub!.slug })),
    }));

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error("Error building programmes nav:", error);
    return NextResponse.json(
      { success: false, error: "Failed to build programmes nav" },
      { status: 500 }
    );
  }
}
