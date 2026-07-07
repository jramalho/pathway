'use client';

import * as stylex from '@stylexjs/stylex';
import { useRef, useCallback } from 'react';
import { tokens } from '../../styles/tokens.stylex';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  'aria-label'?: string;
  id?: string;
};

/**
 * Neo-brutalist search input: 2px black border, search icon on the left,
 * clear button on the right. Visible focus outline for keyboard users.
 * Replaces the inline SearchInput pattern in ExploreWorkbench.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  id,
  ...rest
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.inputWrap)}>
        <span aria-hidden="true" {...stylex.props(styles.icon)}>
          <SearchIcon />
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={rest['aria-label'] ?? 'Search'}
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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" />
      <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const styles = stylex.create({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    left: tokens.spaceMd,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.textSecondary,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    minHeight: '2.75rem',
    paddingBlock: tokens.spaceSm,
    paddingLeft: '2.5rem',
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
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
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
    transition: tokens.transitionFast,
    ':hover': {
      color: tokens.textPrimary,
    },
    ':focus-visible': {
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
      outlineOffset: '2px',
    },
  },
});
