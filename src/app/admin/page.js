"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";

/* Clean vector icons for professional, anti-slop tactical UI */
const Icons = {
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  External: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Upload: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Close: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Lock: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  FileText: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Download: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("assets");
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  // Core Data
  const [projects, setProjects] = useState([]);
  const [portfolio, setPortfolio] = useState(null);

  // Search & Filter in Asset Registry
  const [searchQuery, setSearchQuery] = useState("");
  const [assetCategoryFilter, setAssetCategoryFilter] = useState("all");

  // In-Place Project Editing Drawer State
  const [editingProject, setEditingProject] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editUploading, setEditUploading] = useState(false);
  const [editImageUrlInput, setEditImageUrlInput] = useState("");

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: "",
    category: "commercial-video",
    categoryLabel: "Commercial & Video",
    role: "",
    year: "2026",
    summary: "",
    description: "",
    tools: "",
    link: "",
    stats: "",
    image: "/images/projects/marketing_reels.jpg",
    images: ["/images/projects/marketing_reels.jpg"],
    carousel: true,
  });
  const [newImageUrlInput, setNewImageUrlInput] = useState("");
  const [submittingNew, setSubmittingNew] = useState(false);
  const [newUploading, setNewUploading] = useState(false);

  // Hero Showcase State
  const [heroSettings, setHeroSettings] = useState({
    videoSrc: "/videos/showreel.mp4",
    poster: "/images/projects/archviz_interior.jpg",
    callsign: "Surabaya, ID — 3D Animation & CGI",
    tagline: "",
    tickerText: "",
  });
  const [savingHero, setSavingHero] = useState(false);
  const [uploadingHeroVideo, setUploadingHeroVideo] = useState(false);
  const [uploadingHeroPoster, setUploadingHeroPoster] = useState(false);

  // Specialized Résumé Tracks Customization State
  const [resumeTracks, setResumeTracks] = useState([]);
  const [savingResumeTracks, setSavingResumeTracks] = useState(false);
  const [uploadingPdfIndex, setUploadingPdfIndex] = useState(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    handle: "Kinata",
    fullName: "Kendhi Kinata",
    avatar: "/images/avatar_kinata.jpg",
    role: "3D ANIMATION & CGI GENERALIST · MULTIMEDIA DESIGNER",
    location: "Surabaya, Indonesia",
    tagline: "",
    status: "Available for Commissions",
    whatsappUrl: "https://wa.me/6285857511756",
    email: "kendhikinata24@gmail.com",
    phone: "+62 858-5751-1756",
  });
  const [aboutParagraphs, setAboutParagraphs] = useState(["", "", ""]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Experience State
  const [experiences, setExperiences] = useState([]);
  const [awards, setAwards] = useState([]);
  const [savingExperience, setSavingExperience] = useState(false);

  const showFeedback = (text, type = "success") => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: "", type: "" }), 6000);
  };

  const fetchInitialData = async () => {
    try {
      // 1. Fetch Projects
      const projRes = await fetch("/api/projects");
      const projData = await projRes.json();
      if (projData.success) {
        setProjects(projData.projects || []);
      }

      // 2. Fetch Full Portfolio
      const portRes = await fetch("/api/portfolio");
      const portData = await portRes.json();
      if (portData.success && portData.portfolio) {
        const p = portData.portfolio;
        setPortfolio(p);

        if (p.profile) setProfileData(p.profile);
        if (p.about) setAboutParagraphs(p.about);
        if (p.experience) setExperiences(p.experience);
        if (p.awards) setAwards(p.awards);
        if (p.hero) setHeroSettings(p.hero);
        if (p.resumeTracks) setResumeTracks(p.resumeTracks);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
      showFeedback("Failed to synchronize portfolio database", "error");
    }
  };

  // Authentication check
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("kinata_admin_token") : null;
    if (!token) {
      router.push("/admin/login");
    } else {
      const timer = setTimeout(() => {
        setAuthenticated(true);
        fetchInitialData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [router]);

  // ===================== PROJECT EDITING HANDLERS =====================
  const openEditModal = (project) => {
    const projImages = Array.isArray(project.images) && project.images.length > 0
      ? [...project.images]
      : (project.image ? [project.image] : []);
    setEditingProject({
      ...project,
      tools: Array.isArray(project.tools) ? project.tools.join(", ") : (project.tools || ""),
      images: projImages,
      image: projImages[0] || project.image || "",
      carousel: project.carousel !== undefined ? Boolean(project.carousel) : projImages.length > 1,
    });
    setEditImageUrlInput("");
  };

  const closeEditModal = () => {
    setEditingProject(null);
    setEditImageUrlInput("");
  };

  const handleEditFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0 || !editingProject) return;

    setEditUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "projects");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        return await res.json();
      });
      const results = await Promise.all(uploadPromises);
      const successfulUrls = results.filter((r) => r.success && r.url).map((r) => r.url);

      if (successfulUrls.length > 0) {
        setEditingProject((prev) => {
          const existing = Array.isArray(prev.images) && prev.images.length > 0
            ? [...prev.images]
            : (prev.image ? [prev.image] : []);
          const updated = [...existing, ...successfulUrls];
          return {
            ...prev,
            images: updated,
            image: updated[0] || prev.image,
            carousel: prev.carousel !== undefined ? prev.carousel : updated.length > 1,
          };
        });
        showFeedback(`Uploaded ${successfulUrls.length} image(s). Click 'SAVE PROJECT CHANGES' to persist.`, "success");
      } else {
        showFeedback("Failed to upload selected file(s)", "error");
      }
    } catch {
      showFeedback("Failed to upload image file(s)", "error");
    } finally {
      setEditUploading(false);
    }
  };

  const handleAddEditImageUrl = (e) => {
    if (e) e.preventDefault();
    const trimmed = editImageUrlInput.trim();
    if (!trimmed || !editingProject) return;
    setEditingProject((prev) => {
      const existing = Array.isArray(prev.images) && prev.images.length > 0
        ? [...prev.images]
        : (prev.image ? [prev.image] : []);
      const updated = [...existing, trimmed];
      return {
        ...prev,
        images: updated,
        image: updated[0] || prev.image,
        carousel: prev.carousel !== undefined ? prev.carousel : updated.length > 1,
      };
    });
    setEditImageUrlInput("");
  };

  const handleRemoveEditImage = (index) => {
    setEditingProject((prev) => {
      const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      const updated = existing.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        image: updated[0] || "",
      };
    });
  };

  const handleMoveEditImage = (index, direction) => {
    setEditingProject((prev) => {
      const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      const targetIdx = index + direction;
      if (targetIdx < 0 || targetIdx >= existing.length) return prev;
      const updated = [...existing];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return {
        ...prev,
        images: updated,
        image: updated[0] || prev.image,
      };
    });
  };

  const handleSaveEditedProject = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    setSavingEdit(true);
    try {
      const res = await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === data.project.id ? data.project : p))
        );
        showFeedback(`Asset "${data.project.title}" saved successfully!`, "success");
        closeEditModal();
      } else {
        showFeedback(`Save failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Error saving project changes", "error");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (!confirm(`Confirm permanent removal of asset:\n"${title}"?`)) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showFeedback(`Asset "${title}" deleted from portfolio`, "success");
      } else {
        showFeedback(`Delete failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Failed to delete asset", "error");
    }
  };

  // ===================== NEW PROJECT PUBLISHING =====================
  const handleNewFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    setNewUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "projects");
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        return await res.json();
      });
      const results = await Promise.all(uploadPromises);
      const successfulUrls = results.filter((r) => r.success && r.url).map((r) => r.url);

      if (successfulUrls.length > 0) {
        setNewProject((prev) => {
          const existing = Array.isArray(prev.images) && prev.images.length > 0
            ? [...prev.images]
            : (prev.image ? [prev.image] : []);
          const updated = [...existing, ...successfulUrls];
          return {
            ...prev,
            images: updated,
            image: updated[0] || prev.image,
            carousel: prev.carousel !== undefined ? prev.carousel : updated.length > 1,
          };
        });
        showFeedback(`Uploaded ${successfulUrls.length} image(s). Click 'PUBLISH PROJECT' to save.`, "success");
      } else {
        showFeedback("Upload failed for selected image(s)", "error");
      }
    } catch {
      showFeedback("Connection error during upload", "error");
    } finally {
      setNewUploading(false);
    }
  };

  const handleAddNewImageUrl = (e) => {
    if (e) e.preventDefault();
    const trimmed = newImageUrlInput.trim();
    if (!trimmed) return;
    setNewProject((prev) => {
      const existing = Array.isArray(prev.images) && prev.images.length > 0
        ? [...prev.images]
        : (prev.image ? [prev.image] : []);
      const updated = [...existing, trimmed];
      return {
        ...prev,
        images: updated,
        image: updated[0] || prev.image,
        carousel: prev.carousel !== undefined ? prev.carousel : updated.length > 1,
      };
    });
    setNewImageUrlInput("");
  };

  const handleRemoveNewImage = (index) => {
    setNewProject((prev) => {
      const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      const updated = existing.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated,
        image: updated[0] || "",
      };
    });
  };

  const handleMoveNewImage = (index, direction) => {
    setNewProject((prev) => {
      const existing = Array.isArray(prev.images) ? [...prev.images] : (prev.image ? [prev.image] : []);
      const targetIdx = index + direction;
      if (targetIdx < 0 || targetIdx >= existing.length) return prev;
      const updated = [...existing];
      const temp = updated[index];
      updated[index] = updated[targetIdx];
      updated[targetIdx] = temp;
      return {
        ...prev,
        images: updated,
        image: updated[0] || prev.image,
      };
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setSubmittingNew(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => [data.project, ...prev]);
        showFeedback(`Asset "${data.project.title}" published live!`, "success");
        setNewProject({
          title: "",
          category: "commercial-video",
          categoryLabel: "Commercial & Video",
          role: "",
          year: "2026",
          summary: "",
          description: "",
          tools: "",
          link: "",
          stats: "",
          image: "/images/projects/marketing_reels.jpg",
          images: ["/images/projects/marketing_reels.jpg"],
          carousel: true,
        });
        setNewImageUrlInput("");
        setActiveTab("assets");
      } else {
        showFeedback(`Publish failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Server error publishing project", "error");
    } finally {
      setSubmittingNew(false);
    }
  };

  // ===================== HERO SHOWCASE HANDLERS =====================
  const handleHeroVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingHeroVideo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "videos");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setHeroSettings((prev) => ({ ...prev, videoSrc: data.url }));
        showFeedback(`Showreel video uploaded: ${data.fileName}. Click 'SAVE HERO SHOWCASE' to persist.`, "success");
      } else {
        showFeedback(`Video upload failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Error uploading video file", "error");
    } finally {
      setUploadingHeroVideo(false);
    }
  };

  const handleHeroPosterUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingHeroPoster(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "hero");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setHeroSettings((prev) => ({ ...prev, poster: data.url }));
        showFeedback(`Poster image uploaded: ${data.fileName}. Click 'SAVE HERO SHOWCASE' to persist.`, "success");
      } else {
        showFeedback(`Poster upload failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Error uploading poster image", "error");
    } finally {
      setUploadingHeroPoster(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "profile");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setProfileData((prev) => ({ ...prev, avatar: data.url }));
        showFeedback(`Avatar uploaded: ${data.fileName}. Click 'SAVE OPERATOR PROFILE' to persist.`, "success");
      } else {
        showFeedback(`Avatar upload failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Error uploading avatar image", "error");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSavingHero(true);

    try {
      const res = await fetch("/api/hero-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroSettings),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("Hero showcase settings updated live on homepage!", "success");
      } else {
        showFeedback(`Save failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Failed to save hero settings", "error");
    } finally {
      setSavingHero(false);
    }
  };

  // ===================== PROFILE & BIO HANDLERS =====================
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profileData,
          about: aboutParagraphs,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("Operator profile and bio saved to live portfolio!", "success");
      } else {
        showFeedback(`Profile update failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Server error updating profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  // ===================== RÉSUMÉS & CV TRACKS HANDLERS =====================
  const handleSaveResumeTracks = async (e) => {
    if (e) e.preventDefault();
    setSavingResumeTracks(true);

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeTracks }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("Résumé tracks & CV document paths saved successfully!", "success");
      } else {
        showFeedback(`Résumé save failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Server error updating résumé tracks", "error");
    } finally {
      setSavingResumeTracks(false);
    }
  };

  const handlePdfUpload = async (index, file) => {
    if (!file) return;
    setUploadingPdfIndex(index);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "cv");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        const copy = [...resumeTracks];
        copy[index].pdfUrl = data.url;
        setResumeTracks(copy);
        showFeedback(`CV Document uploaded: ${data.fileName}`, "success");
      } else {
        showFeedback(`Upload failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Connection error during PDF upload", "error");
    } finally {
      setUploadingPdfIndex(null);
    }
  };

  const handleAddResumeTrack = () => {
    const newTrack = {
      id: `track-${Date.now().toString(36)}`,
      name: "New Career Focus",
      tagline: "Specialized Track Subtitle",
      pdfUrl: "/cv/Kendhikinata_CV_Generalist.pdf",
      summary: "Executive summary for this discipline...",
    };
    setResumeTracks([...resumeTracks, newTrack]);
  };

  const handleRemoveResumeTrack = (index) => {
    if (resumeTracks.length <= 1) {
      showFeedback("At least one résumé track must remain active.", "error");
      return;
    }
    const copy = [...resumeTracks];
    copy.splice(index, 1);
    setResumeTracks(copy);
  };

  // ===================== EXPERIENCE & HONORS HANDLERS =====================
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    setSavingExperience(true);

    try {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experience: experiences,
          awards: awards,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showFeedback("Experience and academic honors saved successfully!", "success");
      } else {
        showFeedback(`Experience save failed: ${data.message}`, "error");
      }
    } catch {
      showFeedback("Server error updating experience", "error");
    } finally {
      setSavingExperience(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kinata_admin_token");
    localStorage.removeItem("kinata_admin_email");
    router.push("/");
  };

  if (!authenticated) return null;

  // Filter projects by search and category
  const filteredProjects = projects.filter((p) => {
    const matchesCat = assetCategoryFilter === "all" || p.category === assetCategoryFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(query) ||
      (p.role && p.role.toLowerCase().includes(query)) ||
      (p.summary && p.summary.toLowerCase().includes(query)) ||
      (Array.isArray(p.tools) ? p.tools.some((t) => t.toLowerCase().includes(query)) : false);
    return matchesCat && matchesSearch;
  });

  const categoryOptions = [
    { value: "commercial-video", label: "Commercial & Video", desc: "Commercial Design, Video & Product Animation" },
    { value: "3d-film-environment", label: "3D Film & Environment", desc: "3D Short Film & Environment Art" },
    { value: "game-assets-animation", label: "Game Assets & Animation", desc: "3D Game Assets & Stylized Animation" },
    { value: "web-creative-tech", label: "Web & Creative Tech", desc: "Web Design & Creative Technology" },
  ];

  return (
    <div className="admin-shell">
      {/* ================= STUDIO ADMIN HEADER BAR ================= */}
      <header className="admin-header-bar">
        <div className="admin-header-left">
          <div className="admin-title-row">
            <div className="admin-login-emblem-box" style={{ width: "36px", height: "36px" }}>
              <Image
                src="/favicon.png"
                alt="Kinata Studio"
                width={26}
                height={26}
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <h1 className="admin-console-heading">KINATA PORTFOLIO ADMIN</h1>
          </div>

          <div className="admin-status-strip">
            <span className="admin-status-indicator">
              <span className="admin-status-dot" />
              DATABASE LIVE
            </span>
            <span>·</span>
            <span>OWNER: <strong style={{ color: "var(--val-white)" }}>KINATA</strong></span>
            <span>·</span>
            <span>SURABAYA, ID</span>
          </div>
        </div>

        <div className="admin-header-actions">
          <Link href="/" className="admin-btn-action admin-btn-return" id="btn-return-site">
            <Icons.External />
            <span>VIEW SITE ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            className="admin-btn-action admin-btn-delete"
            title="Log out of admin session"
          >
            <Icons.Lock />
            <span>LOG OUT</span>
          </button>
        </div>
      </header>

      {/* ================= STUDIO NAVIGATION TABS ================= */}
      <nav className="admin-nav-tabs-bar" aria-label="Studio Sections">
        {[
          { id: "assets", label: "PROJECT REGISTRY", count: projects.length },
          { id: "publish", label: "NEW PROJECT", count: "+" },
          { id: "showcase", label: "HERO STAGE", count: null },
          { id: "resumes", label: "RÉSUMÉS & CV", count: resumeTracks.length },
          { id: "profile", label: "PROFILE & BIO", count: null },
          { id: "experience", label: "CAREER & HONORS", count: experiences.length + awards.length },
          { id: "deploy", label: "DEPLOYMENT", count: null },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`admin-tab-btn ${activeTab === tab.id ? "active" : ""}`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && <span className="admin-tab-badge">{tab.count}</span>}
          </button>
        ))}
      </nav>

      {/* ================= LIVE FEEDBACK TOAST ================= */}
      {feedback.text && (
        <div className={`admin-feedback-toast ${feedback.type === "error" ? "admin-feedback-error" : "admin-feedback-success"}`} role="status">
          {feedback.type === "error" ? <Icons.Close /> : <Icons.Check />}
          <span style={{ flex: 1 }}>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback({ text: "", type: "" })}
            style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center" }}
            aria-label="Dismiss message"
          >
            <Icons.Close />
          </button>
        </div>
      )}

      {/* =========================================================
          TAB 1: ASSET REGISTRY
          ========================================================= */}
      {activeTab === "assets" && (
        <section className="admin-workbench" aria-label="Project Registry">
          <div className="admin-section-header">
            <div className="admin-section-title-row">
              <span className="admin-section-red-bar" aria-hidden="true" />
              <h2 className="admin-section-title">PORTFOLIO PROJECT REGISTRY</h2>
            </div>
            <p className="admin-section-desc">
              Manage media, external links, role credentials, and descriptions across all {projects.length} live portfolio projects.
            </p>
          </div>

          {/* Quick Search & Category Filter */}
          <div className="admin-search-strip">
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { id: "all", label: "ALL" },
                { id: "commercial-video", label: "COMMERCIAL & VIDEO" },
                { id: "3d-film-environment", label: "3D FILM & ENVIRONMENT" },
                { id: "game-assets-animation", label: "GAME ASSETS & ANIMATION" },
                { id: "web-creative-tech", label: "WEB & CREATIVE TECH" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setAssetCategoryFilter(c.id)}
                  className={`filter-btn ${assetCategoryFilter === c.id ? "active" : ""}`}
                  style={{ padding: "6px 12px", fontSize: "0.68rem" }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div style={{ minWidth: "260px", flex: 1, maxWidth: "340px" }}>
              <input
                type="text"
                placeholder="Search assets by title, tool, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-input"
                style={{ padding: "8px 12px", fontSize: "0.82rem" }}
              />
            </div>
          </div>

          {/* Asset Rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {filteredProjects.length === 0 ? (
              <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontFamily: "var(--font-code)", fontSize: "0.88rem" }}>
                NO ASSETS FOUND MATCHING SEARCH CRITERIA
              </div>
            ) : (
              filteredProjects.map((p) => (
                <article key={p.id} className="admin-asset-card">
                  <div className="admin-asset-info">
                    <div className="admin-asset-thumb">
                      <SafeImage
                        src={p.image}
                        alt={p.title || "Project thumbnail"}
                        fill
                        sizes="96px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <div className="admin-asset-meta">
                      <h3 className="admin-asset-title">{p.title}</h3>
                      {p.role && <div className="project-role-tag">{p.role}</div>}
                      <div className="admin-asset-subline">
                        <span style={{ color: "var(--accent-riot)", fontWeight: 700 }}>
                          {p.categoryLabel}
                        </span>
                        <span style={{ color: "var(--text-muted)" }}>·</span>
                        <span style={{ color: "var(--text-secondary)" }}>{p.year}</span>
                        {p.stats && (
                          <>
                            <span style={{ color: "var(--text-muted)" }}>·</span>
                            <span style={{ color: "var(--accent-gold)" }}>{p.stats}</span>
                          </>
                        )}
                        {Array.isArray(p.images) && p.images.length > 1 && (
                          <>
                            <span style={{ color: "var(--text-muted)" }}>·</span>
                            <span className="admin-badge-carousel">
                              {p.carousel !== false ? `CAROUSEL (${p.images.length})` : `MULTI-IMAGE (${p.images.length})`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="admin-asset-actions">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="admin-btn-action admin-btn-edit"
                      title="Edit project details and swap media"
                    >
                      <Icons.Edit />
                      <span>EDIT</span>
                    </button>

                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-btn-action admin-btn-edit"
                        title="Test live external showcase link"
                      >
                        <Icons.External />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteProject(p.id, p.title)}
                      className="admin-btn-action admin-btn-delete"
                      title="Delete asset from portfolio"
                    >
                      <Icons.Trash />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {/* =========================================================
          TAB 2: PUBLISH NEW ASSET
          ========================================================= */}
      {activeTab === "publish" && (
        <section className="admin-workbench" aria-label="Publish Project">
          <div className="admin-section-header">
            <div className="admin-section-title-row">
              <span className="admin-section-red-bar" aria-hidden="true" />
              <h2 className="admin-section-title">PUBLISH NEW PROJECT</h2>
            </div>
            <p className="admin-section-desc">
              Add a new 3D modeling project, archviz render, commercial campaign, or interactive web project directly to the live portfolio database.
            </p>
          </div>

          <form onSubmit={handleCreateProject} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk Drone Model"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Category *</label>
                <select
                  value={newProject.category}
                  onChange={(e) => {
                    const opt = categoryOptions.find((c) => c.value === e.target.value);
                    setNewProject({
                      ...newProject,
                      category: e.target.value,
                      categoryLabel: opt ? opt.label : "Project",
                    });
                  }}
                  className="admin-input"
                  style={{ background: "#0c0f17" }}
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>Your Role</label>
                <input
                  type="text"
                  placeholder="e.g. 3D Animator & Modeler"
                  value={newProject.role}
                  onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Category Display Label</label>
                <input
                  type="text"
                  placeholder="e.g. 3D Product Animation"
                  value={newProject.categoryLabel}
                  onChange={(e) => setNewProject({ ...newProject, categoryLabel: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Year</label>
                <input
                  type="text"
                  placeholder="2025"
                  value={newProject.year}
                  onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Short Summary (Shown on feed card) *</label>
              <textarea
                required
                rows={2}
                placeholder="High-impact 2-line summary explaining technical achievements..."
                value={newProject.summary}
                onChange={(e) => setNewProject({ ...newProject, summary: e.target.value })}
                className="admin-input"
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="admin-form-group">
              <label>Extended Description (Shown in modal showcase)</label>
              <textarea
                rows={4}
                placeholder="Detailed breakdown of pipeline, shaders, client brief, or technical challenges..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="admin-input"
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>Tools & Software (comma-separated)</label>
                <input
                  type="text"
                  placeholder="Blender, Substance Painter, Premiere Pro"
                  value={newProject.tools}
                  onChange={(e) => setNewProject({ ...newProject, tools: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Key Metric / Highlight Tag</label>
                <input
                  type="text"
                  placeholder="e.g. 30+ Videos · +45% Engagement"
                  value={newProject.stats}
                  onChange={(e) => setNewProject({ ...newProject, stats: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>External Link (ArtStation / YouTube / Instagram / GitHub)</label>
              <input
                type="url"
                placeholder="https://artstation.com/..."
                value={newProject.link}
                onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                className="admin-input"
              />
            </div>

            {/* Multi-Image Gallery & Carousel Controls */}
            <div className="admin-form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                <label>
                  PROJECT SHOWCASE GALLERY ({Array.isArray(newProject.images) ? newProject.images.length : (newProject.image ? 1 : 0)} IMAGES)
                </label>
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
                  First image is cover · Reorder with ‹ and ›
                </span>
              </div>

              {/* Carousel Toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(255, 70, 85, 0.05)", border: "1px solid rgba(255, 70, 85, 0.2)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={Boolean(newProject.carousel)}
                    onChange={(e) => setNewProject({ ...newProject, carousel: e.target.checked })}
                    style={{ width: "16px", height: "16px", accentColor: "var(--accent-riot)", cursor: "pointer" }}
                  />
                  <span style={{ fontSize: "0.82rem", color: "#ffffff", fontFamily: "var(--font-code)", fontWeight: 700 }}>
                    ENABLE CARD CAROUSEL ON HOMEPAGE
                  </span>
                </label>
                <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                  (If enabled &amp; 2+ images, card cycles images on hover with arrows &amp; indicators)
                </span>
              </div>

              {/* Upload & URL Controls */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                <label
                  className="admin-btn-action admin-btn-edit"
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 16px" }}
                >
                  <Icons.Upload />
                  <span>UPLOAD IMAGES (MULTI)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleNewFileUpload}
                    style={{ display: "none" }}
                  />
                </label>

                <div style={{ display: "flex", gap: "8px", flex: 1, minWidth: "260px" }}>
                  <input
                    type="text"
                    placeholder="Or paste image URL (e.g. /images/... or https://...)"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNewImageUrl();
                      }
                    }}
                    className="admin-input"
                  />
                  <button
                    type="button"
                    onClick={handleAddNewImageUrl}
                    className="admin-btn-action admin-btn-edit"
                    style={{ padding: "8px 16px" }}
                  >
                    + ADD
                  </button>
                </div>
              </div>

              {newUploading && (
                <div style={{ color: "var(--accent-riot)", fontSize: "0.8rem", fontFamily: "var(--font-code)", marginTop: "6px" }}>
                  Uploading image(s) to server...
                </div>
              )}

              {/* Image Grid */}
              {Array.isArray(newProject.images) && newProject.images.length > 0 && (
                <div className="admin-images-grid">
                  {newProject.images.map((imgSrc, idx) => (
                    <div key={idx} className={`admin-image-item ${idx === 0 ? "is-cover" : ""}`}>
                      <div className="admin-image-thumb">
                        {idx === 0 && <span className="admin-image-badge-cover">COVER</span>}
                        <span className="admin-image-index">#{idx + 1}</span>
                        <SafeImage src={imgSrc} alt={`Image ${idx + 1}`} fill sizes="130px" style={{ objectFit: "cover" }} unoptimized />
                      </div>
                      <div className="admin-image-actions">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveNewImage(idx, -1)}
                          className="admin-img-btn"
                          title="Move earlier (first image is cover)"
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          disabled={idx === newProject.images.length - 1}
                          onClick={() => handleMoveNewImage(idx, 1)}
                          className="admin-img-btn"
                          title="Move later"
                        >
                          ›
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="admin-img-btn admin-img-delete"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submittingNew || newUploading}
              className="admin-riot-submit"
              style={{ alignSelf: "flex-start", marginTop: "10px" }}
            >
              <span>{submittingNew ? "PUBLISHING..." : "PUBLISH PROJECT"}</span>
            </button>
          </form>
        </section>
      )}

      {/* =========================================================
          TAB 3: HERO SHOWCASE STAGE
          ========================================================= */}
      {activeTab === "showcase" && (
        <section className="admin-workbench" aria-label="Hero Showcase">
          <div className="admin-section-header">
            <div className="admin-section-title-row">
              <span className="admin-section-red-bar" aria-hidden="true" />
              <h2 className="admin-section-title">HERO SHOWCASE CONFIGURATION</h2>
            </div>
            <p className="admin-section-desc">
              Control the full-bleed background video, fallback poster, header subtitle, and top announcement ticker.
            </p>
          </div>

          {/* Current Live Preview */}
          <div style={{ marginBottom: "28px", border: "1px solid var(--border-medium)", padding: "16px", background: "#050505" }}>
            <div style={{ fontSize: "0.74rem", color: "var(--accent-riot)", fontFamily: "var(--font-code)", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase" }}>
              ACTIVE HERO VIDEO STREAM:
            </div>
            <div style={{ width: "100%", maxHeight: "340px", background: "#000", overflow: "hidden", display: "flex", justifyContent: "center" }}>
              <video
                key={heroSettings.videoSrc}
                src={heroSettings.videoSrc}
                poster={heroSettings.poster}
                autoPlay
                loop
                muted
                playsInline
                controls
                style={{ width: "100%", maxHeight: "340px", objectFit: "cover" }}
              />
            </div>
            <div style={{ marginTop: "10px", fontSize: "0.76rem", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
              Active Path: <code style={{ color: "#ffffff" }}>{heroSettings.videoSrc}</code>
            </div>
          </div>

          <form onSubmit={handleSaveHero} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="admin-form-group">
              <label>Direct Upload New Showreel (.mp4, .webm)</label>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleHeroVideoUpload}
                disabled={uploadingHeroVideo}
                className="admin-input"
              />
              {uploadingHeroVideo && (
                <div style={{ fontSize: "0.82rem", color: "var(--accent-riot)", marginTop: "6px", fontFamily: "var(--font-code)" }}>
                  Uploading video to /public/videos/...
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label>Video Stream Path or External HTTPS URL *</label>
              <input
                type="text"
                required
                value={heroSettings.videoSrc}
                onChange={(e) => setHeroSettings({ ...heroSettings, videoSrc: e.target.value })}
                className="admin-input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>Fallback Poster Image</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "center" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroPosterUpload}
                    disabled={uploadingHeroPoster}
                    className="admin-input"
                  />
                  <input
                    type="text"
                    value={heroSettings.poster || ""}
                    onChange={(e) => setHeroSettings({ ...heroSettings, poster: e.target.value })}
                    className="admin-input"
                    style={{ width: "240px" }}
                  />
                </div>
                {uploadingHeroPoster && (
                  <div style={{ fontSize: "0.82rem", color: "var(--accent-riot)", marginTop: "6px", fontFamily: "var(--font-code)" }}>
                    Uploading poster image...
                  </div>
                )}
                {heroSettings.poster ? (
                  <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "120px", height: "68px", border: "1px solid var(--border-medium)", position: "relative", overflow: "hidden" }}>
                      <SafeImage src={heroSettings.poster} alt="Poster Preview" fill sizes="120px" style={{ objectFit: "cover" }} unoptimized />
                    </div>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-code)", wordBreak: "break-all" }}>
                      {heroSettings.poster}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="admin-form-group">
                <label>Header Subtitle & Discipline</label>
                <input
                  type="text"
                  value={heroSettings.callsign}
                  onChange={(e) => setHeroSettings({ ...heroSettings, callsign: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Top Ribbon Announcement Ticker</label>
              <input
                type="text"
                value={heroSettings.tickerText}
                onChange={(e) => setHeroSettings({ ...heroSettings, tickerText: e.target.value })}
                className="admin-input"
              />
            </div>

            <button
              type="submit"
              disabled={savingHero || uploadingHeroVideo}
              className="admin-riot-submit"
              style={{ alignSelf: "flex-start", marginTop: "10px" }}
            >
              <span>{savingHero ? "SAVING..." : "UPDATE HERO STAGE"}</span>
            </button>
          </form>
        </section>
      )}

      {/* =========================================================
          TAB 4: RÉSUMÉS & CV CUSTOMIZATION
          ========================================================= */}
      {activeTab === "resumes" && (
        <section className="admin-workbench" aria-label="Résumés and CV Tracks">
          <div className="admin-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <div className="admin-section-title-row">
                <span className="admin-section-red-bar" aria-hidden="true" />
                <h2 className="admin-section-title">SPECIALIZED RÉSUMÉ TRACKS & CV ASSETS</h2>
              </div>
              <p className="admin-section-desc">
                Configure tailored career pathways (3D &amp; CGI, Multimedia &amp; Marketing, Generalist), upload official PDF attachments, and edit summaries displayed on the interactive CV sheet.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link
                href="/resume"
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn-action admin-btn-outline"
                style={{ padding: "8px 14px", textDecoration: "none" }}
              >
                <Icons.External />
                <span>PREVIEW LIVE CV SHEET</span>
              </Link>
              <button
                type="button"
                onClick={handleAddResumeTrack}
                className="admin-btn-action admin-btn-edit"
                style={{ padding: "8px 14px" }}
              >
                <Icons.Plus />
                <span>ADD TRACK</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveResumeTracks} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {resumeTracks.map((track, idx) => (
                <div key={track.id || idx} className="admin-resume-track-card">
                  <div className="admin-resume-track-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <span className="admin-resume-track-badge">{track.id}</span>
                      <strong style={{ color: "#ffffff", fontSize: "0.92rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                        TRACK 0{idx + 1} — {track.name || "UNTITLED DISCIPLINE"}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveResumeTrack(idx)}
                      className="admin-btn-action admin-btn-delete"
                      title="Remove this CV track"
                      disabled={resumeTracks.length <= 1}
                      style={{ opacity: resumeTracks.length <= 1 ? 0.4 : 1 }}
                    >
                      <Icons.Trash />
                      <span>REMOVE TRACK</span>
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px", marginTop: "16px" }}>
                    <div className="admin-form-group">
                      <label htmlFor={`track-name-${idx}`}>Track Display Name</label>
                      <input
                        id={`track-name-${idx}`}
                        name={`track-name-${idx}`}
                        type="text"
                        value={track.name}
                        onChange={(e) => {
                          const copy = [...resumeTracks];
                          copy[idx].name = e.target.value;
                          setResumeTracks(copy);
                        }}
                        className="admin-input"
                        placeholder="e.g. 3D & CGI Specialist"
                        required
                      />
                    </div>

                    <div className="admin-form-group">
                      <label htmlFor={`track-id-${idx}`}>Identifier Slug (Unique ID)</label>
                      <input
                        id={`track-id-${idx}`}
                        name={`track-id-${idx}`}
                        type="text"
                        value={track.id}
                        onChange={(e) => {
                          const copy = [...resumeTracks];
                          copy[idx].id = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
                          setResumeTracks(copy);
                        }}
                        className="admin-input"
                        style={{ fontFamily: "var(--font-code)", fontSize: "0.85rem" }}
                        placeholder="e.g. track-cgi"
                        required
                      />
                    </div>
                  </div>

                  <div className="admin-form-group" style={{ marginTop: "14px" }}>
                    <label htmlFor={`track-tagline-${idx}`}>Discipline Tagline</label>
                    <input
                      id={`track-tagline-${idx}`}
                      name={`track-tagline-${idx}`}
                      type="text"
                      value={track.tagline || ""}
                      onChange={(e) => {
                        const copy = [...resumeTracks];
                        copy[idx].tagline = e.target.value;
                        setResumeTracks(copy);
                      }}
                      className="admin-input"
                      placeholder="e.g. Specialized focus on 3D Modeling, Hard-Surface, Archviz & Game Assets"
                    />
                  </div>

                  <div className="admin-form-group" style={{ marginTop: "14px" }}>
                    <label htmlFor={`track-summary-${idx}`}>Executive Summary / Cover Synopsis</label>
                    <textarea
                      id={`track-summary-${idx}`}
                      name={`track-summary-${idx}`}
                      rows={3}
                      value={track.summary || ""}
                      onChange={(e) => {
                        const copy = [...resumeTracks];
                        copy[idx].summary = e.target.value;
                        setResumeTracks(copy);
                      }}
                      className="admin-input"
                      style={{ resize: "vertical" }}
                      placeholder="High-impact career summary tailored for recruiter/client evaluation in this discipline..."
                    />
                  </div>

                  {/* Attached Document & Direct File Upload */}
                  <div className="admin-pdf-box" style={{ marginTop: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Icons.FileText />
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", color: "#ffffff", textTransform: "uppercase" }}>
                          ATTACHED PDF CURRICULUM VITAE
                        </span>
                      </div>

                      {track.pdfUrl && (
                        <a
                          href={track.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-btn-action admin-btn-outline"
                          style={{ padding: "4px 10px", fontSize: "0.72rem", textDecoration: "none" }}
                        >
                          <Icons.Download />
                          <span>TEST DOWNLOAD PDF</span>
                        </a>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "12px", alignItems: "center" }}>
                      <input
                        type="text"
                        value={track.pdfUrl || ""}
                        onChange={(e) => {
                          const copy = [...resumeTracks];
                          copy[idx].pdfUrl = e.target.value;
                          setResumeTracks(copy);
                        }}
                        className="admin-input"
                        style={{ fontFamily: "var(--font-code)", fontSize: "0.82rem" }}
                        placeholder="/cv/Kendhikinata_CV_Track.pdf"
                      />

                      <label
                        className="admin-btn-action admin-btn-upload"
                        style={{
                          margin: 0,
                          cursor: uploadingPdfIndex === idx ? "wait" : "pointer",
                          opacity: uploadingPdfIndex === idx ? 0.7 : 1,
                          padding: "10px 16px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px"
                        }}
                      >
                        <Icons.Upload />
                        <span>{uploadingPdfIndex === idx ? "UPLOADING..." : "UPLOAD NEW PDF"}</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              const f = e.target.files[0];
                              e.target.value = "";
                              handlePdfUpload(idx, f);
                            }
                          }}
                          style={{ display: "none" }}
                          disabled={uploadingPdfIndex === idx}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", borderTop: "1px solid var(--border-subtle)", paddingTop: "16px", flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={savingResumeTracks}
                className="admin-riot-submit"
              >
                <span>{savingResumeTracks ? "SAVING RÉSUMÉ..." : "SAVE RÉSUMÉ TRACKS"}</span>
              </button>

              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
                Live updates sync directly to /resume paper sheet.
              </span>
            </div>
          </form>
        </section>
      )}

      {/* =========================================================
          TAB 5: OPERATOR PROFILE & BIO
          ========================================================= */}
      {activeTab === "profile" && (
        <section className="admin-workbench" aria-label="Profile and Bio">
          <div className="admin-section-header">
            <div className="admin-section-title-row">
              <span className="admin-section-red-bar" aria-hidden="true" />
              <h2 className="admin-section-title">PROFILE & EDITORIAL BIOGRAPHY</h2>
            </div>
            <p className="admin-section-desc">
              Update contact channels, availability status pill, and the editorial biography paragraphs.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Operator Avatar Upload */}
            <div className="admin-form-group">
              <label>Operator Avatar / Profile Photo</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center" }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="admin-input"
                />
                <input
                  type="text"
                  value={profileData.avatar || ""}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  className="admin-input"
                  style={{ width: "320px" }}
                />
              </div>
              {uploadingAvatar && (
                <div style={{ color: "var(--accent-riot)", fontSize: "0.8rem", fontFamily: "var(--font-code)", marginTop: "6px" }}>
                  Uploading avatar image...
                </div>
              )}
              {profileData.avatar ? (
                <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", border: "2px solid var(--accent-riot)", position: "relative", overflow: "hidden" }}>
                    <SafeImage src={profileData.avatar} alt="Avatar Preview" fill sizes="64px" style={{ objectFit: "cover" }} unoptimized />
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontFamily: "var(--font-code)", wordBreak: "break-all" }}>{profileData.avatar}</span>
                </div>
              ) : null}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>Display Name / Handle</label>
                <input
                  type="text"
                  value={profileData.handle}
                  onChange={(e) => setProfileData({ ...profileData, handle: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label>Primary Role Title</label>
              <input
                type="text"
                value={profileData.role}
                onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                className="admin-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Availability Status Badge (Floating Corner Widget)</label>
              <input
                type="text"
                value={profileData.status}
                onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                className="admin-input"
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div className="admin-form-group">
                <label>WhatsApp Contact URL</label>
                <input
                  type="url"
                  value={profileData.whatsappUrl}
                  onChange={(e) => setProfileData({ ...profileData, whatsappUrl: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="admin-input"
                />
              </div>

              <div className="admin-form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  className="admin-input"
                />
              </div>
            </div>

            {/* About Prose Paragraphs */}
            <div style={{ marginTop: "16px", borderTop: "1px solid var(--border-subtle)", paddingTop: "20px" }}>
              <h3 style={{ fontSize: "1.1rem", color: "#ffffff", fontWeight: 700, marginBottom: "12px" }}>
                Editorial Biography Paragraphs (ABOUT)
              </h3>

              {aboutParagraphs.map((para, idx) => (
                <div key={idx} className="admin-form-group" style={{ marginBottom: "14px" }}>
                  <label>Paragraph {idx + 1}</label>
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => {
                      const updated = [...aboutParagraphs];
                      updated[idx] = e.target.value;
                      setAboutParagraphs(updated);
                    }}
                    className="admin-input"
                    style={{ resize: "vertical" }}
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="admin-riot-submit"
              style={{ alignSelf: "flex-start", marginTop: "10px" }}
            >
              <span>{savingProfile ? "SAVING..." : "SAVE PROFILE CHANGES"}</span>
            </button>
          </form>
        </section>
      )}

      {/* =========================================================
          TAB 5: CAREER & HONORS (WITH BACKDROP CAROUSELS)
          ========================================================= */}
      {activeTab === "experience" && (
        <section className="admin-workbench" aria-label="Experience & Honors">
          <div className="admin-section-header">
            <div className="admin-section-title-row">
              <span className="admin-section-red-bar" aria-hidden="true" />
              <h2 className="admin-section-title">CAREER EXPERIENCE & COMPETITION HONORS</h2>
            </div>
            <p className="admin-section-desc">
              Manage work experience cards, organizational roles, and the ambient backdrop images that activate when hovering cards on the homepage.
            </p>
          </div>

          <form onSubmit={handleSaveExperience} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <h3 style={{ fontSize: "1.1rem", color: "#ffffff", fontWeight: 700, borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px" }}>
              Work Experience Cards ({experiences.length})
            </h3>

            {experiences.map((exp, idx) => (
              <div key={idx} style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-subtle)", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                  <div className="admin-form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].role = e.target.value;
                        setExperiences(copy);
                      }}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Company / Affiliation</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].company = e.target.value;
                        setExperiences(copy);
                      }}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Period</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => {
                        const copy = [...experiences];
                        copy[idx].period = e.target.value;
                        setExperiences(copy);
                      }}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label>Role Description</label>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const copy = [...experiences];
                      copy[idx].description = e.target.value;
                      setExperiences(copy);
                    }}
                    className="admin-input"
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label>Hover Preview Images (comma-separated paths)</label>
                  <input
                    type="text"
                    value={Array.isArray(exp.previewImages) ? exp.previewImages.join(", ") : ""}
                    onChange={(e) => {
                      const copy = [...experiences];
                      copy[idx].previewImages = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setExperiences(copy);
                    }}
                    className="admin-input"
                  />
                </div>
              </div>
            ))}

            <h3 style={{ fontSize: "1.1rem", color: "#ffffff", fontWeight: 700, borderBottom: "1px solid var(--border-subtle)", paddingBottom: "8px", marginTop: "16px" }}>
              Academic & Competition Honors ({awards.length})
            </h3>

            {awards.map((awd, idx) => (
              <div key={idx} style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border-subtle)", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
                  <div className="admin-form-group">
                    <label htmlFor={`award-title-${idx}`}>Honor / Production Title</label>
                    <input
                      id={`award-title-${idx}`}
                      name={`award-title-${idx}`}
                      type="text"
                      value={awd.title}
                      onChange={(e) => {
                        const copy = [...awards];
                        copy[idx].title = e.target.value;
                        setAwards(copy);
                      }}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor={`award-issuer-${idx}`}>Issuer / Organization</label>
                    <input
                      id={`award-issuer-${idx}`}
                      name={`award-issuer-${idx}`}
                      type="text"
                      value={awd.issuer}
                      onChange={(e) => {
                        const copy = [...awards];
                        copy[idx].issuer = e.target.value;
                        setAwards(copy);
                      }}
                      className="admin-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label htmlFor={`award-year-${idx}`}>Year</label>
                    <input
                      id={`award-year-${idx}`}
                      name={`award-year-${idx}`}
                      type="text"
                      value={awd.year}
                      onChange={(e) => {
                        const copy = [...awards];
                        copy[idx].year = e.target.value;
                        setAwards(copy);
                      }}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label htmlFor={`award-detail-${idx}`}>Detail / Production Synopsis</label>
                  <textarea
                    id={`award-detail-${idx}`}
                    name={`award-detail-${idx}`}
                    rows={2}
                    value={awd.detail}
                    onChange={(e) => {
                      const copy = [...awards];
                      copy[idx].detail = e.target.value;
                      setAwards(copy);
                    }}
                    className="admin-input"
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor={`award-preview-${idx}`}>Hover Backdrop Images (comma-separated paths)</label>
                  <input
                    id={`award-preview-${idx}`}
                    name={`award-preview-${idx}`}
                    type="text"
                    value={Array.isArray(awd.previewImages) ? awd.previewImages.join(", ") : ""}
                    onChange={(e) => {
                      const copy = [...awards];
                      copy[idx].previewImages = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                      setAwards(copy);
                    }}
                    className="admin-input"
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={savingExperience}
              className="admin-riot-submit"
              style={{ alignSelf: "flex-start", marginTop: "10px" }}
            >
              <span>{savingExperience ? "SAVING..." : "SAVE CAREER & HONORS"}</span>
            </button>
          </form>
        </section>
      )}

      {/* =========================================================
          TAB 6: VERCEL DEPLOYMENT GUIDE
          ========================================================= */}
      {activeTab === "deploy" && (
        <section className="admin-workbench" aria-label="Deployment Guide">
          <div className="admin-section-header">
            <div className="admin-section-title-row">
              <span className="admin-section-red-bar" aria-hidden="true" />
              <h2 className="admin-section-title">PRODUCTION DEPLOYMENT (VERCEL)</h2>
            </div>
            <p className="admin-section-desc">
              Deploy your Next.js portfolio globally with zero hosting fees and automatic SSL certificates.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
            <div>
              <strong style={{ color: "#ffffff" }}>Step 1: Commit and push your codebase to GitHub</strong>
              <div style={{ background: "#050505", border: "1px solid var(--border-medium)", padding: "12px 16px", fontFamily: "var(--font-code)", fontSize: "0.82rem", color: "var(--accent-riot)", marginTop: "6px" }}>
                git add . &amp;&amp; git commit -m &quot;Update Kinata portfolio&quot; &amp;&amp; git push
              </div>
            </div>

            <div>
              <strong style={{ color: "#ffffff" }}>Step 2: Connect repository on Vercel</strong>
              <p style={{ marginTop: "4px" }}>
                Log into <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-riot)", textDecoration: "underline" }}>vercel.com</a>, click <em>&quot;Add New Project&quot;</em>, and import your GitHub repository.
              </p>
            </div>

            <div>
              <strong style={{ color: "#ffffff" }}>Step 3: Environment Variables (Security)</strong>
              <p style={{ marginTop: "4px" }}>
                In Project Settings &gt; Environment Variables, set <code style={{ color: "#ffffff", background: "rgba(255,255,255,0.08)", padding: "2px 6px" }}>ADMIN_PASSWORD</code> to your preferred custom secret if you want to override the production passcode.
              </p>
            </div>

            <div>
              <strong style={{ color: "#ffffff" }}>Step 4: Instant Global Edge Deployment</strong>
              <p style={{ marginTop: "4px" }}>
                Click <em>Deploy</em>. You will immediately receive a live URL like <code style={{ color: "#ffffff", background: "rgba(255,255,255,0.08)", padding: "2px 6px" }}>kinata.vercel.app</code> with sub-second page loads.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          IN-PLACE EDIT ASSET MODAL / DRAWER
          ========================================================= */}
      {editingProject && (
        <div className="admin-modal-backdrop" onClick={closeEditModal} role="dialog" aria-modal="true">
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="admin-modal-close-btn"
              onClick={closeEditModal}
              aria-label="Close edit drawer"
            >
              <Icons.Close />
            </button>

            <div style={{ marginBottom: "20px" }}>
              <div className="admin-section-title-row" style={{ marginBottom: "4px" }}>
                <span className="admin-section-red-bar" aria-hidden="true" style={{ height: "22px" }} />
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", letterSpacing: "0.02em", margin: 0 }}>
                  EDIT PROJECT: {editingProject.title}
                </h2>
              </div>
              <div style={{ color: "var(--text-muted)", fontFamily: "var(--font-code)", fontSize: "0.75rem", letterSpacing: "0.06em", marginLeft: "18px" }}>
                PROJECT ID: {editingProject.id}
              </div>
            </div>

            <form onSubmit={handleSaveEditedProject} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                <div className="admin-form-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category *</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => {
                      const opt = categoryOptions.find((c) => c.value === e.target.value);
                      setEditingProject({
                        ...editingProject,
                        category: e.target.value,
                        categoryLabel: opt ? opt.label : editingProject.categoryLabel,
                      });
                    }}
                    className="admin-input"
                    style={{ background: "#0c0f17" }}
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div className="admin-form-group">
                  <label>Your Role</label>
                  <input
                    type="text"
                    placeholder="e.g. 3D Animator & Modeler"
                    value={editingProject.role || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, role: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Category Display Label</label>
                  <input
                    type="text"
                    value={editingProject.categoryLabel}
                    onChange={(e) => setEditingProject({ ...editingProject, categoryLabel: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Year</label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Feed Card Summary *</label>
                <textarea
                  required
                  rows={2}
                  value={editingProject.summary}
                  onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                  className="admin-input"
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="admin-form-group">
                <label>Modal Extended Description</label>
                <textarea
                  rows={4}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="admin-input"
                  style={{ resize: "vertical" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                <div className="admin-form-group">
                  <label>Tools & Software (comma-separated)</label>
                  <input
                    type="text"
                    value={editingProject.tools}
                    onChange={(e) => setEditingProject({ ...editingProject, tools: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label>Key Metric / Highlight Tag</label>
                  <input
                    type="text"
                    value={editingProject.stats || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, stats: e.target.value })}
                    className="admin-input"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>External Link (ArtStation / YouTube / Instagram / GitHub)</label>
                <input
                  type="url"
                  value={editingProject.link || ""}
                  onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                  className="admin-input"
                />
              </div>

              {/* Media Multi-Image Gallery & Carousel Controls */}
              <div className="admin-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                  <label>
                    PROJECT SHOWCASE GALLERY ({Array.isArray(editingProject.images) ? editingProject.images.length : (editingProject.image ? 1 : 0)} IMAGES)
                  </label>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontFamily: "var(--font-code)" }}>
                    First image is cover · Reorder with ‹ and ›
                  </span>
                </div>

                {/* Carousel Toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(255, 70, 85, 0.05)", border: "1px solid rgba(255, 70, 85, 0.2)" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", userSelect: "none" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(editingProject.carousel)}
                      onChange={(e) => setEditingProject({ ...editingProject, carousel: e.target.checked })}
                      style={{ width: "16px", height: "16px", accentColor: "var(--accent-riot)", cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.82rem", color: "#ffffff", fontFamily: "var(--font-code)", fontWeight: 700 }}>
                      ENABLE CARD CAROUSEL ON HOMEPAGE
                    </span>
                  </label>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                    (If enabled &amp; 2+ images, card cycles images on hover with arrows &amp; indicators)
                  </span>
                </div>

                {/* Upload & URL Controls */}
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <label
                    className="admin-btn-action admin-btn-edit"
                    style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", padding: "9px 16px" }}
                  >
                    <Icons.Upload />
                    <span>UPLOAD IMAGES (MULTI)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleEditFileUpload}
                      style={{ display: "none" }}
                    />
                  </label>

                  <div style={{ display: "flex", gap: "8px", flex: 1, minWidth: "260px" }}>
                    <input
                      type="text"
                      placeholder="Or paste image URL (e.g. /images/... or https://...)"
                      value={editImageUrlInput}
                      onChange={(e) => setEditImageUrlInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddEditImageUrl();
                        }
                      }}
                      className="admin-input"
                    />
                    <button
                      type="button"
                      onClick={handleAddEditImageUrl}
                      className="admin-btn-action admin-btn-edit"
                      style={{ padding: "8px 16px" }}
                    >
                      + ADD
                    </button>
                  </div>
                </div>

                {editUploading && (
                  <div style={{ color: "var(--accent-riot)", fontSize: "0.8rem", fontFamily: "var(--font-code)", marginTop: "6px" }}>
                    Uploading image(s) to server...
                  </div>
                )}

                {/* Image Grid */}
                {Array.isArray(editingProject.images) && editingProject.images.length > 0 && (
                  <div className="admin-images-grid">
                    {editingProject.images.map((imgSrc, idx) => (
                      <div key={idx} className={`admin-image-item ${idx === 0 ? "is-cover" : ""}`}>
                        <div className="admin-image-thumb">
                          {idx === 0 && <span className="admin-image-badge-cover">COVER</span>}
                          <span className="admin-image-index">#{idx + 1}</span>
                          <SafeImage src={imgSrc} alt={`Image ${idx + 1}`} fill sizes="130px" style={{ objectFit: "cover" }} unoptimized />
                        </div>
                        <div className="admin-image-actions">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveEditImage(idx, -1)}
                            className="admin-img-btn"
                            title="Move earlier (first image is cover)"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            disabled={idx === editingProject.images.length - 1}
                            onClick={() => handleMoveEditImage(idx, 1)}
                            className="admin-img-btn"
                            title="Move later"
                          >
                            ›
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveEditImage(idx)}
                            className="admin-img-btn admin-img-delete"
                            title="Remove image"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="admin-btn-action admin-btn-edit"
                  style={{ padding: "10px 20px" }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={savingEdit || editUploading}
                  className="admin-riot-submit"
                  style={{ padding: "10px 24px" }}
                >
                  <span>{savingEdit ? "SAVING..." : "SAVE PROJECT CHANGES"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
