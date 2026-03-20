import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const menuSettings = await SiteSettings.findOne({ key: "menu_order" });

    return NextResponse.json(menuSettings?.value || []);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { items } = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items must be an array of { label, href, order }" },
        { status: 400 }
      );
    }

    const menuSettings = await SiteSettings.findOneAndUpdate(
      { key: "menu_order" },
      { key: "menu_order", value: items },
      { upsert: true, new: true }
    );

    return NextResponse.json(menuSettings.value);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
