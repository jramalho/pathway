import { useCallback, useEffect, useRef, useState } from "react";

import { ApiError, isApiError, toUserFacingError, USER_FACING_MESSAGES } from "@pathway/api";

/**
 * Minimal query hook — no RTK Query, no TanStack Query.
 *
 * Wraps an async function with loading/error/refresh states and
 * AbortController lifecycle. Screens use this instead of
 * useEffect + fetch + useState.
 */

export interface QueryResult<T> {
  data: T | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: ApiError | null;
  /** User-facing message derived from the error. */
  errorMessage: string | null;
  refetch: () => void;
}

export interface QueryOptions {
  /** Disable the initial fetch (useful for slug-gated queries). */
  enabled?: boolean;
}

export function useQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
  options?: QueryOptions,
): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const queryFnRef = useRef(queryFn);

  useEffect(() => {
    queryFnRef.current = queryFn;
  });

  const enabled = options?.enabled ?? true;

  const execute = useCallback(async (signal: AbortSignal) => {
    setIsFetching(true);
    try {
      const result = await queryFnRef.current(signal);
      if (!signal.aborted) {
        setData(result);
        setError(null);
        setIsLoading(false);
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      if (!signal.aborted) {
        const apiError = isApiError(err) ? err : new ApiError({
          kind: "network",
          message: err instanceof Error ? err.message : String(err),
          retriable: false,
        });
        setError(apiError);
        setIsLoading(false);
      }
    } finally {
      if (!signal.aborted) {
        setIsFetching(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const { signal } = controller;
    // IIFE keeps the async call out of the effect's synchronous body.
    (async () => {
      await execute(signal);
    })();
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  const refetch = useCallback(() => {
    const controller = new AbortController();
    const { signal } = controller;
    (async () => {
      await execute(signal);
    })();
    return () => controller.abort();
  }, [execute]);

  const errorMessage = error ? USER_FACING_MESSAGES[toUserFacingError(error)] : null;

  return { data, isLoading, isFetching, isError: error !== null, error, errorMessage, refetch };
}
