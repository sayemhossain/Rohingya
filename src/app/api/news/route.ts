export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import { revalidateNews } from "@/lib/revalidate";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = { published: true };

    if (category) {
      filter.category = category;
    }

    let query = News.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const news = await query;

    return NextResponse.json({ success: true, data: news }, { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const news = await News.create(body);

    revalidateNews();

    return NextResponse.json({ success: true, data: news }, { status: 201 });
  } catch (error) {
    console.error("Error creating news:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create news" },
      { status: 500 }
    );
  }
}
