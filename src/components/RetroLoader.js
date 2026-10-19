"use client";

import { useEffect, useState } from "react";

export default function RetroLoader() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [hidden, setHidden] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("kinata_loader_seen")) {
      setShouldRender(false);
      return;
    }

    const steps = [
      { pct: 25, text: "Loading assets...", delay: 150 },
      { pct: 55, text: "Preparing workspace...", delay: 400 },
      { pct: 85, text: "Almost there...", delay: 700 },
      { pct: 100, text: "", delay: 1000 },
    ];

    const timers = [];

    steps.forEach((step) => {
      const t = setTimeout(() => {
        setProgress(step.pct);
        setStatusText(step.text);
        if (step.pct === 100) {
          setTimeout(() => {
            setHidden(true);
            sessionStorage.setItem("kinata_loader_seen", "true");
            setTimeout(() => setShouldRender(false), 450);
          }, 250);
        }
      }, step.delay);
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`retro-loader-overlay ${hidden ? "hidden" : ""}`}
      onClick={() => {
        setHidden(true);
        sessionStorage.setItem("kinata_loader_seen", "true");
        setTimeout(() => setShouldRender(false), 400);
      }}
    >
      <div className="loader-box">
        <div className="loader-title">Kinata</div>
        <div className="loader-subtitle">CGI Generalist & Digital Designer</div>
        <div className="loader-bar-track">
          <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        {statusText && <div className="loader-status-text">{statusText}</div>}
      </div>
    </div>
  );
}
