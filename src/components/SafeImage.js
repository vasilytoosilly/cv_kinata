"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/**
 * Resilient image component that prevents Next.js from throwing unhandled exceptions
 * on invalid paths, missing leading slashes, external URLs, or broken image links.
 */
export default function SafeImage({
  src,
  alt = "",
  fill,
  width,
  height,
  sizes,
  className,
  style,
  priority = false,
  loading,
  unoptimized = false,
  fallbackText = "NO IMAGE",
}) {
  const [hasError, setHasError] = useState(false);

  // Normalize src
  let cleanSrc = typeof src === "string" ? src.trim() : "";
  const isExternal =
    cleanSrc.startsWith("http://") ||
    cleanSrc.startsWith("https://") ||
    cleanSrc.startsWith("data:") ||
    cleanSrc.startsWith("blob:");

  if (cleanSrc && !cleanSrc.startsWith("/") && !isExternal) {
    cleanSrc = `/${cleanSrc}`;
  }

  // Validate syntax of external URL
  let isValidUrl = Boolean(cleanSrc);
  if (isExternal && (cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://"))) {
    try {
      const parsed = new URL(cleanSrc);
      if (!parsed.hostname || parsed.hostname.length < 3) {
        isValidUrl = false;
      }
    } catch {
      isValidUrl = false;
    }
  }

  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // If source is empty, invalid, or failed to load, display fallback placeholder
  if (!cleanSrc || !isValidUrl || hasError) {
    const placeholderStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      border: "1px dashed rgba(255, 255, 255, 0.15)",
      color: "var(--text-muted, #737373)",
      fontFamily: "var(--font-code, monospace)",
      fontSize: "0.72rem",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      gap: "4px",
      ...(fill
        ? { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }
        : { width: width || "100%", height: height || "100%" }),
      ...style,
    };

    return (
      <div className={`safe-image-placeholder ${className || ""}`} style={placeholderStyle}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span>{fallbackText}</span>
      </div>
    );
  }

  // For external images (Supabase, Unsplash, etc.) or when unoptimized is requested,
  // render standard <img> to avoid Next.js URL constructor crashes and domain proxy blocks.
  if (isExternal || unoptimized) {
    const imgStyle = {
      ...(fill
        ? { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }
        : {
            width: width ? (typeof width === "number" ? `${width}px` : width) : "auto",
            height: height ? (typeof height === "number" ? `${height}px` : height) : "auto",
          }),
      ...style,
    };

    return (
      <img
        src={cleanSrc}
        alt={alt}
        className={className}
        style={imgStyle}
        loading={priority ? "eager" : loading || "lazy"}
        onError={() => setHasError(true)}
      />
    );
  }

  // For local relative paths on public pages, use Next.js optimized Image
  const imageProps = {
    src: cleanSrc,
    alt,
    className,
    style,
    priority,
    loading,
    onError: () => setHasError(true),
  };

  if (fill) {
    imageProps.fill = true;
    if (sizes) imageProps.sizes = sizes;
  } else {
    if (width) imageProps.width = width;
    if (height) imageProps.height = height;
  }

  return <Image {...imageProps} />;
}
