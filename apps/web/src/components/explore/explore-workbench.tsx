'use client';

import * as stylex from '@stylexjs/stylex';
import {
  useMemo,
  useState,
  useCallback,
  useTransition,
  useRef,
  useEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { tokens } from '../../styles/tokens.stylex';
import { ContentState } from '@/components/public/states';
import { ExplorePathCard, ExploreLessonCard } from './explore-result-card';
import type { ExploreData } from '@/lib/explore-data';
import {
  applyExploreFilters,
  serializeExploreFilters,
  hasActiveFilters,
  EMPTY_FILTERS,
  deriveAvailableTopics,
  deriveAvailableDifficulties,
  type ExploreFilters,
} from '@/lib/explore-filters';

type ExploreWorkbenchProps = {
  /** Serialized Explore view data from the server. */
  data: ExploreData;
  /** Initial filter state derived from URL params. */
  initialFilters: ExploreFilters;
};

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

/** Debounce window for URL synchronization (ms). Keeps typing smooth. */
const URL_SYNC_DEBOUNCE_MS = 300;

/**
 * Explore workbench — the narrow Client Component boundary for
 * interactive discovery.
 *
 * Receives typed, serialized Explore view data and an initial filter
 * state from the server. Manages local filter state, applies pure
 * filtering logic, and synchronizes the current filters back to the URL
 * so the discovery view is shareable and refresh-safe.
 *
 * It does not fetch raw Strapi data, parse API responses, or own
 * layout/global behavior. The server loads published content; this
 * workbench only handles local filtering and URL sync.
 *
 * V1 search strategy: client-side, case-insensitive substring match
 * across real text fields. The published catalog is small enough that
 * fetching once on the server and filtering in the browser is practical
 * and avoids a per-keystroke network round-trip. URL synchronization is
 * debounced so typing doesn't create jarring navigation entries.
 */
export function ExploreWorkbench({ data, initialFilters }: ExploreWorkbenchProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<ExploreFilters>(initialFilters);

  // Derive available topics and difficulties from the actual content.
  const availableTopics = useMemo(() => deriveAvailableTopics(data), [data]);
  const availableDifficulties = useMemo(
    () => deriveAvailableDifficulties(data),
    [data],
  );

  // Debounced URL sync: update the URL after the user stops typing/changing
  // filters for URL_SYNC_DEBOUNCE_MS. Local state updates immediately so
  // the UI feels instant; only the URL lags slightly. Uses replace so
  // every keystroke doesn't create a history entry.
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const syncToUrl = useCallback(
    (next: ExploreFilters) => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = setTimeout(() => {
        const params = serializeExploreFilters(next);
        const sp = new URLSearchParams(params);
        const queryString = sp.toString();
        const url = queryString ? `/explore?${queryString}` : '/explore';
        startTransition(() => {
          router.replace(url, { scroll: false });
        });
      }, URL_SYNC_DEBOUNCE_MS);
    },
    [router],
  );

  // Cleanup pending timeout on unmount.
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  const updateFilters = useCallback(
    (patch: Partial<ExploreFilters>) => {
      setFilters((prev) => {
        const next = { ...prev, ...patch };
        syncToUrl(next);
        return next;
      });
    },
    [syncToUrl],
  );

  const resetFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    syncToUrl(EMPTY_FILTERS);
  }, [syncToUrl]);

  const results = useMemo(
    () => applyExploreFilters(data, filters),
    [data, filters],
  );

  const active = hasActiveFilters(filters);
  const hasPaths = results.paths.length > 0;
  const hasLessons = results.lessons.length > 0;
  const hasAnyResults = results.totalCount > 0;

  return (
    <section {...stylex.props(styles.workbench)} aria-label="Explore discovery">
      {/* Controls */}
      <div {...stylex.props(styles.controls)}>
        <SearchInput
          value={filters.q}
          onChange={(q) => updateFilters({ q })}
        />

        {availableTopics.length > 0 && (
          <fieldset {...stylex.props(styles.fieldset)}>
            <legend {...stylex.props(styles.label)}>Topic</legend>
            <div {...stylex.props(styles.chips)}>
              <FilterChip
                label="All"
                active={filters.topic === ''}
                onClick={() => updateFilters({ topic: '' })}
              />
              {availableTopics.map((topic) => (
                <FilterChip
                  key={topic.slug}
                  label={topic.label}
                  active={filters.topic === topic.slug}
                  onClick={() => updateFilters({ topic: topic.slug })}
                />
              ))}
            </div>
          </fieldset>
        )}

        {availableDifficulties.length > 0 && (
          <fieldset {...stylex.props(styles.fieldset)}>
            <legend {...stylex.props(styles.label)}>Difficulty</legend>
            <div {...stylex.props(styles.chips)}>
              <FilterChip
                label="All levels"
                active={filters.difficulty === ''}
                onClick={() => updateFilters({ difficulty: '' })}
              />
              {availableDifficulties.map((d) => (
                <FilterChip
                  key={d}
                  label={DIFFICULTY_LABELS[d] ?? d}
                  active={filters.difficulty === d}
                  onClick={() => updateFilters({ difficulty: d })}
                />
              ))}
            </div>
          </fieldset>
        )}
      </div>

      {/* Result count + reset */}
      <div {...stylex.props(styles.resultBar)}>
        <p {...stylex.props(styles.resultCount)} aria-live="polite" aria-atomic="true">
          {buildResultSummary(results.paths.length, results.lessons.length, filters)}
        </p>
        <div {...stylex.props(styles.resultActions)}>
          {isPending && (
            <span aria-hidden="true" {...stylex.props(styles.pendingDot)} />
          )}
          {active && (
            <button
              type="button"
              onClick={resetFilters}
              {...stylex.props(styles.reset)}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results / empty state */}
      {!hasAnyResults ? (
        <ContentState
          variant="empty"
          eyebrow="Explore"
          title="No matching learning content"
          description="No learning paths or lessons match your search text or filters. Try adjusting your query or clearing filters."
          primaryAction={{
            label: 'Clear filters',
            onClick: resetFilters,
          }}
        />
      ) : (
        <div {...stylex.props(styles.results)}>
          {hasPaths && (
            <div {...stylex.props(styles.group)}>
              <h2 {...stylex.props(styles.groupTitle)}>Learning paths</h2>
              <div {...stylex.props(styles.grid)}>
                {results.paths.map((path) => (
                  <ExplorePathCard key={path.slug} path={path} />
                ))}
              </div>
            </div>
          )}
          {hasLessons && (
            <div {...stylex.props(styles.group)}>
              <h2 {...stylex.props(styles.groupTitle)}>Lessons</h2>
              <div {...stylex.props(styles.grid)}>
                {results.lessons.map((lesson) => (
                  <ExploreLessonCard key={lesson.slug} lesson={lesson} />
                ))}
              </div>
            </div>
          )}
          {/* Per-section empty messages when one group has results but the other doesn't */}
          {hasLessons && !hasPaths && active && (
            <p {...stylex.props(styles.sectionEmpty)}>
              No learning paths match your current filters.
            </p>
          )}
          {hasPaths && !hasLessons && active && (
            <p {...stylex.props(styles.sectionEmpty)}>
              No lessons match your current filters.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/**
 * Build a concise, honest result summary.
 *
 * Examples:
 *   "1 learning path and 9 lessons"
 *   "3 learning paths"
 *   "2 lessons"
 *   "2 lessons for “performance”"
 *   "No matching content"
 */
function buildResultSummary(
  pathCount: number,
  lessonCount: number,
  filters: ExploreFilters,
): string {
  const total = pathCount + lessonCount;
  if (total === 0) return 'No matching content';

  const parts: string[] = [];
  if (pathCount > 0) {
    parts.push(`${pathCount} ${pathCount === 1 ? 'learning path' : 'learning paths'}`);
  }
  if (lessonCount > 0) {
    parts.push(`${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}`);
  }

  const summary = parts.join(' and ');
  if (filters.q) {
    return `${summary} for “${filters.q}”`;
  }
  return summary;
}

// ---------------------------------------------------------------------------
// SearchInput — isolated interactive control with clear button
// ---------------------------------------------------------------------------

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

function SearchInput({ value, onChange }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onChange('');
    // Return focus to the input after clearing so keyboard users stay in context.
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div {...stylex.props(styles.searchField)}>
      <label htmlFor="explore-search" {...stylex.props(styles.label)}>
        Search
      </label>
      <div {...stylex.props(styles.searchInputWrap)}>
        <input
          ref={inputRef}
          id="explore-search"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search lessons and learning paths"
          aria-label="Search learning paths and lessons"
          autoComplete="off"
          spellCheck={false}
          {...stylex.props(styles.input)}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            {...stylex.props(styles.clearBtn)}
          >
            <ClearIcon />
          </button>
        )}
      </div>
    </div>
  );
}

function ClearIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// FilterChip — accessible toggle chip with non-color selected indicator
// ---------------------------------------------------------------------------

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      {...stylex.props(styles.chip, active && styles.chipActive)}
    >
      {active && <span aria-hidden="true" {...stylex.props(styles.checkmark)}>✓</span>}
      {label}
    </button>
  );
}

const styles = stylex.create({
  workbench: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
    padding: {
      default: tokens.spaceLg,
      '@media (min-width: 768px)': tokens.spaceXl,
    },
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
  },
  searchField: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
  },
  searchInputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    minHeight: '2.75rem',
    paddingBlock: tokens.spaceSm,
    paddingInline: tokens.spaceMd,
    paddingRight: '2.5rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeMd,
    color: tokens.textPrimary,
    backgroundColor: tokens.surfacePage,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    '::placeholder': {
      color: tokens.textSecondary,
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.accentFocus}`,
      outlineOffset: '2px',
    },
  },
  clearBtn: {
    position: 'absolute',
    right: tokens.spaceSm,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    padding: 0,
    border: 'none',
    backgroundColor: 'transparent',
    color: tokens.textSecondary,
    cursor: 'pointer',
    borderRadius: tokens.radiusSm,
    transition: tokens.transitionFast,
    ':hover': {
      color: tokens.textPrimary,
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.accentFocus}`,
      outlineOffset: '2px',
    },
  },
  fieldset: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
    margin: 0,
    padding: 0,
    borderWidth: 0,
  },
  label: {
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spaceSm,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceXs,
    minHeight: '2.25rem',
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceMd,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    color: tokens.textPrimary,
    backgroundColor: tokens.surfacePage,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    cursor: 'pointer',
    transition: tokens.transitionFast,
    whiteSpace: 'nowrap',
    ':hover': {
      backgroundColor: tokens.surfaceMuted,
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.accentFocus}`,
      outlineOffset: '2px',
    },
  },
  chipActive: {
    backgroundColor: tokens.surfaceAction,
    color: tokens.textOnAccent,
    borderColor: tokens.borderStrong,
    ':hover': {
      backgroundColor: tokens.surfaceActionHover,
    },
  },
  checkmark: {
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: 1,
  },
  resultBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.spaceMd,
    flexWrap: 'wrap',
  },
  resultActions: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spaceMd,
  },
  pendingDot: {
    display: 'inline-block',
    width: '0.5rem',
    height: '0.5rem',
    backgroundColor: tokens.accentActive,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
  },
  resultCount: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.textSecondary,
  },
  reset: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '2.25rem',
    paddingBlock: tokens.spaceXs,
    paddingInline: tokens.spaceMd,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    color: tokens.textOnAccent,
    backgroundColor: tokens.surfaceAction,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    cursor: 'pointer',
    boxShadow: tokens.shadowPressed,
    transition: tokens.transitionFast,
    ':hover': {
      backgroundColor: tokens.surfaceActionHover,
    },
    ':focus-visible': {
      outline: `2px solid ${tokens.accentFocus}`,
      outlineOffset: '2px',
    },
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space2xl,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceLg,
  },
  groupTitle: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBlack,
    letterSpacing: '-0.01em',
    color: tokens.textPrimary,
  },
  grid: {
    display: 'grid',
    gap: tokens.spaceLg,
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 640px)': 'repeat(2, 1fr)',
      '@media (min-width: 1024px)': 'repeat(3, 1fr)',
    },
  },
  sectionEmpty: {
    margin: 0,
    padding: tokens.spaceLg,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
    backgroundColor: tokens.surfaceMuted,
    borderWidth: tokens.borderWidthThin,
    borderStyle: 'solid',
    borderColor: tokens.borderThin,
  },
});