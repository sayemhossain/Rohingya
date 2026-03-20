import { NextRequest, NextResponse } from "next/server";
import SiteSettings from "@/models/SiteSettings";
import { revalidateSettings } from "@/lib/revalidate";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'key' is required" },
        { status: 400 }
      );
    }

    const setting = await SiteSettings.findOne({ key });

    if (!setting) {
      return NextResponse.json(
        { success: false, error: `Setting '${key}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: setting },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch setting" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: "Both 'key' and 'value' are required" },
        { status: 400 }
      );
    }

    const setting = await SiteSettings.findOneAndUpdate(
      { key },
      { key, value },
      { new: true, upsert: true, runValidators: true }
    );

    revalidateSettings();

    return NextResponse.json(
      { success: true, data: setting },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating setting:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update setting" },
      { status: 500 }
    );
  }
}
