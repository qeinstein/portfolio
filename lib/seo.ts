import { useEffect } from "react";

type PageMetadata = {
  title: string;
  description: string;
  pathname: string;
  type?: "website" | "article";
};

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function ensureLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

export function usePageMetadata({
  title,
  description,
  pathname,
  type = "website"
}: PageMetadata) {
  useEffect(() => {
    document.title = title;

    const url = new URL(pathname, window.location.origin).toString();

    ensureMeta('meta[name="description"]', {
      name: "description",
      content: description
    });
    ensureMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title
    });
    ensureMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description
    });
    ensureMeta('meta[property="og:type"]', {
      property: "og:type",
      content: type
    });
    ensureMeta('meta[property="og:url"]', {
      property: "og:url",
      content: url
    });
    ensureMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title
    });
    ensureMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description
    });
    ensureLink('link[rel="canonical"]', {
      rel: "canonical",
      href: url
    });
  }, [description, pathname, title, type]);
}
