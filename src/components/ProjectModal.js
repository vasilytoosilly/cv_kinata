"use client";

import { useEffect } from "react";
import SafeImage from "@/components/SafeImage";

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!project) return null;

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

        <div className="modal-image-wrap">
          <SafeImage
            src={project.image}
            alt={project.title}
            width={1200}
            height={675}
            className="modal-image"
            priority
          />
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
                <span>VIEW SHOWCASE ON {project.category === "3d-cgi" ? "ARTSTATION" : project.category === "graphic-motion" ? "BEHANCE" : "SOURCE"}</span>
                <span className="btn-arrow">↗</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
