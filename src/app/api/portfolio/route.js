import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/supabase";

export async function GET() {
  try {
    const data = await getPortfolioData();
    if (!data) {
      return NextResponse.json({ success: false, message: "No portfolio data found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, portfolio: data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = (await getPortfolioData()) || {};

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

    await savePortfolioData(data);
    return NextResponse.json({ success: true, portfolio: data });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
