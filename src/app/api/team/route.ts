export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import TeamMember from "@/models/TeamMember";
import { revalidateTeam } from "@/lib/revalidate";

export async function GET() {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: -1 });

    return NextResponse.json(
      { success: true, data: members },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, bio, photo, order } = body;

    if (!name || !role) {
      return NextResponse.json(
        { success: false, error: "Name and role are required" },
        { status: 400 }
      );
    }

    const member = await TeamMember.create({
      name,
      role,
      bio: bio || "",
      photo: photo || "",
      order: order ?? 0,
    });

    revalidateTeam();

    return NextResponse.json(
      { success: true, data: member },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team member:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
