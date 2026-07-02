/**
 * Typed query-string serialization.
 *
 * Converts a QueryParams object into a URLSearchParams instance,
 * handling arrays (repeated keys), null/undefined (omitted), and
 * boolean/number (stringified).
 */

import type { QueryParams } from "../types/api.ts";

export function buildQueryString(params?: QueryParams): URLSearchParams {
  const search = new URLSearchParams();
  if (!params) return search;

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        search.append(key, String(item));
      }
    } else if (typeof value === "boolean") {
      search.append(key, value ? "true" : "false");
    } else {
      search.append(key, String(value));
    }
  }

  return search;
}
