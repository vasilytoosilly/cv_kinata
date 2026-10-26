"use client";

import { useState, useEffect } from "react";
import SafeImage from "@/components/SafeImage";

const getShowcaseLabel = (link, category) => {
  if (!link) return "SOURCE";
  const url = link.toLowerCase();
  if (url.includes("artstation")) return "ARTSTATION";
  if (url.includes("instagram")) return "INSTAGRAM";
  if (url.includes("youtube") || url.includes("youtu.be")) return "YOUTUBE";
  if (url.includes("behance")) return "BEHANCE";
  if (url.includes("github")) return "GITHUB";
  if (category === "3d-cgi" || category === "3d-film-environment" || category === "game-assets-animation") return "ARTSTATION";
  if (category === "commercial-video") return "INSTAGRAM";
  return "SOURCE";
};

export default function ProjectModal({ project, onClose }) {
  const images = Array.isArray(project?.images) && project.images.length > 0
    ? project.images.filter(Boolean)
    : (project?.image ? [project.image] : []);

  const hasMultiple = images.length > 1;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      } else if (hasMultiple) {
        if (e.key === "ArrowLeft") {
          setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
        } else if (e.key === "ArrowRight") {
          setActiveIdx((prev) => (prev + 1) % images.length);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose, hasMultiple, images.length]);

  if (!project) return null;

  const currentSrc = images[activeIdx] || project.image;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close project modal"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="modal-image-wrap" style={{ position: "relative" }}>
          <SafeImage
            src={currentSrc}
            alt={`${project.title} — Image ${activeIdx + 1}`}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="modal-image"
            style={{ objectFit: "cover" }}
            priority
          />

          {hasMultiple && (
            <>
              {/* Slide Counter */}
              <div className="modal-carousel-counter">
                <span>{activeIdx + 1} / {images.length}</span>
              </div>

              {/* Prev / Next Arrows */}
              <button
                type="button"
                className="modal-carousel-arrow modal-carousel-arrow-prev"
                onClick={() => setActiveIdx((prev) => (prev - 1 + images.length) % images.length)}
                aria-label="Previous image"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                type="button"
                className="modal-carousel-arrow modal-carousel-arrow-next"
                onClick={() => setActiveIdx((prev) => (prev + 1) % images.length)}
                aria-label="Next image"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {/* Thumbnail Strip / Dot Indicators */}
              <div className="modal-carousel-dots" role="tablist" aria-label="Modal slide indicators">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    className={`modal-carousel-dot ${idx === activeIdx ? "active" : ""}`}
                    onClick={() => setActiveIdx(idx)}
                    aria-label={`Show image ${idx + 1}`}
                    aria-selected={idx === activeIdx}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="modal-content-body">
          <div className="modal-meta-row">
            <span className="project-category-badge static-badge">
              {project.categoryLabel}
            </span>
            <span className="modal-year">
              {project.year}
            </span>
          </div>

          <h2 className="modal-title">{project.title}</h2>
          {project.role && (
            <div className="modal-role-tag">
              {project.role}
            </div>
          )}

          <p className="modal-desc">{project.description || project.summary}</p>

          {project.stats && (
            <div className="modal-stats-box">
              <span className="stat-highlight-tag">METRIC</span>
              <span>{project.stats}</span>
            </div>
          )}

          <div>
            <div className="modal-section-label">
              Pipeline & Tools
            </div>
            <div className="card-tags">
              {project.tools?.map((tool, i) => (
                <span key={i} className="tag-chip">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {project.link && (
            <div style={{ marginTop: "12px" }}>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sweep-primary"
              >
                <span>VIEW SHOWCASE ON {getShowcaseLabel(project.link, project.category)}</span>
                <span className="btn-arrow">↗</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
