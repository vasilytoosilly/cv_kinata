"use client";

import { useState } from "react";
import Link from "next/link";
import portfolioData from "@/../data/portfolio.json";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";

export default function ResumePage() {
  const { profile, resumeTracks, experience, awards, skills, activityFeed } = portfolioData;
  const [selectedTrackId, setSelectedTrackId] = useState("track-cgi");

  const currentTrack = resumeTracks.find((t) => t.id === selectedTrackId) || resumeTracks[0];

  return (
    <>
      <Navbar activityFeed={activityFeed} />

      <main className="resume-page-container">
        <Link href="/" className="back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>Back to Portfolio</span>
        </Link>

        <div className="resume-header-block">
          <div>
            <div className="section-label">CURATED CURRICULUM VITAE</div>
            <h1 className="section-heading" style={{ marginBottom: "6px" }}>
              Interactive Résumé
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", maxWidth: "620px" }}>
              Select a specialized track to inspect tailored experience and technical competencies, or download the official print PDF.
            </p>
          </div>

          <a
            href={currentTrack.pdfUrl}
            download
            className="btn-primary-action"
            style={{ alignSelf: "flex-start", marginTop: "8px" }}
          >
            <span>Download {currentTrack.name} (PDF)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </a>
        </div>

        {/* Track Selector Tabs */}
        <div className="resume-track-selector" role="tablist">
          {resumeTracks.map((track) => (
            <button
              key={track.id}
              type="button"
              role="tab"
              aria-selected={selectedTrackId === track.id}
              className={`track-select-tab ${selectedTrackId === track.id ? "active" : ""}`}
              onClick={() => setSelectedTrackId(track.id)}
            >
              {track.name}
            </button>
          ))}
        </div>

        {/* Resume Paper Sheet */}
        <div className="resume-paper-sheet">
          {/* Header Info */}
          <div className="resume-sheet-header">
            <div className="resume-sheet-top-row">
              <div>
                <h2 className="resume-candidate-handle">
                  {profile.handle}
                </h2>
                <div className="resume-candidate-name">
                  {profile.fullName}
                </div>
                <div className="resume-track-tagline">
                  {currentTrack.tagline}
                </div>
              </div>

              <div className="resume-contact-col">
                <div><span>Location:</span> {profile.location}</div>
                <div><span>Email:</span> {profile.email}</div>
                <div><span>Phone:</span> {profile.phone}</div>
              </div>
            </div>

            {/* Track Summary Callout */}
            <div className="resume-overview-box">
              <strong className="resume-overview-prefix">Focus: </strong>
              {currentTrack.summary}
            </div>
          </div>

          {/* Experience Section */}
          <section>
            <h3 className="resume-sec-title">Work Experience</h3>
            <div className="resume-card-stack">
              {selectedTrackId === "track-cgi" ? (
                <>
                  <div className="experience-card">
                    <div className="card-meta-row">
                      <span className="card-period">2024 — PRESENT</span>
                      <span className="card-company">Global Remote</span>
                    </div>
                    <h4 className="card-role-title">Freelance 3D Artist — Hard-Surface & Environment Specialist</h4>
                    <p className="card-description">
                      Executed over 10 freelance 3D modeling commissions for international gaming and archviz clients. Handled end-to-end pipeline: high/low poly modeling, retopology, UV unwrapping, PBR texturing in Substance Painter, and photoreal rendering.
                    </p>
                    <div className="card-tags">
                      {["Blender", "Autodesk Maya", "Substance 3D Painter", "Photoshop", "Cycles", "Archviz"].map((t, i) => (
                        <span key={i} className="tag-chip">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="experience-card">
                    <div className="card-meta-row">
                      <span className="card-period">MAR 2024 — DEC 2024</span>
                      <span className="card-company">PT Wong Bejo Joyo</span>
                    </div>
                    <h4 className="card-role-title">Digital Marketing & Videographer Intern</h4>
                    <p className="card-description">
                      Directed and edited 30+ property promotional videos for Reels and TikTok. Collaborated with marketing team on digital advertising and media assets.
                    </p>
                    <div className="card-tags">
                      {["Premiere Pro", "CapCut Pro", "Photoshop", "Property Video Production"].map((t, i) => (
                        <span key={i} className="tag-chip">{t}</span>
                      ))}
                    </div>
                  </div>
                </>
              ) : selectedTrackId === "track-marketing" ? (
                <>
                  <div className="experience-card">
                    <div className="card-meta-row">
                      <span className="card-period">MAR 2024 — DEC 2024</span>
                      <span className="card-company">PT Wong Bejo Joyo</span>
                    </div>
                    <h4 className="card-role-title">Digital Marketing & Videographer Intern</h4>
                    <p className="card-description">
                      Spearheaded short-form video production producing 30+ promotional property videos. Increased social media engagement by 45% and follower count by 20%. Handled audience analytics, hashtag strategy, and Meta Business Suite campaigns.
                    </p>
                    <div className="card-tags">
                      {["Meta Business Suite", "Premiere Pro", "CapCut Pro", "Google Analytics", "Content Strategy"].map((t, i) => (
                        <span key={i} className="tag-chip">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="experience-card">
                    <div className="card-meta-row">
                      <span className="card-period">2024 — PRESENT</span>
                      <span className="card-company">Independent Creative</span>
                    </div>
                    <h4 className="card-role-title">Freelance Visual Designer & 3D Artist</h4>
                    <p className="card-description">
                      Provided commercial visual identity, social media graphics, and promotional 3D visualizations for local businesses and independent creators.
                    </p>
                    <div className="card-tags">
                      {["Photoshop", "Canva", "Brand Identity", "Motion Graphics"].map((t, i) => (
                        <span key={i} className="tag-chip">{t}</span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                experience.map((exp, i) => (
                  <div key={i} className="experience-card">
                    <div className="card-meta-row">
                      <span className="card-period">{exp.period}</span>
                      <span className="card-company">{exp.company}</span>
                    </div>
                    <h4 className="card-role-title">{exp.role}</h4>
                    <p className="card-description">{exp.description}</p>
                    <div className="card-tags">
                      {exp.tags.map((t, idx) => (
                        <span key={idx} className="tag-chip">{t}</span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Education & Achievements */}
          <section>
            <h3 className="resume-sec-title">Education & Credentials</h3>
            <div className="resume-card-stack">
              <div className="experience-card" style={{ padding: "18px 22px" }}>
                <div className="card-meta-row">
                  <span className="card-period">2022 — 2025</span>
                  <span className="card-company">GPA 83.27</span>
                </div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.02rem" }}>
                  SMK Negeri 2 Surabaya — Jurusan Animasi
                </div>
                <div style={{ color: "var(--accent)", fontSize: "0.85rem", marginTop: "4px", fontWeight: 600 }}>
                  Juara 1 Lomba 3D Modeling satu angkatan kelas 10 Jurusan Animasi
                </div>
                <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                  Relevant Studies: 3D Modeling, Animation Pipelines, Maya, Blender, Video Editing & Sound Design. Final Project: 3D Short Film.
                </p>
              </div>

              <div className="experience-card" style={{ padding: "18px 22px" }}>
                <div className="card-meta-row">
                  <span className="card-period">2013 — 2019</span>
                  <span className="card-company">Surabaya, Indonesia</span>
                </div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "1.02rem" }}>
                  Khadijah 2 Primary School — International Class Program
                </div>
                <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                  Cambridge International Examination (CIE Centre UD 268). Bilingual education in English & Indonesian.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Skills & Languages */}
          <section>
            <h3 className="resume-sec-title">Skills & Languages</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
              <div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Primary Tools
                </div>
                <div className="card-tags">
                  {skills["3D & CGI Visualization"]?.slice(0, 6).map((s, i) => (
                    <span key={i} className="tag-chip">{s}</span>
                  ))}
                  {skills["Graphic & Motion Design"]?.slice(0, 4).map((s, i) => (
                    <span key={i} className="tag-chip">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.88rem", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Languages & Communication
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div><strong style={{ color: "var(--text-primary)" }}>Indonesian:</strong> Native speaker</div>
                  <div><strong style={{ color: "var(--text-primary)" }}>English:</strong> Intermediate / Cambridge CIE verified</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <StatusBadge
        status={profile.status}
        whatsappUrl={profile.whatsappUrl}
        email={profile.email}
      />
    </>
  );
}
