export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import ContactMessage from "@/models/ContactMessage";

export async function GET() {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch contact messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "All fields are required: name, email, subject, message",
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { success: true, data: contactMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact message:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to submit contact message" },
      { status: 500 }
    );
  }
}
