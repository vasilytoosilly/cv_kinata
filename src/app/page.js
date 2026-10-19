"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import portfolioData from "@/../data/portfolio.json";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import ProjectModal from "@/components/ProjectModal";

/* Inline SVG icons — clean, standard vector marks */
const SocialIcon = ({ name }) => {
  const icons = {
    ArtStation: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 17.723l2.027 3.505h.001a2.424 2.424 0 0 0 2.164 1.333h13.457l-2.792-4.838H0zm24-2.218a2.42 2.42 0 0 0-.468-1.432L14.837 .556a2.42 2.42 0 0 0-2.106-1.218h-3.82L20.37 19.225 24 12.676v2.829zM4.453 14.11L8.726 6.57l4.272 7.54H4.453z"/>
      </svg>
    ),
    Behance: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-.11 1.36-.455.36-.985.64-1.59.81-.606.18-1.253.26-1.94.26H0V4.51h6.938v-.007zM6.545 10.16c.6 0 1.096-.16 1.486-.48.39-.32.58-.78.58-1.39 0-.35-.07-.64-.2-.88-.13-.24-.3-.43-.52-.57-.22-.14-.47-.24-.74-.3-.27-.06-.56-.09-.86-.09H3.72v3.71h2.82zm.17 5.98c.33 0 .63-.04.9-.12.27-.08.5-.2.69-.35.19-.15.34-.36.44-.6.1-.24.15-.54.15-.9 0-.69-.22-1.2-.65-1.53-.43-.33-.99-.5-1.69-.5H3.72v3.99h2.99v.01zM15.76 14.56c.36.42.91.63 1.65.63.52 0 .97-.13 1.35-.38.38-.26.62-.51.71-.78h2.36c-.38 1.12-.95 1.93-1.72 2.44-.77.51-1.7.77-2.79.77-.76 0-1.44-.12-2.04-.37-.6-.25-1.11-.6-1.54-1.07-.43-.46-.76-1.01-.99-1.66-.23-.65-.35-1.37-.35-2.14 0-.75.12-1.45.36-2.09.24-.64.58-1.19 1.01-1.65.43-.46.95-.82 1.56-1.08.6-.26 1.27-.38 1.99-.38.81 0 1.52.16 2.12.47.6.31 1.1.74 1.48 1.29.39.55.67 1.18.84 1.9.17.72.23 1.49.17 2.32H15.31c.04.81.26 1.42.62 1.83l-.17-.01zm2.9-4.48c-.29-.36-.75-.55-1.37-.55-.4 0-.73.07-.99.21-.26.14-.47.32-.63.53-.15.21-.26.44-.32.68-.06.24-.1.46-.1.66h4.22c-.1-.75-.38-1.29-.8-1.53h-.01zM14.76 5.59h5.27v1.35h-5.27V5.59z"/>
      </svg>
    ),
    LinkedIn: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    Instagram: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 1 0 0-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 1 1-2.88 0 1.441 1.441 0 0 1 2.88 0z"/>
      </svg>
    ),
    GitHub: (
      <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    ),
    Email: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  };

  return icons[name] || null;
};

