import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import News from "@/models/News";
import { revalidateNews } from "@/lib/revalidate";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const news = await News.findOne({ slug });

    if (!news) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: news }, { status: 200 });
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const news = await News.findOneAndUpdate({ slug }, body, {
      new: true,
      runValidators: true,
    });

    if (!news) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    revalidateNews();
    revalidatePath("/news/" + slug);

    return NextResponse.json({ success: true, data: news }, { status: 200 });
  } catch (error) {
    console.error("Error updating article:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const news = await News.findOneAndDelete({ slug });

    if (!news) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    revalidateNews();
    revalidatePath("/news/" + slug);

    return NextResponse.json(
      { success: true, message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
