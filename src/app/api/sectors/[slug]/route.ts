export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Sector from "@/models/Sector";
import { revalidateSectors } from "@/lib/revalidate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const sector = await Sector.findOne({ slug });

    if (!sector) {
      return NextResponse.json(
        { success: false, error: "Sector not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: sector },
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
    revalidatePath("/sectors/" + slug);

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
    revalidatePath("/sectors/" + slug);

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
