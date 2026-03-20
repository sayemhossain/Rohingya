export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireSuperAdmin } from "@/lib/auth-helpers";
import User from "@/models/User";
import bcryptjs from "bcryptjs";

export async function GET() {
  try {
    await connectDB();
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "admin",
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
