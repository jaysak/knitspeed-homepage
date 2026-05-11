import { useEffect } from "react";

function upsertMeta(name, content) {
  let element = document.querySelector(`meta[name="${name}"]`);
  const created = !element;
  const previousContent = element?.getAttribute("content");

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content || "");

  return () => {
    if (created) {
      element.remove();
    } else if (previousContent === null) {
      element.removeAttribute("content");
    } else {
      element.setAttribute("content", previousContent);
    }
  };
}

function upsertCanonical(url) {
  let element = document.querySelector('link[rel="canonical"]');
  const created = !element;
  const previousHref = element?.getAttribute("href");

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);

  return () => {
    if (created) {
      element.remove();
    } else if (previousHref === null) {
      element.removeAttribute("href");
    } else {
      element.setAttribute("href", previousHref);
    }
  };
}

export function usePageMeta({ title, description, canonicalUrl }) {
  useEffect(() => {
    const previousTitle = document.title;
    const cleanups = [];

    if (title) {
      document.title = title;
    }

    if (description !== undefined) {
      cleanups.push(upsertMeta("description", description));
    }

    if (canonicalUrl) {
      cleanups.push(upsertCanonical(canonicalUrl));
    }

    return () => {
      document.title = previousTitle;
      cleanups.reverse().forEach((cleanup) => cleanup());
    };
  }, [title, description, canonicalUrl]);
}
