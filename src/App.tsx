import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { RouteEffects } from "@/components/route-effects";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

import { HomePage } from "@/src/pages/home-page";
import { ProjectsPage } from "@/src/pages/projects-page";
import { ProjectPage } from "@/src/pages/project-page";
import { BlogPage } from "@/src/pages/blog-page";
import { BlogPostPage } from "@/src/pages/blog-post-page";
import { ExperiencePage } from "@/src/pages/experience-page";
import { NotFoundPage } from "@/src/pages/not-found-page";

export type ThemeName =
  | "one-dark-pro-night-flat"
  | "vscode-dark"
  | "vscode-light"
  | "github-dark"
  | "nord"
  | "monokai";

export function App() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as ThemeName | null;
      if (stored) return stored;
    }
    return "one-dark-pro-night-flat";
  });

  const location = useLocation();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    const themeColor = theme === "vscode-light" ? "#fafbfd" : "#08090b";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
  }, [theme]);

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "vscode-light" ? "one-dark-pro-night-flat" : "vscode-light"
    );
  };

  // Maps theme back to a simple binary string for headers and toggles
  const mappedTheme = theme === "vscode-light" ? "light" : "dark";

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink antialiased flex flex-col transition-colors duration-200">
      <RouteEffects />
      <SiteHeader theme={mappedTheme} onToggleTheme={toggleTheme} />
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 md:px-8 py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  );
}
export default App;
