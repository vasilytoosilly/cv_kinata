import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "portfolio.json");

function getPortfolioData() {
  const file = fs.readFileSync(dataFilePath, "utf8");
  return JSON.parse(file);
}

function savePortfolioData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
}

export async function GET() {
  try {
    const data = getPortfolioData();
    return NextResponse.json({
      success: true,
      hero: data.hero || {
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
    const data = getPortfolioData();

    if (!data.hero) {
      data.hero = {};
    }

    if (body.videoSrc !== undefined) data.hero.videoSrc = body.videoSrc;
    if (body.poster !== undefined) data.hero.poster = body.poster;
    if (body.tagline !== undefined) data.hero.tagline = body.tagline;
    if (body.tickerText !== undefined) data.hero.tickerText = body.tickerText;

    savePortfolioData(data);

    return NextResponse.json({
      success: true,
      message: "Hero settings updated successfully",
      hero: data.hero,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
