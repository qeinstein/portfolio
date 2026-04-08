import { useEffect, useState } from "react";

import { RouteEffects } from "@/components/route-effects";
import { VSCodeWorkspace } from "@/components/vscode-workspace";

export type ThemeName =
  | "one-dark-pro-night-flat"
  | "vscode-dark"
  | "vscode-light"
  | "github-dark"
  | "nord"
  | "monokai";

const themeColors: Record<ThemeName, string> = {
  "one-dark-pro-night-flat": "#16191d",
  "vscode-dark": "#1e1e1e",
  "vscode-light": "#ffffff",
  "github-dark": "#0d1117",
  "nord": "#2e3440",
  "monokai": "#272822",
};

const ALL_THEMES: ThemeName[] = [
  "one-dark-pro-night-flat",
  "vscode-dark",
  "vscode-light",
  "github-dark",
  "nord",
  "monokai",
];

function pickRandomTheme(): ThemeName {
  return ALL_THEMES[Math.floor(Math.random() * ALL_THEMES.length)];
}

export function App() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof document === "undefined") {
      return "one-dark-pro-night-flat";
    }

    const stored = localStorage.getItem("theme") as ThemeName | null;
    if (stored && (ALL_THEMES as string[]).includes(stored)) {
      return stored;
    }

    return pickRandomTheme();
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", themeColors[theme]);
  }, [theme]);

  return (
    <div className="bg-canvas font-sans text-ink antialiased">
      <RouteEffects />
      <VSCodeWorkspace
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
}
