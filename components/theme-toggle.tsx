type ThemeToggleProps = {
  theme: "dark" | "light";
  onToggle: () => void;
};

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.25" />
      <path d="M12 19.25v2.25" />
      <path d="M21.5 12h-2.25" />
      <path d="M4.75 12H2.5" />
      <path d="m18.72 5.28-1.59 1.59" />
      <path d="m6.87 17.13-1.59 1.59" />
      <path d="m18.72 18.72-1.59-1.59" />
      <path d="m6.87 6.87-1.59-1.59" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.8A8.98 8.98 0 0 1 11.2 3a9 9 0 1 0 9.8 9.8Z" />
    </svg>
  );
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted transition-colors duration-200 hover:text-ink"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
