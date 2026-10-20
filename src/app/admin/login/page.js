"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("kinata_admin_token", data.token);
        localStorage.setItem("kinata_admin_email", username);
        router.push("/admin");
      } else {
        setErrorMsg(data.message || "Invalid username or password");
      }
    } catch {
      setErrorMsg("Failed to connect to authentication server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-module">
        {/* Header Bar */}
        <div className="admin-login-topbar">
          <div className="admin-login-brand">
            <div className="admin-login-emblem-box">
              <Image src="/favicon.png" alt="Kinata" width={26} height={26} priority />
            </div>
            <div>
              <div className="admin-login-system-name">KINATA</div>
              <div className="admin-login-system-sub">STUDIO ADMIN</div>
            </div>
          </div>

          <Link href="/" className="admin-login-return-link">
            <span>&larr;</span>
            <span>BACK TO SITE</span>
          </Link>
        </div>

        {/* Title */}
        <div className="admin-login-title-box">
          <div className="admin-login-heading-row">
            <span className="admin-login-red-tick" aria-hidden="true" />
            <h1 className="admin-login-heading">SIGN IN</h1>
          </div>
          <p className="admin-login-desc">
            Manage portfolio projects, hero showcase, and CV tracks.
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="admin-login-error" role="alert">
            {errorMsg}
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="admin-form-group">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              name="username"
              type="text"
              className="admin-input"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              className="admin-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="admin-riot-submit"
            disabled={loading}
            style={{ width: "100%", marginTop: "8px", padding: "14px" }}
          >
            <span>{loading ? "SIGNING IN..." : "SIGN IN"}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
