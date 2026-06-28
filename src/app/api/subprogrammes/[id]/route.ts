export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SubProgramme from "@/models/SubProgramme";
import { revalidateSubProgrammes } from "@/lib/revalidate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const sub = await SubProgramme.findById(id).lean();

    if (!sub) {
      return NextResponse.json(
        { success: false, error: "Sub-programme not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: sub }, { status: 200 });
  } catch (error) {
    console.error("Error fetching sub-programme:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sub-programme" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const sub = await SubProgramme.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!sub) {
      return NextResponse.json(
        { success: false, error: "Sub-programme not found" },
        { status: 404 }
      );
    }

    revalidateSubProgrammes();

    return NextResponse.json({ success: true, data: sub }, { status: 200 });
  } catch (error) {
    console.error("Error updating sub-programme:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    if (error instanceof Error && "code" in error && (error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { success: false, error: "A sub-programme with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update sub-programme" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const sub = await SubProgramme.findByIdAndDelete(id);

    if (!sub) {
      return NextResponse.json(
        { success: false, error: "Sub-programme not found" },
        { status: 404 }
      );
    }

    revalidateSubProgrammes();

    return NextResponse.json(
      { success: true, message: "Sub-programme deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting sub-programme:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete sub-programme" },
      { status: 500 }
    );
  }
}
