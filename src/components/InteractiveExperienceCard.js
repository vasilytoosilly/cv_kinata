"use client";

import { useState, useEffect } from "react";
import SafeImage from "@/components/SafeImage";

export default function InteractiveExperienceCard({ item }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const images = item.previewImages || [];
  const hasImages = images.length > 0;

  useEffect(() => {
    if (!isHovered || images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % images.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const handleMouseEnter = () => {
    setHasInteracted(true);
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveIdx(0);
  };

  return (
    <article
      className={`experience-card-interactive ${isHovered ? "is-hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      aria-label={`${item.role} at ${item.company}`}
    >
      {/* Ambient Fading Preview Backdrop Carousel - Mounted on interaction to prevent initial lag */}
      {hasImages && hasInteracted && (
        <div className={`card-ambient-backdrop ${isHovered ? "visible" : ""}`} aria-hidden="true">
          {images.map((src, idx) => (
            <div
              key={src}
              className={`card-ambient-image-wrap ${idx === activeIdx ? "active" : ""}`}
            >
              <SafeImage
                src={src}
                alt=""
                fill
                sizes="(max-width: 860px) 100vw, 680px"
                className="card-ambient-img"
                loading="lazy"
              />
            </div>
          ))}
          {/* Deep Dark Multi-Stop Scrim for WCAG AAA Text Contrast */}
          <div className="card-ambient-scrim" />
        </div>
      )}

      {/* Card Foreground Content */}
      <div className="card-content-layer">
        <div className="card-meta-row">
          <div className="meta-left">
            <span className="card-period">{item.period}</span>
            <span className="meta-divider">·</span>
            <span className="card-company">{item.company}</span>
          </div>

          {/* Riot-Style Work Preview Indicator */}
          {hasImages && (
            <div className={`card-preview-indicator ${isHovered ? "show" : ""}`}>
              <span className="preview-label">WORK PREVIEW</span>
              {images.length > 1 && (
                <div className="preview-pips" aria-hidden="true">
                  {images.map((_, pIdx) => (
                    <span
                      key={pIdx}
                      className={`preview-pip ${pIdx === activeIdx ? "active" : ""}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <h3 className="card-role-title">{item.role}</h3>
        <p className="card-description">{item.description}</p>

        <div className="card-tags">
          {item.tags.map((t, idx) => (
            <span key={idx} className="tag-chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
