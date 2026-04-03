import { NotFoundState } from "@/components/not-found-state";
import { portfolio } from "@/lib/portfolio-data";
import { usePageMetadata } from "@/lib/seo";

export function NotFoundPage() {
  usePageMetadata({
    title: `Page not found | ${portfolio.meta.name}`,
    description: "The page you requested could not be found.",
    pathname: "/404"
  });

  return (
    <NotFoundState
      title="That route is not here."
      description="Try the homepage, the project archive, or the blog instead."
    />
  );
}
