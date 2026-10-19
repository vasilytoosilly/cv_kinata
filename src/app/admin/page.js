"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("add-project");

  // Form states for new project
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("3d-cgi");
  const [categoryLabel, setCategoryLabel] = useState("3D & CGI Art");
  const [year, setYear] = useState("2026");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState("");
  const [link, setLink] = useState("");
  const [stats, setStats] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/projects/archviz_interior.jpg");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Check auth
  useEffect(() => {
    const token = localStorage.getItem("kinata_admin_token");
    if (!token) {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
      fetchProjects();
    }
  }, [router]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setFeedbackMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.url);
        setFeedbackMsg(`✓ Image uploaded successfully: ${data.fileName}`);
      } else {
        setFeedbackMsg(`❌ Upload failed: ${data.message}`);
      }
    } catch {
      setFeedbackMsg("❌ Server connection error during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedbackMsg("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          categoryLabel,
          year,
          summary,
          description,
          tools,
          link,
          stats,
          image: imageUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg("✓ Project published to live portfolio!");
        // Reset form
        setTitle("");
        setSummary("");
        setDescription("");
        setTools("");
        setStats("");
        setLink("");
        fetchProjects();
        setActiveTab("manage-projects");
      } else {
        setFeedbackMsg(`❌ Failed to publish: ${data.message}`);
      }
    } catch {
      setFeedbackMsg("❌ Error submitting project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("Are you sure you want to remove this project from the portfolio?")) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kinata_admin_token");
    localStorage.removeItem("kinata_admin_email");
    router.push("/");
  };

  if (!authenticated) return null;

  return (
    <div style={{ minHeight: "100vh", padding: "32px 24px 96px 24px", maxWidth: "1080px", margin: "0 auto", position: "relative", zIndex: 2 }}>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "20px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <Link href="/" style={{ fontSize: "0.84rem", color: "var(--text-secondary)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span>&larr;</span> Return to Public Portfolio
          </Link>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "#ffffff", marginTop: "6px" }}>
            Control Room Dashboard
          </h1>
          <p style={{ fontSize: "0.86rem", color: "var(--text-muted)" }}>
            Logged in as Kinata System Operator
          </p>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          className="btn-secondary-action"
          style={{ padding: "8px 16px", fontSize: "0.84rem" }}
        >
          Sign Out 🚪
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
        <button
          type="button"
          onClick={() => setActiveTab("add-project")}
          className={`filter-btn ${activeTab === "add-project" ? "active" : ""}`}
        >
          ➕ Add New Project
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("manage-projects")}
          className={`filter-btn ${activeTab === "manage-projects" ? "active" : ""}`}
        >
          📋 Manage Projects ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("deploy-guide")}
          className={`filter-btn ${activeTab === "deploy-guide" ? "active" : ""}`}
        >
          🚀 Vercel Free Deploy Guide
        </button>
      </div>

      {feedbackMsg && (
        <div style={{ padding: "12px 18px", borderRadius: "var(--radius-sm)", background: feedbackMsg.startsWith("✓") ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)", border: feedbackMsg.startsWith("✓") ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)", color: feedbackMsg.startsWith("✓") ? "#34d399" : "#f87171", fontSize: "0.9rem", marginBottom: "24px" }}>
          {feedbackMsg}
        </div>
      )}

      {/* TAB 1: ADD PROJECT */}
      {activeTab === "add-project" && (
        <div className="resume-paper-sheet" style={{ padding: "32px" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "20px" }}>
            Publish New Project / 3D Asset
          </h2>

          <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk Drone Model"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Category *</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setCategoryLabel(
                      e.target.value === "3d-cgi" ? "3D & CGI Art" : e.target.value === "graphic-motion" ? "Graphic & Motion" : "Game UI / UX"
                    );
                  }}
                  className="admin-input"
                  style={{ background: "#0c0f17" }}
                >
                  <option value="3d-cgi">3D & CGI (Archviz / Hard-Surface / Environment)</option>
                  <option value="graphic-motion">Graphic & Motion (Reels / Social Campaigns)</option>
                  <option value="ui-ux">UI / UX & Interactive (Game UI / SaaS / Web)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>Category Display Label</label>
                <input
                  type="text"
                  placeholder="e.g. Hard-Surface 3D"
                  value={categoryLabel}
                  onChange={(e) => setCategoryLabel(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Year</label>
                <input
                  type="text"
                  placeholder="2026"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Short Summary (Shown on feed card) *</label>
              <textarea
                required
                rows={2}
                placeholder="Brief high-impact hook describing the project..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="admin-input"
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="admin-form-group">
              <label>Extended Description (Shown in modal)</label>
              <textarea
                rows={4}
                placeholder="Detailed breakdown of workflow, shaders, client brief, or technical challenges..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="admin-input"
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>Tools Used (comma separated)</label>
                <input
                  type="text"
                  placeholder="Blender, Substance Painter, Cycles, Photoshop"
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Key Stat / Highlight</label>
                <input
                  type="text"
                  placeholder="e.g. 4K Photoreal Render · PBR Workflow"
                  value={stats}
                  onChange={(e) => setStats(e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>External Link (ArtStation, Behance, GitHub, Instagram)</label>
              <input
                type="url"
                placeholder="https://artstation.com/..."
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="admin-input"
              />
            </div>

            {/* Image Upload Block */}
            <div className="admin-form-group">
              <label>Project Hero Image</label>
              <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="admin-input"
                  style={{ maxWidth: "320px" }}
                />
                {uploading && <span style={{ color: "var(--accent-cyan)", fontSize: "0.85rem" }}>Uploading file...</span>}
              </div>

              {imageUrl && (
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "120px", height: "68px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-medium)" }}>
                    <Image src={imageUrl} alt="Preview" width={120} height={68} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontFamily: "var(--font-code)" }}>{imageUrl}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn-admin-submit"
              style={{ marginTop: "16px" }}
            >
              {submitting ? "Publishing Project..." : "Publish to Live Portfolio 🚀"}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: MANAGE PROJECTS */}
      {activeTab === "manage-projects" && (
        <div className="resume-paper-sheet" style={{ padding: "32px" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 700, color: "#ffffff", marginBottom: "20px" }}>
            Active Portfolio Projects ({projects.length})
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {projects.map((p) => (
              <div key={p.id} className="experience-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "80px", height: "45px", borderRadius: "6px", overflow: "hidden", background: "#0a0c14", flexShrink: 0 }}>
                    <Image src={p.image} alt={p.title} width={80} height={45} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1rem", color: "#ffffff", fontWeight: 700 }}>{p.title}</h3>
                    <div style={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontFamily: "var(--font-code)" }}>
                      {p.categoryLabel} · {p.year}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-secondary-action" style={{ padding: "6px 12px", fontSize: "0.78rem" }}>
                    View Link ↗
                  </a>
                  <button
                    onClick={() => handleDeleteProject(p.id)}
                    type="button"
                    style={{ padding: "6px 12px", borderRadius: "var(--radius-pill)", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#f87171", fontSize: "0.78rem", fontWeight: 600 }}
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VERCEL FREE DEPLOY GUIDE */}
      {activeTab === "deploy-guide" && (
        <div className="resume-paper-sheet" style={{ padding: "32px", lineHeight: 1.7 }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, color: "#ffffff", marginBottom: "16px" }}>
            1-Click Free Hosting on Vercel
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
            This website is built with native Next.js App Router, configured to deploy effortlessly on Vercel&apos;s generous free tier with zero server costs:
          </p>

          <ol style={{ paddingLeft: "24px", color: "var(--text-secondary)", display: "flex", flexDirection: "column", gap: "14px" }}>
            <li>
              <strong>Push your code to GitHub:</strong>
              <div style={{ background: "rgba(0,0,0,0.4)", padding: "10px 14px", borderRadius: "6px", fontFamily: "var(--font-code)", fontSize: "0.82rem", color: "#38bdf8", marginTop: "4px" }}>
                git init &amp;&amp; git add . &amp;&amp; git commit -m &quot;Initial Kinata Portfolio&quot; &amp;&amp; git push
              </div>
            </li>
            <li>
              <strong>Connect to Vercel:</strong> Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-cyan)", textDecoration: "underline" }}>vercel.com</a>, click <em>&quot;Add New Project&quot;</em>, and select your GitHub repository.
            </li>
            <li>
              <strong>Environment Variables (Optional):</strong> Set <code>ADMIN_PASSWORD</code> to your secret password in the Vercel Project Settings if you want to change the default passcode.
            </li>
            <li>
              <strong>Deploy:</strong> Click Deploy! You will get an instant live URL like <code>kinata.vercel.app</code> with automatic global SSL, sub-second edge speeds, and zero maintenance.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
