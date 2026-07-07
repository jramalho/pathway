'use client';

import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../styles/tokens.stylex';

type FilterChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  'aria-label'?: string;
};

/**
 * Neo-brutalist filter chip. Inactive = off-white with 2px border.
 * Active = acid-green with 2px border and checkmark. Visible focus
 * outline for keyboard navigation. Non-color selected indicator (✓).
 */
export function FilterChip({ label, active, onClick, ...rest }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={rest['aria-label'] ?? label}
      {...stylex.props(styles.chip, active && styles.chipActive)}
    >
      {active && <span aria-hidden="true" {...stylex.props(styles.checkmark)}>✓</span>}
      {label}
    </button>
  );
}

const styles = stylex.create({
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
      outlineWidth: tokens.borderWidthThin,
      outlineStyle: 'solid',
      outlineColor: tokens.accentFocus,
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
});
