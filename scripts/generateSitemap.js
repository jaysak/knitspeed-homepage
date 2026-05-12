import { writeFileSync } from "node:fs";
import { TEXTILE_KNOWLEDGE_PAGES } from "../src/data/textileKnowledgePages.js";

const SITE_URL = "https://knitspeed-homepage.vercel.app";

const routes = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    path: "/knowledge",
    priority: "0.9",
    changefreq: "weekly",
  },
  ...TEXTILE_KNOWLEDGE_PAGES.map((page) => ({
    path: page.canonicalPath || `/knowledge/${page.slug}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
];

const uniqueRoutes = Array.from(
  new Map(routes.map((route) => [route.path, route])).values()
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueRoutes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);

console.log(`Generated public/sitemap.xml with ${uniqueRoutes.length} routes.`);
