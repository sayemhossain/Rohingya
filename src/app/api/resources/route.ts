export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import Resource from "@/models/Resource";
import { revalidateResources } from "@/lib/revalidate";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const all = searchParams.get("all");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = {};

    if (all !== "true") {
      filter.published = true;
    }

    if (category) {
      filter.category = category;
    }

    let query = Resource.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    const resources = await query;

    return NextResponse.json(
      { success: true, data: resources },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resource = await Resource.create(body);

    revalidateResources();

    return NextResponse.json(
      { success: true, data: resource },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resource:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create resource" },
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
        { success: false, error: "Resource _id is required" },
        { status: 400 }
      );
    }

    const resource = await Resource.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    revalidateResources();

    return NextResponse.json({ success: true, data: resource });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update resource" },
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
        { success: false, error: "Resource _id is required" },
        { status: 400 }
      );
    }

    const resource = await Resource.findByIdAndDelete(_id);

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    revalidateResources();

    return NextResponse.json({ success: true, message: "Resource deleted" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
