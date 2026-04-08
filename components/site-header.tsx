import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";

import { portfolio } from "@/lib/portfolio-data";
import { ThemeToggle } from "@/components/theme-toggle";

type NavItem = {
  id: string;
  label: string;
  sectionId: string;
  route?: string;
};

const navItems: NavItem[] = [
  { id: "experience", label: "Experience", sectionId: "experience" },
  { id: "who-i-am", label: "Who I Am", sectionId: "who-i-am", route: "/who-i-am" },
  { id: "projects", label: "Projects", sectionId: "projects" },
  { id: "skills", label: "Skills", sectionId: "skills" },
  { id: "blog", label: "Blog", sectionId: "blog-preview", route: "/blog" }
];

type SiteHeaderProps = {
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

function getRouteActiveId(pathname: string) {
  if (pathname.startsWith("/blog")) {
    return "blog";
  }

  if (pathname.startsWith("/projects")) {
    return "projects";
  }

  if (pathname.startsWith("/experience")) {
    return "experience";
  }

  if (pathname.startsWith("/who-i-am")) {
    return "who-i-am";
  }

  return "experience";
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function QuantumMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      className="h-9 w-9"
      fill="none"
    >
      <circle cx="16" cy="16" r="13" stroke="currentColor" strokeWidth="1.3" opacity="0.65" />
      <path
        d="M6.5 16c2.7-4.2 6-6.3 9.5-6.3S22.8 11.8 25.5 16c-2.7 4.2-6 6.3-9.5 6.3S9.2 20.2 6.5 16Z"
        stroke="currentColor"
        strokeWidth="1.3"
        opacity="0.85"
      />
      <path
        d="M16 6.5c4.2 2.7 6.3 6 6.3 9.5S20.2 22.8 16 25.5c-4.2-2.7-6.3-6-6.3-9.5S11.8 9.2 16 6.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        opacity="0.85"
      />
      <circle cx="16" cy="16" r="1.9" fill="currentColor" />
    </svg>
  );
}

type NavButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function NavButton({ label, active, onClick }: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-sm transition-all duration-200 ${
        active
          ? "bg-surface text-ink shadow-sm ring-1 ring-line"
          : "text-muted hover:bg-surface/60 hover:text-ink"
      }`}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </button>
  );
}

export function SiteHeader({ theme, onToggleTheme }: SiteHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [activeSection, setActiveSection] = useState("experience");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.scrollY < 4;
  });

  const activeNavId = useMemo(() => {
    if (location.pathname !== "/") {
      return getRouteActiveId(location.pathname);
    }

    return activeSection;
  }, [activeSection, location.pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection(getRouteActiveId(location.pathname));
      return;
    }

    const sectionToNavId = new Map(
      navItems.map((item) => [item.sectionId, item.id])
    );
    const observedSections = navItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((section): section is HTMLElement => Boolean(section));

    const hashTarget = location.hash.replace(/^#/, "");

    if (hashTarget) {
      setActiveSection(sectionToNavId.get(hashTarget) ?? hashTarget);
    }

    if (observedSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              right.intersectionRatio - left.intersectionRatio ||
              left.boundingClientRect.top - right.boundingClientRect.top
          );

        if (visibleEntries[0]) {
          setActiveSection(
            sectionToNavId.get(visibleEntries[0].target.id) ?? "experience"
          );
        }
      },
      {
        rootMargin: "-32% 0px -48% 0px",
        threshold: [0.2, 0.45, 0.7]
      }
    );

    observedSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location.hash, location.pathname]);

  useEffect(() => {
    function handleScroll() {
      setIsAtTop(window.scrollY < 4);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function goToSection(sectionId: string) {
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate({
        pathname: "/",
        hash: `#${sectionId}`
      });
      return;
    }

    setActiveSection(
      navItems.find((item) => item.sectionId === sectionId)?.id ?? "experience"
    );
    window.history.replaceState(null, "", `/#${sectionId}`);

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }

  function goToRoute(route: string) {
    setIsMenuOpen(false);
    navigate(route);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b bg-canvas/88 backdrop-blur transition-colors duration-200 ${
          isAtTop ? "border-transparent" : "border-line"
        }`}
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 md:px-8">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center text-muted transition-colors duration-200 hover:text-ink"
            aria-label="Home"
          >
            <QuantumMark />
          </button>
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <NavButton
                  key={item.id}
                  label={item.label}
                  active={activeNavId === item.id}
                  onClick={() =>
                    item.route ? goToRoute(item.route) : goToSection(item.sectionId)
                  }
                />
              ))}
            </nav>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors duration-200 hover:text-ink md:hidden"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-sheet"
              aria-label="Toggle navigation menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen ? (
        <div
          className="fixed inset-0 z-30 bg-canvas/70 backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            id="mobile-nav-sheet"
            className="border-b border-line bg-canvas px-6 pb-6 pt-24"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto max-w-5xl space-y-5">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <NavButton
                    key={item.id}
                    label={item.label}
                    active={activeNavId === item.id}
                    onClick={() =>
                      item.route ? goToRoute(item.route) : goToSection(item.sectionId)
                    }
                  />
                ))}
              </nav>
              <div className="grid gap-2 border-t border-line pt-5 text-sm text-muted">
                <a
                  href={portfolio.meta.github}
                  className="transition-colors duration-200 hover:text-ink"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  href={portfolio.meta.linkedin}
                  className="transition-colors duration-200 hover:text-ink"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href={`mailto:${portfolio.meta.email}`}
                  className="transition-colors duration-200 hover:text-ink"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
