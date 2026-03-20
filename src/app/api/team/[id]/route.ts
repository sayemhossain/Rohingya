export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import TeamMember from "@/models/TeamMember";
import { revalidateTeam } from "@/lib/revalidate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await TeamMember.findById(id);
    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: member },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();
    const { name, role, bio, photo, order } = body;

    const member = await TeamMember.findById(id);
    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    const updated = await TeamMember.findByIdAndUpdate(
      id,
      {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(bio !== undefined && { bio }),
        ...(photo !== undefined && { photo }),
        ...(order !== undefined && { order }),
      },
      { new: true, runValidators: true }
    );

    revalidateTeam();

    return NextResponse.json(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating team member:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const member = await TeamMember.findById(id);
    if (!member) {
      return NextResponse.json(
        { success: false, error: "Team member not found" },
        { status: 404 }
      );
    }

    await TeamMember.findByIdAndDelete(id);

    revalidateTeam();

    return NextResponse.json(
      { success: true, message: "Team member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
