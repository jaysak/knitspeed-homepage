const STORAGE_KEY = "knitspeed_knowledge_article";
const STORAGE_VERSION = 1;
const MAX_AGE_MS = 1000 * 60 * 30;

function isBrowser() {
  return typeof window !== "undefined";
}

function isValidArticle(article) {
  return Boolean(
    article &&
      typeof article === "object" &&
      typeof article.seoSlug === "string" &&
      typeof article.articleName === "string"
  );
}

export function storeQuoteAttribution(article) {
  if (!isBrowser() || !isValidArticle(article)) {
    return;
  }

  const payload = {
    version: STORAGE_VERSION,
    storedAt: Date.now(),
    article,
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function consumeQuoteAttribution() {
  if (!isBrowser()) {
    return null;
  }

  const raw = sessionStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  sessionStorage.removeItem(STORAGE_KEY);

  try {
    const parsed = JSON.parse(raw);

    if (parsed?.version !== STORAGE_VERSION) {
      return null;
    }

    if (
      typeof parsed?.storedAt !== "number" ||
      Date.now() - parsed.storedAt > MAX_AGE_MS
    ) {
      return null;
    }

    return isValidArticle(parsed.article) ? parsed.article : null;
  } catch (error) {
    console.warn("Could not restore quote attribution:", error);
    return null;
  }
}

export function scrollToQuoteSection() {
  window.requestAnimationFrame(() => {
    const element = document.getElementById("quote");

    if (!element) {
      return;
    }

    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
