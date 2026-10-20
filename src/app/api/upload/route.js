import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Determine target directory (videos vs pdf/cv vs images)
    const folderType = data.get("folder");
    const isVideo = folderType === "videos" || /\.(mp4|webm|mov)$/i.test(file.name);
    const isPdf = folderType === "cv" || /\.pdf$/i.test(file.name);
    
    // Sanitize filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueName = `${Date.now()}_${safeName}`;
    
    let uploadDir = path.join(process.cwd(), "public", "images", "projects");
    let publicUrl = `/images/projects/${uniqueName}`;

    if (isVideo) {
      uploadDir = path.join(process.cwd(), "public", "videos");
      publicUrl = `/videos/${uniqueName}`;
    } else if (isPdf) {
      uploadDir = path.join(process.cwd(), "public", "cv");
      publicUrl = `/cv/${uniqueName}`;
    }

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, uniqueName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
      isVideo,
      isPdf,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed: " + err.message },
      { status: 500 }
    );
  }
}
