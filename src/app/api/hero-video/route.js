import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/supabase";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({
      success: true,
      hero: data?.hero || {
        videoSrc: "/videos/showreel.mp4",
        poster: "/images/projects/archviz_interior.jpg",
      },
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = (await getPortfolioData()) || {};

    if (!data.hero) {
      data.hero = {};
    }

    if (body.videoSrc !== undefined) data.hero.videoSrc = body.videoSrc;
    if (body.poster !== undefined) data.hero.poster = body.poster;
    if (body.tagline !== undefined) data.hero.tagline = body.tagline;
    if (body.tickerText !== undefined) data.hero.tickerText = body.tickerText;

    await savePortfolioData(data);

    return NextResponse.json({
      success: true,
      message: "Hero settings updated successfully",
      hero: data.hero,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
