"use client";

import { useState } from "react";
import Link from "next/link";
import portfolioData from "@/../data/portfolio.json";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import ProjectModal from "@/components/ProjectModal";

export default function ArchivePage() {
  const { profile, projects, activityFeed } = portfolioData;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeProject, setActiveProject] = useState(null);

  // Additional archive items
  const archiveItems = [
    ...projects,
    {
      id: "arc-drone-sculpt",
      title: "Tactical Drone Hard-Surface Speed Modeling",
      category: "3d-film-environment",
      categoryLabel: "3D Hard-Surface",
      year: "2024",
      image: "/images/projects/hardsurface_mech.jpg",
      summary: "Eksplorasi teknik boolean cutters, bevel weights, dan normal baking di Blender.",
      tools: ["Blender", "HardOps", "Substance Painter"],
      link: "https://artstation.com"
    },
    {
      id: "arc-cafe-branding",
      title: "Panjoel Cafe — Visual Identity & Social Design",
      category: "commercial-video",
      categoryLabel: "Commercial & Branding",
      year: "2025",
      image: "/images/projects/marketing_reels.jpg",
      summary: "Modern typography-driven physical menu system and promotional Instagram templates.",
      tools: ["Photoshop", "Canva", "Print Design"],
      link: "https://instagram.com"
    },
    {
      id: "arc-discord-bot",
      title: "Veritas Automation & Community Tools",
      category: "web-creative-tech",
      categoryLabel: "Automation & Web",
      year: "2024",
      image: "/images/projects/game_ui_kit.jpg",
      summary: "Utility system dan otomatisasi workflow untuk komunitas kreatif ReA3 Studio.",
      tools: ["JavaScript", "Node.js", "Discord API"],
      link: "https://github.com"
    }
  ];

  const filteredItems = archiveItems.filter((item) => {
    const matchesCat = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tools?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.categoryLabel?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <Navbar activityFeed={activityFeed} />

      <main className="archive-page-container">
        <Link href="/" className="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>BACK TO PORTFOLIO</span>
        </Link>

        <div>
          <div className="section-label">CHRONOLOGICAL ARCHIVE</div>
          <h1 className="section-heading" style={{ marginBottom: "8px" }}>
            All Works & Archives
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: "620px" }}>
            A comprehensive record of 3D modeling commissions, architectural renders, graphic campaigns, and experimental software tools.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", margin: "32px 0 20px 0" }}>
          <div className="project-filter-bar" style={{ margin: 0 }}>
            {[
              { id: "all", label: "ALL WORKS" },
              { id: "commercial-video", label: "COMMERCIAL & VIDEO" },
              { id: "3d-film-environment", label: "3D FILM & ENVIRONMENT" },
              { id: "game-assets-animation", label: "GAME ASSETS & ANIMATION" },
              { id: "web-creative-tech", label: "WEB & CREATIVE TECH" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ minWidth: "240px", flex: "1", maxWidth: "340px" }}>
            <input
              type="text"
              placeholder="Search projects or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input"
              style={{ padding: "8px 14px", fontSize: "0.85rem" }}
            />
          </div>
        </div>

        {/* Archive Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="archive-table">
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Year</th>
                <th>Project</th>
                <th>Category</th>
                <th>Built With</th>
                <th style={{ textAlign: "right" }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, i) => (
                <tr key={i} onClick={() => setActiveProject(item)} style={{ cursor: "pointer" }}>
                  <td style={{ fontFamily: "var(--font-code)", color: "var(--accent)", fontSize: "0.82rem", fontWeight: 600 }}>
                    {item.year}
                  </td>
                  <td>
                    <div className="archive-project-name">{item.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
                      {item.summary}
                    </div>
                  </td>
                  <td>
                    <span className="tag-chip" style={{ fontSize: "0.72rem" }}>
                      {item.categoryLabel}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {item.tools?.slice(0, 3).map((tool, idx) => (
                        <span key={idx} style={{ fontSize: "0.74rem", color: "var(--text-secondary)" }}>
                          {tool}{idx < Math.min(2, item.tools.length - 1) ? " ·" : ""}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span style={{ color: "var(--text-primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                      ↗
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <StatusBadge
        status={profile.status}
        whatsappUrl={profile.whatsappUrl}
        email={profile.email}
      />

      {activeProject && (
        <ProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </>
  );
}
