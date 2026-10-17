import { useEffect, useState } from "react";

export function SiteHeader() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === "dark");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const followSystem = (event: MediaQueryListEvent) => {
      try { if (localStorage.getItem("portfolio-theme")) return; } catch { /* Storage may be unavailable. */ }
      applyTheme(event.matches);
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  function applyTheme(next: boolean) {
    document.documentElement.dataset.theme = next ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next ? "#1e1e1e" : "#f0e8d9");
    setDark(next);
  }

  function toggleTheme() {
    const next = !dark;
    applyTheme(next);
    try { localStorage.setItem("portfolio-theme", next ? "dark" : "light"); } catch { /* Theme still works without storage. */ }
  }

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav aria-label="Main navigation">
        <a href="#biography">About</a>
        <a href="#research">Research</a>
        <a href="#publications">Publications</a>
      </nav>
      <button className="theme-toggle" type="button" onClick={toggleTheme}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        title={dark ? "Switch to light mode" : "Switch to dark mode"}>
        {dark ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/>
          </svg>
        )}
      </button>
    </header>
  );
}
