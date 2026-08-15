import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { RouteEffects } from "@/components/route-effects";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// The landing route stays eager so first paint needs no extra round trip.
import { HomePage } from "@/src/pages/home-page";

// Everything else is split out: the project and blog readers pull in the whole
// markdown + syntax-highlighting stack, which the home page never renders.
const ProjectsPage = lazy(() =>
  import("@/src/pages/projects-page").then((m) => ({ default: m.ProjectsPage }))
);
const ProjectPage = lazy(() =>
  import("@/src/pages/project-page").then((m) => ({ default: m.ProjectPage }))
);
const BlogPage = lazy(() =>
  import("@/src/pages/blog-page").then((m) => ({ default: m.BlogPage }))
);
const BlogPostPage = lazy(() =>
  import("@/src/pages/blog-post-page").then((m) => ({ default: m.BlogPostPage }))
);
const ExperiencePage = lazy(() =>
  import("@/src/pages/experience-page").then((m) => ({ default: m.ExperiencePage }))
);
const NotFoundPage = lazy(() =>
  import("@/src/pages/not-found-page").then((m) => ({ default: m.NotFoundPage }))
);

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
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
export default App;
