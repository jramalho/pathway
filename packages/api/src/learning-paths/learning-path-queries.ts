/**
 * Strapi 5 query params for LearningPath.
 *
 * Specific to LearningPath — not a generic query builder.
 * Mirrors the populate tree from the Parte 1 diagnosis:
 *   coverImage, modules, modules.lessons.
 *
 * Strapi 5 returns only published content by default on public endpoints
 * (draftAndPublish: true on LearningPath), so no explicit status filter is
 * needed for published-only queries.
 */

/** Populate tree for a full LearningPath: cover + modules + lessons. */
export function learningPathPopulateParams(): URLSearchParams {
  // Strapi 5 nested populate syntax:
  //   populate[0]=coverImage
  //   populate[1]=modules
  //   populate[modules][populate][0]=lessons
  return new URLSearchParams({
    "populate[0]": "coverImage",
    "populate[1]": "modules",
    "populate[modules][populate][0]": "lessons",
  });
}

/** Filter by slug: filters[slug][$eq]=<slug> */
export function slugFilterParams(slug: string): URLSearchParams {
  return new URLSearchParams({
    "filters[slug][$eq]": slug,
  });
}

/** Filter by featured: filters[featured][$eq]=true */
export function featuredFilterParams(): URLSearchParams {
  return new URLSearchParams({
    "filters[featured][$eq]": "true",
  });
}

/** Pagination: pagination[pageSize]=<limit> */
export function limitParams(limit: number): URLSearchParams {
  return new URLSearchParams({
    "pagination[pageSize]": String(limit),
  });
}

/** Merge multiple URLSearchParams into one. */
export function mergeParams(...params: URLSearchParams[]): URLSearchParams {
  const merged = new URLSearchParams();
  for (const p of params) {
    for (const [key, value] of p.entries()) {
      merged.append(key, value);
    }
  }
  return merged;
}
