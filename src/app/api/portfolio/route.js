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
    return NextResponse.json({ success: true, portfolio: data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = getPortfolioData();

    if (body.profile) {
      data.profile = { ...data.profile, ...body.profile };
    }
    if (body.hero) {
      data.hero = { ...data.hero, ...body.hero };
    }
    if (body.about) {
      data.about = body.about;
    }
    if (body.experience) {
      data.experience = body.experience;
    }
    if (body.awards) {
      data.awards = body.awards;
    }
    if (body.skills) {
      data.skills = body.skills;
    }
    if (body.activityFeed) {
      data.activityFeed = body.activityFeed;
    }
    if (body.resumeTracks) {
      data.resumeTracks = body.resumeTracks;
    }

    savePortfolioData(data);
    return NextResponse.json({ success: true, portfolio: data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
