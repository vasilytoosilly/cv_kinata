"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar({ activityFeed = [], tickerText = "" }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(activityFeed.length || 3);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) {
      setUnreadCount(0);
    }
  };

  const defaultTicker = "SURABAYA, ID · 3D ANIMATION · HARD-SURFACE CGI · ARCHVIZ · REAL ESTATE REELS · GAME ASSETS · BLENDER & MAYA";
  const activeTicker = tickerText || defaultTicker;

  return (
    <header className="top-ribbon-bar">
      <div className="top-ribbon-inner">
        {/* Left Brand Anchor */}
        <Link href="/" className="ribbon-brand" aria-label="Kinata Portfolio Home">
          <Image
            src="/favicon.png"
            alt="Kinata Logo"
            width={24}
            height={24}
            className="ribbon-brand-logo"
            priority
          />
          <span className="ribbon-handle">Creative Portfolio</span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="ribbon-nav-links" aria-label="Primary navigation">
          <Link href={pathname === "/" ? "#about" : "/#about"} className="ribbon-link">
            ABOUT
          </Link>
          <Link href={pathname === "/" ? "#projects" : "/#projects"} className="ribbon-link">
            PROJECTS
          </Link>
          <Link href={pathname === "/" ? "#experience" : "/#experience"} className="ribbon-link">
            EXPERIENCE
          </Link>
          <Link href={pathname === "/" ? "#skills" : "/#skills"} className="ribbon-link">
            SKILLS
          </Link>
          <Link href="/archive" className={`ribbon-link ${pathname === "/archive" ? "active" : ""}`}>
            ARCHIVE
          </Link>
          <Link href="/resume" className={`ribbon-link ${pathname === "/resume" ? "active" : ""}`}>
            RÉSUMÉ
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="ribbon-actions">
          <a
            href="https://wa.me/6285857511756?text=Hi%20Kinata,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project!"
            target="_blank"
            rel="noopener noreferrer"
            className="ribbon-cta-btn"
          >
            <span>Let&apos;s Talk</span>
            <span className="cta-arrow">→</span>
          </a>

          {/* Activity Updates Bell */}
          <div className="updates-wrapper" ref={dropdownRef}>
            <button
              type="button"
              className={`updates-button ${dropdownOpen ? "open" : ""}`}
              onClick={handleToggleDropdown}
              aria-label="Activity Feed Notifications"
              aria-expanded={dropdownOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {unreadCount > 0 && <span className="bell-badge" />}
            </button>

            {dropdownOpen && (
              <div className="updates-dropdown">
                <div className="dropdown-header">
                  <h3>Updates</h3>
                  <span>Recent</span>
                </div>
                <div className="dropdown-items">
                  {activityFeed.map((item) => (
                    <div key={item.id} className="dropdown-item">
                      <div className="dropdown-item-meta">
                        <span className="dropdown-badge">{item.badge}</span>
                        <span className="dropdown-date">{item.date}</span>
                      </div>
                      <div className="dropdown-item-title">{item.title}</div>
                      <div className="dropdown-item-desc">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scrolling Sub-Ticker Strip */}
      <div className="ribbon-ticker-subbar" aria-hidden="true">
        <div className="ticker-track">
          <span>{activeTicker}</span>
          <span className="ticker-divider">·</span>
          <span>{activeTicker}</span>
          <span className="ticker-divider">·</span>
          <span>{activeTicker}</span>
        </div>
      </div>
    </header>
  );
}
