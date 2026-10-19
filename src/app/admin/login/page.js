"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("kinata_admin_token", data.token);
        localStorage.setItem("kinata_admin_email", email);
        router.push("/admin");
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch {
      setErrorMsg("Failed to connect to authentication service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <Link
          href="/"
          style={{
            fontSize: "0.84rem",
            color: "var(--text-secondary)",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
          }}
        >
          <span>&larr;</span> Back to Portfolio
        </Link>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "16px",
              margin: "0 auto 14px",
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "#ffffff",
              boxShadow: "0 8px 24px rgba(139, 92, 246, 0.4)",
            }}
          >
            K
          </div>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Control Room
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }}>
            Sign in to manage Kinata portfolio assets & updates
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#f87171",
              fontSize: "0.84rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="admin-form-group">
            <label htmlFor="email">Operator Email</label>
            <input
              id="email"
              type="email"
              className="admin-input"
              placeholder="admin@kinata.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Passcode</label>
            <input
              id="password"
              type="password"
              className="admin-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Default: admin@kinata.com / kinata2026
            </span>
          </div>

          <button
            type="submit"
            className="btn-admin-submit"
            disabled={loading}
            style={{ marginTop: "8px" }}
          >
            {loading ? "Authenticating..." : "Enter Control Room →"}
          </button>
        </form>
      </div>
    </div>
  );
}
