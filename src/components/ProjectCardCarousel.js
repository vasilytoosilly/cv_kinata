"use client";

import { useState, useEffect, useRef } from "react";
import SafeImage from "@/components/SafeImage";

export default function ProjectCardCarousel({ project, priority = false }) {
  const images = Array.isArray(project.images) && project.images.length > 0
    ? project.images.filter(Boolean)
    : (project.image ? [project.image] : []);

  const isCarousel = Boolean(project.carousel !== false && images.length > 1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayTimerRef = useRef(null);

  // Auto-cycle through images on hover
  useEffect(() => {
    if (!isCarousel || !isHovered) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 2400);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isCarousel, isHovered, images.length]);

  const handleMouseEnter = () => {
    if (isCarousel) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isCarousel) {
      setIsHovered(false);
      setCurrentIndex(0); // Return to cover photo on leave
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleDotClick = (e, idx) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  // Single image (default static card)
  if (!isCarousel) {
    return (
      <div className="project-image-wrap">
        <SafeImage
          src={project.image || images[0]}
          alt={project.title}
          width={800}
          height={450}
          className="project-image"
          loading={priority ? "eager" : "lazy"}
          priority={priority}
        />
        <span className="project-category-badge">
          {project.categoryLabel}
        </span>
      </div>
    );
  }

  // Multi-image carousel card (strictly contained in the same 16:9 box)
  return (
    <div
      className="project-image-wrap project-carousel-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`project-carousel-slide ${idx === currentIndex ? "active" : ""}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: idx === currentIndex ? 1 : 0,
            transition: "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            zIndex: idx === currentIndex ? 1 : 0,
            pointerEvents: idx === currentIndex ? "auto" : "none",
          }}
        >
          <SafeImage
            src={src}
            alt={`${project.title} — Slide ${idx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="project-image"
            style={{ objectFit: "cover" }}
            loading={idx === 0 && priority ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Category Badge (preserved at top-left) */}
      <span className="project-category-badge" style={{ zIndex: 3 }}>
        {project.categoryLabel}
      </span>

      {/* Slide Counter Pill (top-right, shows total slides) */}
      <div className="project-carousel-pill" aria-label={`Slide ${currentIndex + 1} of ${images.length}`}>
        <span className="project-carousel-pill-dot" />
        <span>{currentIndex + 1} / {images.length}</span>
      </div>

      {/* Manual Chevron Arrows (appear on hover) */}
      <button
        type="button"
        className="project-carousel-arrow project-carousel-arrow-prev"
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        type="button"
        className="project-carousel-arrow project-carousel-arrow-next"
        onClick={handleNext}
        aria-label="Next slide"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Tactical Segmented Dash Indicators (bottom center) */}
      <div className="project-carousel-indicators" role="tablist" aria-label="Slide indicators">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            role="tab"
            className={`project-carousel-indicator-bar ${idx === currentIndex ? "active" : ""}`}
            onClick={(e) => handleDotClick(e, idx)}
            aria-label={`Go to slide ${idx + 1}`}
            aria-selected={idx === currentIndex}
          />
        ))}
      </div>
    </div>
  );
}
