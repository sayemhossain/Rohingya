export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-helpers";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    const dataUri = `data:${mimeType};base64,${base64}`;

    const { secure_url, public_id } = await uploadImage(dataUri);

    return NextResponse.json({ url: secure_url, publicId: public_id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
