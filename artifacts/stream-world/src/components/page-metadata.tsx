import { useEffect } from "react";

type PageMetadataProps = {
  title: string;
  description: string;
  image?: string | null;
  structuredData?: Record<string, unknown> | null;
};

function updateMeta(attribute: "name" | "property", key: string, content: string) {
  const existing = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  const element = existing ?? document.createElement("meta");
  const previousContent = element.getAttribute("content");

  if (!existing) {
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);

  return () => {
    if (!existing) element.remove();
    else if (previousContent === null) element.removeAttribute("content");
    else element.setAttribute("content", previousContent);
  };
}

function updateCanonical(url: string) {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const element = existing ?? document.createElement("link");
  const previousHref = element.getAttribute("href");

  if (!existing) {
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = url;

  return () => {
    if (!existing) element.remove();
    else if (previousHref === null) element.removeAttribute("href");
    else element.setAttribute("href", previousHref);
  };
}

export function PageMetadata({
  title,
  description,
  image,
  structuredData,
}: PageMetadataProps) {
  useEffect(() => {
    const previousTitle = document.title;
    const canonicalUrl = window.location.href.split("?")[0];
    const cleanup = [
      updateMeta("name", "description", description),
      updateMeta("property", "og:title", title),
      updateMeta("property", "og:description", description),
      updateMeta("property", "og:url", canonicalUrl),
      updateMeta("name", "twitter:title", title),
      updateMeta("name", "twitter:description", description),
      updateCanonical(canonicalUrl),
    ];

    if (image) {
      cleanup.push(updateMeta("property", "og:image", image));
      cleanup.push(updateMeta("name", "twitter:image", image));
    }

    document.title = title;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "page-structured-data";
    script.textContent = structuredData
      ? JSON.stringify(structuredData).replace(/</g, "\\u003c")
      : "";
    if (structuredData) document.head.appendChild(script);

    return () => {
      script.remove();
      cleanup.reverse().forEach((restore) => restore());
      document.title = previousTitle;
    };
  }, [description, image, structuredData, title]);

  return null;
}
