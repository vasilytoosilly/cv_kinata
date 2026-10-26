import { NextResponse } from "next/server";
import { uploadFileToStorage } from "@/lib/supabase";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const isVideo = folderType === "videos" || /\.(mp4|webm|mov)$/i.test(file.name);
    const isPdf = folderType === "cv" || /\.pdf$/i.test(file.name);

    // Validate size (Images: 25MB, Videos: 100MB, PDFs: 50MB)
    const maxBytes = isVideo ? 100 * 1024 * 1024 : isPdf ? 50 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { success: false, message: `File size exceeds the limit (${Math.round(maxBytes / (1024 * 1024))}MB)` },
        { status: 400 }
      );
    }

    // Validate file extensions
    const validExtensions = isVideo
      ? /\.(mp4|webm|mov)$/i
      : isPdf
      ? /\.pdf$/i
      : /\.(jpg|jpeg|png|webp|gif|svg|avif)$/i;

    if (!validExtensions.test(file.name)) {
      return NextResponse.json(
        { success: false, message: `Unsupported file format. Please upload a supported ${isVideo ? "video" : isPdf ? "PDF" : "image"} file.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadFileToStorage({
      buffer,
      originalName: file.name,
      folderType,
      contentType: file.type,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { success: false, message: "Upload failed: " + err.message },
      { status: 500 }
    );
  }
}
