"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar({ activityFeed = [] }) {
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

  return (
    <header className="navbar-wrapper">
      <nav className="floating-navbar" aria-label="Primary navigation">
        <Link href="/" className="profile-identity" aria-label="Kinata Portfolio Home">
          <div className="profile-avatar-wrap">
            <Image
              src="/images/avatar.jpg"
              alt="Kinata Avatar"
              width={30}
              height={30}
              className="profile-avatar-img"
              priority
            />
          </div>
          <span className="profile-handle">kinata</span>
        </Link>

        <div className="navbar-right">
          <Link
            href="/"
            className={`nav-link ${pathname === "/" ? "active" : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>
          <Link
            href="/resume"
            className={`nav-link ${pathname === "/resume" ? "active" : ""}`}
            aria-current={pathname === "/resume" ? "page" : undefined}
          >
            Resume
          </Link>
          <Link
            href="/archive"
            className={`nav-link ${pathname === "/archive" ? "active" : ""}`}
            aria-current={pathname === "/archive" ? "page" : undefined}
          >
            Archive
          </Link>

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
                  <h3>Activity Feed</h3>
                  <span>RECENT LOGS</span>
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
      </nav>
    </header>
  );
}
