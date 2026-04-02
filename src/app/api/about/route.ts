export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AboutContent from "@/models/AboutContent";
import { requireAdmin } from "@/lib/auth-helpers";
import { revalidateAbout } from "@/lib/revalidate";

export async function GET() {
  try {
    await connectDB();
    const about = await AboutContent.findOne();

    return NextResponse.json(
      { success: true, data: about },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching about content:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch about content" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const body = await request.json();

    let about = await AboutContent.findOne();

    if (about) {
      Object.assign(about, body);
      await about.save();
    } else {
      about = await AboutContent.create(body);
    }

    revalidateAbout();

    return NextResponse.json(
      { success: true, data: about },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating about content:", error);
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update about content" },
      { status: 500 }
    );
  }
}