export default function Home() {
  const { profile, about, experience, awards, projects, skills, activityFeed } = portfolioData;

  const [activeSection, setActiveSection] = useState("about");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["about", "experience", "projects", "skills"];
      const scrollPosition = window.scrollY + 220;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProjects = selectedCategory === "all"
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  return (
    <>
      <Navbar activityFeed={activityFeed} />

      <main className="layout-shell">
        <div className="two-column-layout">

          {/* ================= STICKY LEFT PANEL (Pradipta layout) ================= */}
          <aside className="left-panel">
            <div className="hero-identity">
              <h1 className="main-handle">{profile.handle}</h1>
              <div className="full-legal-name">{profile.fullName}</div>
              <div className="role-badge-text">{profile.role}</div>
              <p className="hero-tagline">{profile.tagline}</p>

              {/* Clean Section Navigation with Indicator Line */}
              <nav className="section-nav" aria-label="Section navigation">
                {[
                  { id: "about", label: "ABOUT" },
                  { id: "experience", label: "EXPERIENCE" },
                  { id: "projects", label: "PROJECTS" },
                  { id: "skills", label: "SKILLS" },
                ].map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className={`nav-anchor ${activeSection === s.id ? "active" : ""}`}
                  >
                    <span className="nav-anchor-indicator" />
                    <span>{s.label}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="left-footer">
              <div className="quick-action-row">
                <Link href="/resume" className="btn-primary-action">
                  <span>View Résumé</span>
                  <span>↗</span>
                </Link>
                <a
                  href={profile.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary-action"
                >
                  <span>Chat Direct</span>
                </a>
              </div>

              <div className="social-links">
                {profile.socials.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-icon-btn"
                    title={s.name}
                    aria-label={`Visit ${s.name}`}
                  >
                    <SocialIcon name={s.name} />
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* ================= SCROLLING RIGHT PANEL ================= */}
          <section className="right-panel">

            {/* ABOUT */}
            <section id="about" className="content-section">
              <h2 className="section-heading">Identity & Story</h2>

              <div className="about-prose">
                {about.map((p, i) => (
                  <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(
                    /(SMKN 2 Surabaya|10 freelance 3D commissions|PT Wong Bejo Joyo|Blender, Autodesk Maya, and Substance 3D Painter)/g,
                    '<strong>$1</strong>'
                  ) }} />
                ))}
              </div>

              {/* 3 Real Metric Highlights */}
              <div className="about-highlight-box">
                <div className="stat-item">
                  <div className="stat-number">10+</div>
                  <div className="stat-label">Global 3D Commissions</div>
                  <div className="stat-sub">Client projects across gaming & archviz</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number stat-gold">1st</div>
                  <div className="stat-label">3D Modeling Competition</div>
                  <div className="stat-sub">Jurusan Animasi SMKN 2 Surabaya</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">30+</div>
                  <div className="stat-label">Property Videos Produced</div>
                  <div className="stat-sub">Commercial video & marketing assets</div>
                </div>
              </div>
            </section>

            {/* EXPERIENCE */}
            <section id="experience" className="content-section">
              <h2 className="section-heading">Career & Milestones</h2>

              <div className="experience-list">
                {experience.map((exp, i) => (
                  <article key={i} className="experience-card">
                    <div className="card-meta-row">
                      <span className="card-period">{exp.period}</span>
                      <span className="card-company">{exp.company}</span>
                    </div>
                    <h3 className="card-role-title">{exp.role}</h3>
                    <p className="card-description">{exp.description}</p>
                    <div className="card-tags">
                      {exp.tags.map((t, idx) => (
                        <span key={idx} className="tag-chip">{t}</span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div style={{ marginTop: "32px" }}>
                <h3 className="sub-section-title">
                  Honors & Education
                </h3>
                <div className="awards-list">
                  {awards.map((awd, i) => (
                    <div key={i} className="award-card">
                      <div className="card-meta-row">
                        <span className="award-year">{awd.year}</span>
                        <span className="award-issuer">{awd.issuer}</span>
                      </div>
                      <div className="award-title">
                        {awd.title}
                      </div>
                      <p className="award-detail">
                        {awd.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/resume" className="section-full-link">
                <span>View Full Résumé</span>
                <span>↗</span>
              </Link>
            </section>

            {/* PROJECTS */}
            <section id="projects" className="content-section">
              <h2 className="section-heading">Featured Work</h2>

              {/* Category Filter Tabs */}
              <div className="project-filter-bar" role="tablist">
                {[
                  { id: "all", label: "All" },
                  { id: "3d-cgi", label: "3D & CGI" },
                  { id: "graphic-motion", label: "Graphic & Motion" },
                  { id: "ui-ux", label: "UI / UX" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedCategory === cat.id}
                    className={`filter-btn ${selectedCategory === cat.id ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="projects-feed">
                {filteredProjects.map((project) => (
                  <article
                    key={project.id}
                    className="project-card"
                    onClick={() => setSelectedProject(project)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedProject(project);
                      }
                    }}
                    aria-label={`View ${project.title}`}
                  >
                    <div className="project-image-wrap">
                      <Image
                        src={project.image}
                        alt={project.title}
                        width={800}
                        height={450}
                        className="project-image"
                        loading="lazy"
                      />
                      <span className="project-category-badge">
                        {project.categoryLabel}
                      </span>
                    </div>

                    <div className="project-body">
                      <div className="project-title-row">
                        <h3 className="project-title">{project.title}</h3>
                        <span className="project-arrow">↗</span>
                      </div>
                      <p className="project-summary">{project.summary}</p>
                      {project.stats && (
                        <div className="project-stats-row">
                          {project.stats}
                        </div>
                      )}
                      <div className="card-tags">
                        {project.tools.map((tool, tIdx) => (
                          <span key={tIdx} className="tag-chip">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Link href="/archive" className="section-full-link">
                <span>View Full Project Archive</span>
                <span>↗</span>
              </Link>
            </section>

            {/* SKILLS */}
            <section id="skills" className="content-section">
              <h2 className="section-heading">Technical Skills</h2>

              <div className="skills-grid">
                {Object.entries(skills).map(([catName, skillList], i) => (
                  <div key={i} className="skills-category-card">
                    <h3 className="skills-cat-title">{catName}</h3>
                    <div className="skills-chips-row">
                      {skillList.map((sk, idx) => (
                        <span key={idx} className="skill-chip">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FOOTER */}
            <footer className="site-footer">
              <div className="footer-left">
                © 2026 {profile.fullName} · Surabaya, Indonesia
              </div>
              <Link href="/admin/login" className="footer-admin-link" title="Control Room Login">
                Control Room ↗
              </Link>
            </footer>

          </section>

        </div>
      </main>

      <StatusBadge
        status={profile.status}
        whatsappUrl={profile.whatsappUrl}
        email={profile.email}
        phone={profile.phone}
      />

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
