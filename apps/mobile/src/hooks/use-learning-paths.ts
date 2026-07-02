import { useQuery } from "./use-query";
import { getPathwayApiClient } from "@/lib/pathway-api";

/**
 * Fetch featured learning paths, falling back to all published
 * if none are featured. Uses the shared @pathway/api client.
 */
export function useFeaturedLearningPathsQuery() {
  return useQuery(async (signal) => {
    const api = getPathwayApiClient();
    const featured = await api.getFeaturedLearningPaths({ signal });
    if (featured.length > 0) return featured;
    return api.getPublishedLearningPaths({ signal });
  }, []);
}

/**
 * Fetch all published learning paths.
 */
export function usePublishedLearningPathsQuery() {
  return useQuery(async (signal) => {
    const api = getPathwayApiClient();
    return api.getPublishedLearningPaths({ signal });
  }, []);
}

/**
 * Fetch a single learning path by slug.
 */
export function useLearningPathBySlugQuery(slug: string | undefined) {
  return useQuery(
    async (signal) => {
      if (!slug) return null;
      const api = getPathwayApiClient();
      return api.getLearningPathBySlug(slug, { signal });
    },
    [slug],
    { enabled: !!slug },
  );
}
