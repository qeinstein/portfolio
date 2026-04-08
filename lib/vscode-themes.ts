import type { ThemeName } from "@/src/App";

export const vscodeThemes = [
  { id: "one-dark-pro-night-flat", label: "One Dark Pro Night Flat" },
  { id: "vscode-dark", label: "Dark+" },
  { id: "github-dark", label: "GitHub Dark" },
  { id: "nord", label: "Nord" },
  { id: "monokai", label: "Monokai" },
  { id: "vscode-light", label: "Light" },
] as const satisfies ReadonlyArray<{ id: ThemeName; label: string }>;
