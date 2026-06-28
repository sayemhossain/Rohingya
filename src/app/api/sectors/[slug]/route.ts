export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Sector from "@/models/Sector";
import SubProgramme from "@/models/SubProgramme";
import { revalidateSectors } from "@/lib/revalidate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const sector = await Sector.findOne({ slug }).lean();

    if (!sector) {
      return NextResponse.json(
        { success: false, error: "Sector not found" },
        { status: 404 }
      );
    }

    // Attach the assigned, published sub-programmes (preserving the order the
    // admin arranged them in on the programme page).
    const assignedIds: string[] = ((sector as { subProgrammes?: unknown[] }).subProgrammes ?? []).map(
      (id) => String(id)
    );
    let subProgrammes: Record<string, unknown>[] = [];
    if (assignedIds.length > 0) {
      const docs = await SubProgramme.find({
        _id: { $in: assignedIds },
        published: true,
      }).lean();
      const byId = new Map(docs.map((d) => [String(d._id), d]));
      subProgrammes = assignedIds
        .map((id) => byId.get(id))
        .filter(Boolean) as Record<string, unknown>[];
    }

    return NextResponse.json(
      { success: true, data: { ...sector, subProgrammes } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sector:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sector" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await request.json();

    const sector = await Sector.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    });

    if (!sector) {
      return NextResponse.json(
        { success: false, error: "Sector not found" },
        { status: 404 }
      );
    }

    revalidateSectors();
    revalidatePath("/programmes/" + slug);
    revalidatePath("/programmes/" + (body.slug || slug));

    return NextResponse.json(
      { success: true, data: sector },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating sector:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update sector" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const sector = await Sector.findOneAndDelete({ slug });

    if (!sector) {
      return NextResponse.json(
        { success: false, error: "Sector not found" },
        { status: 404 }
      );
    }

    revalidateSectors();
    revalidatePath("/programmes/" + slug);

    return NextResponse.json(
      { success: true, message: "Sector deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting sector:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete sector" },
      { status: 500 }
    );
  }
}
