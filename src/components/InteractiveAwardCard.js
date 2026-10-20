"use client";

import { useState } from "react";
import Image from "next/image";

export default function InteractiveAwardCard({ award }) {
  const [isHovered, setIsHovered] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const images = award.previewImages || [];
  const hasImages = images.length > 0;

  const handleMouseEnter = () => {
    setHasInteracted(true);
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`award-card-interactive ${isHovered ? "is-hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      tabIndex={0}
      aria-label={`${award.title} (${award.year})`}
    >
      {/* Ambient Preview Backdrop - Mounted on interaction to prevent initial lag */}
      {hasImages && hasInteracted && (
        <div className={`card-ambient-backdrop ${isHovered ? "visible" : ""}`} aria-hidden="true">
          <div className="card-ambient-image-wrap active">
            <Image
              src={images[0]}
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 680px"
              className="card-ambient-img"
              loading="lazy"
            />
          </div>
          <div className="card-ambient-scrim" />
        </div>
      )}

      {/* Card Foreground Content */}
      <div className="card-content-layer">
        <div className="card-meta-row">
          <div className="meta-left">
            <span className="award-year">{award.year}</span>
            <span className="meta-divider">·</span>
            <span className="award-issuer">{award.issuer}</span>
          </div>

          {hasImages && (
            <div className={`card-preview-indicator ${isHovered ? "show" : ""}`}>
              <span className="preview-label">PROJECT PREVIEW</span>
            </div>
          )}
        </div>

        <div className="award-title">{award.title}</div>
        <p className="award-detail">{award.detail}</p>
      </div>
    </div>
  );
}
