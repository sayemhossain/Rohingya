export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Gallery from "@/models/Gallery";
import { revalidateGallery } from "@/lib/revalidate";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (category) {
      filter.category = category;
    }

    if (featured === "true") {
      filter.featured = true;
    }

    const gallery = await Gallery.find(filter).sort({ order: 1, createdAt: -1 });

    return NextResponse.json(
      { success: true, data: gallery },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gallery items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const galleryItem = await Gallery.create(body);

    revalidateGallery();

    return NextResponse.json(
      { success: true, data: galleryItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating gallery item:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Gallery item _id is required" },
        { status: 400 }
      );
    }

    const galleryItem = await Gallery.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found" },
        { status: 404 }
      );
    }

    revalidateGallery();

    return NextResponse.json({ success: true, data: galleryItem });
  } catch (error) {
    console.error("Error updating gallery item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { success: false, error: "Gallery item _id is required" },
        { status: 400 }
      );
    }

    const galleryItem = await Gallery.findByIdAndDelete(_id);

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found" },
        { status: 404 }
      );
    }

    revalidateGallery();

    return NextResponse.json({ success: true, message: "Gallery item deleted" });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}
