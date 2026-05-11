const FALLBACK_SITE_URL = "https://knitspeed-homepage.vercel.app";

function normalizeUrl(url) {
  return String(url || "").trim().replace(/\/+$/, "");
}

export function getSiteUrl() {
  const envUrl =
    typeof import.meta !== "undefined"
      ? import.meta.env?.VITE_SITE_URL
      : undefined;

  if (envUrl) {
    return normalizeUrl(envUrl);
  }

  if (typeof window !== "undefined" && window.location?.origin) {
    return normalizeUrl(window.location.origin);
  }

  return FALLBACK_SITE_URL;
}

export const SITE_URL = getSiteUrl();

export function buildAbsoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}
