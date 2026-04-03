import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { RouteEffects } from "@/components/route-effects";

const BlogPage = lazy(() =>
  import("./pages/blog-page").then((module) => ({ default: module.BlogPage }))
);
const BlogPostPage = lazy(() =>
  import("./pages/blog-post-page").then((module) => ({
    default: module.BlogPostPage,
  }))
);
const HomePage = lazy(() =>
  import("./pages/home-page").then((module) => ({ default: module.HomePage }))
);
const NotFoundPage = lazy(() =>
  import("./pages/not-found-page").then((module) => ({
    default: module.NotFoundPage,
  }))
);
const ProjectPage = lazy(() =>
  import("./pages/project-page").then((module) => ({
    default: module.ProjectPage,
  }))
);

export function App() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof document === "undefined") {
      return "dark";
    }

    return document.documentElement.dataset.theme === "light" ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f7f5ef" : "#0a0a0a");
  }, [theme]);

  return (
    <div className="bg-canvas font-sans text-ink antialiased">
      <RouteEffects />
      <SiteHeader
        theme={theme}
        onToggleTheme={() =>
          setTheme((current) => (current === "dark" ? "light" : "dark"))
        }
      />
      <main className="mx-auto min-h-screen max-w-5xl px-6 md:px-8">
        <Suspense
          fallback={
            <div className="py-16 text-base leading-8 text-muted md:py-24">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
