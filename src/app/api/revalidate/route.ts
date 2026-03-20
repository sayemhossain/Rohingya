export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { path } = await request.json();

    if (path) {
      // Revalidate specific path
      revalidatePath(path);
    } else {
      // Revalidate all main pages
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/news");
      revalidatePath("/sectors");
      revalidatePath("/resources");
      revalidatePath("/gallery");
      revalidatePath("/crisis-overview");
      revalidatePath("/get-involved");
      revalidatePath("/contact");
    }

    return NextResponse.json({ success: true, revalidated: path || "all" });
  } catch {
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
