import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const BUCKET_NAME = "portfolio-media";

/**
 * Check if Supabase credentials are configured in environment
 */
export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.startsWith("http") &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10
  );
}

/**
 * Public client (browser/anon)
 */
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Admin client with Service Role or Anon fallback (server-only)
 */
export const supabaseAdmin = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    })
  : null;

/**
 * Local fallback data helpers
 */
const localDataPath = path.join(process.cwd(), "data", "portfolio.json");

function readLocalPortfolio() {
  try {
    const file = fs.readFileSync(localDataPath, "utf8");
    return JSON.parse(file);
  } catch (err) {
    console.warn("Could not read local portfolio.json:", err.message);
    return null;
  }
}

function writeLocalPortfolio(data) {
  try {
    fs.writeFileSync(localDataPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    // In read-only serverless environments (like Vercel), this is expected to fail
    return false;
  }
}

/**
 * Fetch portfolio data: reads from Supabase first if available, falls back to local JSON
 */
export async function getPortfolioData() {
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("portfolio_data")
        .select("data")
        .eq("id", "main")
        .maybeSingle();

      if (!error && data?.data) {
        return data.data;
      }

      // If table exists but no 'main' record, seed it with local data
      const localData = readLocalPortfolio();
      if (localData) {
        await supabaseAdmin
          .from("portfolio_data")
          .upsert({ id: "main", data: localData, updated_at: new Date().toISOString() });
        return localData;
      }
    } catch (err) {
      console.error("Supabase getPortfolioData failed, falling back to local:", err.message);
    }
  }

  return readLocalPortfolio();
}

/**
 * Save portfolio data: saves to Supabase and optionally syncs local file
 */
export async function savePortfolioData(data) {
  let savedToSupabase = false;

  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("portfolio_data")
        .upsert({ id: "main", data, updated_at: new Date().toISOString() });

      if (error) {
        console.error("Supabase upsert error:", error.message);
      } else {
        savedToSupabase = true;
      }
    } catch (err) {
      console.error("Supabase savePortfolioData error:", err.message);
    }
  }

  // Also attempt local write (works in dev, safely ignored on Vercel read-only)
  writeLocalPortfolio(data);

  if (isSupabaseConfigured() && !savedToSupabase) {
    throw new Error("Failed to save data to Supabase");
  }

  return true;
}

/**
 * Upload file to Supabase Storage, with fallback to local public directory
 */
export async function uploadFileToStorage({ buffer, originalName, folderType, contentType }) {
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueName = `${Date.now()}_${safeName}`;

  const isVideo = folderType === "videos" || /\.(mp4|webm|mov)$/i.test(originalName);
  const isPdf = folderType === "cv" || /\.pdf$/i.test(originalName);

  let subFolder = "images/projects";
  if (isVideo) {
    subFolder = "videos";
  } else if (isPdf) {
    subFolder = "cv";
  } else if (folderType === "hero") {
    subFolder = "images/hero";
  } else if (folderType === "profile") {
    subFolder = "images/profile";
  }

  const getMimeType = () => {
    if (contentType) return contentType;
    if (isVideo) return "video/mp4";
    if (isPdf) return "application/pdf";
    if (/\.png$/i.test(originalName)) return "image/png";
    if (/\.webp$/i.test(originalName)) return "image/webp";
    if (/\.svg$/i.test(originalName)) return "image/svg+xml";
    if (/\.gif$/i.test(originalName)) return "image/gif";
    if (/\.avif$/i.test(originalName)) return "image/avif";
    return "image/jpeg";
  };

  const resolvedContentType = getMimeType();
  const storagePath = `${subFolder}/${uniqueName}`;

  // If Supabase is configured, upload to bucket
  if (isSupabaseConfigured() && supabaseAdmin) {
    try {
      // Ensure bucket exists (or upload directly)
      const { error } = await supabaseAdmin.storage
        .from(BUCKET_NAME)
        .upload(storagePath, buffer, {
          contentType: resolvedContentType,
          upsert: true,
        });

      if (error) {
        console.error("Supabase storage upload error:", error.message);
        throw error;
      }

      const { data: publicData } = supabaseAdmin.storage
        .from(BUCKET_NAME)
        .getPublicUrl(storagePath);

      return {
        success: true,
        url: publicData.publicUrl,
        fileName: uniqueName,
        isVideo,
        isPdf,
        storage: "supabase",
      };
    } catch (err) {
      console.error("Supabase upload failed, falling back to local if possible:", err.message);
      // Fall through to local fallback
    }
  }

  // Local filesystem fallback
  let uploadDir = path.join(process.cwd(), "public", subFolder);
  let publicUrl = `/${subFolder}/${uniqueName}`;

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueName);
  fs.writeFileSync(filePath, buffer);

  return {
    success: true,
    url: publicUrl,
    fileName: uniqueName,
    isVideo,
    isPdf,
    storage: "local",
  };
}
