import { portfolio } from "@/lib/portfolio-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} {portfolio.meta.name}</p>
    </footer>
  );
}
