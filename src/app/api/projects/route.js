import { NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/lib/supabase";

export async function GET() {
  try {
    const data = await getPortfolioData();
    return NextResponse.json({ success: true, projects: data?.projects || [] });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = (await getPortfolioData()) || { projects: [] };
    if (!data.projects) data.projects = [];

    const categoryMap = {
      "commercial-video": "Commercial & Video",
      "3d-film-environment": "3D Film & Environment",
      "game-assets-animation": "Game Assets & Animation",
      "web-creative-tech": "Web & Creative Tech",
    };

    const newProject = {
      id: body.id || `proj-${Date.now()}`,
      title: body.title,
      category: body.category || "commercial-video",
      categoryLabel: body.categoryLabel || categoryMap[body.category] || "Project",
      year: body.year || new Date().getFullYear().toString(),
      image: body.image || "/images/projects/archviz_interior.jpg",
      summary: body.summary || "",
      description: body.description || body.summary || "",
      tools: Array.isArray(body.tools) ? body.tools : (body.tools ? body.tools.split(",").map(t => t.trim()) : ["Blender"]),
      link: body.link || "https://artstation.com",
      stats: body.stats || "",
      featured: true,
    };

    data.projects.unshift(newProject);
    await savePortfolioData(data);

    return NextResponse.json({ success: true, project: newProject });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, message: "Missing project id" }, { status: 400 });
    }

    const data = (await getPortfolioData()) || { projects: [] };
    if (!data.projects) data.projects = [];

    const index = data.projects.findIndex((p) => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: "Project not found" }, { status: 404 });
    }

    const categoryMap = {
      "commercial-video": "Commercial & Video",
      "3d-film-environment": "3D Film & Environment",
      "game-assets-animation": "Game Assets & Animation",
      "web-creative-tech": "Web & Creative Tech",
    };

    const existing = data.projects[index];
    const updated = {
      ...existing,
      ...body,
      categoryLabel: body.categoryLabel || categoryMap[body.category || existing.category] || existing.categoryLabel,
      tools: Array.isArray(body.tools)
        ? body.tools
        : (body.tools ? body.tools.split(",").map((t) => t.trim()).filter(Boolean) : existing.tools),
    };

    data.projects[index] = updated;
    await savePortfolioData(data);

    return NextResponse.json({ success: true, project: updated });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
    }

    const data = (await getPortfolioData()) || { projects: [] };
    if (!data.projects) data.projects = [];

    data.projects = data.projects.filter(p => p.id !== id);
    await savePortfolioData(data);

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
