import { NextResponse } from "next/navigation";
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
    return NextResponse.json({ success: true, projects: data.projects });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const data = getPortfolioData();

    const newProject = {
      id: body.id || `proj-${Date.now()}`,
      title: body.title,
      category: body.category || "3d-cgi",
      categoryLabel: body.categoryLabel || (body.category === "3d-cgi" ? "3D & CGI" : body.category === "graphic-motion" ? "Graphic & Motion" : "UI / UX"),
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
    savePortfolioData(data);

    return NextResponse.json({ success: true, project: newProject });
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

    const data = getPortfolioData();
    data.projects = data.projects.filter(p => p.id !== id);
    savePortfolioData(data);

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
