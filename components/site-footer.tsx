import { portfolio } from "@/lib/portfolio-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-8">
        <p>
          © {new Date().getFullYear()} {portfolio.meta.name}
        </p>
        <div className="flex flex-wrap gap-5">
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
            href={portfolio.meta.x}
            className="transition-colors duration-200 hover:text-ink"
            target="_blank"
            rel="noreferrer"
          >
            X
          </a>
          <a
            href={`mailto:${portfolio.meta.email}`}
            className="transition-colors duration-200 hover:text-ink"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
