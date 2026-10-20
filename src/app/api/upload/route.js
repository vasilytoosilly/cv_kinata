import { NextResponse } from "next/server";
import { uploadFileToStorage } from "@/lib/supabase";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const folderType = data.get("folder");

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
