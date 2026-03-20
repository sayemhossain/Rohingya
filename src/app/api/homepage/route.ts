export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import News from "@/models/News";
import Sector from "@/models/Sector";
import SiteSettings from "@/models/SiteSettings";

export async function GET() {
  try {
    await connectDB();
    const [news, sectors, heroSlidesDoc, statsDoc, partnerLogosDoc] =
      await Promise.all([
        News.find({ published: true }).sort({ createdAt: -1 }).limit(3).lean(),
        Sector.find({}).sort({ order: 1 }).lean(),
        SiteSettings.findOne({ key: "hero_slides" }).lean(),
        SiteSettings.findOne({ key: "stats" }).lean(),
        SiteSettings.findOne({ key: "partner_logos" }).lean(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        news,
        sectors,
        heroSlides: heroSlidesDoc?.value || null,
        stats: statsDoc?.value || null,
        partnerLogos: partnerLogosDoc?.value || null,
      },
    });
  } catch (error) {
    console.error("Homepage API error:", error);
    return NextResponse.json(
      { success: false, data: null },
      { status: 500 }
    );
  }
}
