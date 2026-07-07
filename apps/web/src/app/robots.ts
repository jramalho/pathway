import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

/**
 * Robots route — `/robots.txt`.
 *
 * Allows crawling of public content routes and points to the sitemap.
 * Disallows internal API routes and clearly non-public routes.
 *
 * robots.txt is a crawl hint, not access control — non-public routes
 * also carry `noindex` meta tags and require authentication where
 * appropriate. The CMS admin URL is intentionally not exposed here.
 *
 * In local development, `host` is omitted when the site URL resolves to
 * localhost (setting `host: localhost` would be misleading to crawlers
 * and is only meaningful for a real public origin).
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const isLocalhost = base.startsWith("http://localhost");

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/explore", "/paths/", "/lessons/"],
      disallow: [
        // Internal API routes (none currently, but guard future additions).
        "/api/",
        // Non-public / placeholder routes — kept out of the index via
        // robots as a defense-in-depth measure alongside per-route noindex.
        "/signin",
        "/topics",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    ...(isLocalhost ? {} : { host: base }),
  };
}
