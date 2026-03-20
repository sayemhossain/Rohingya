import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    return NextResponse.json(messages);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
