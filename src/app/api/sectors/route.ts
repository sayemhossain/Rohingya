export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Sector from "@/models/Sector";
import { revalidateSectors } from "@/lib/revalidate";

export async function GET() {
  try {
    const sectors = await Sector.find({}).sort({ order: 1 });

    return NextResponse.json(
      { success: true, data: sectors },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sectors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sectors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const sector = await Sector.create(body);

    revalidateSectors();

    return NextResponse.json(
      { success: true, data: sector },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating sector:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create sector" },
      { status: 500 }
    );
  }
}
