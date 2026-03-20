export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import News from "@/models/News";
import ContactMessage from "@/models/ContactMessage";
import Resource from "@/models/Resource";
import Gallery from "@/models/Gallery";
import User from "@/models/User";
import Sector from "@/models/Sector";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const [news, messages, unreadMessages, resources, gallery, users, sectors] =
      await Promise.all([
        News.countDocuments(),
        ContactMessage.countDocuments(),
        ContactMessage.countDocuments({ read: false }),
        Resource.countDocuments(),
        Gallery.countDocuments(),
        User.countDocuments(),
        Sector.countDocuments(),
      ]);

    return NextResponse.json({
      news,
      messages,
      unreadMessages,
      resources,
      gallery,
      users,
      sectors,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
