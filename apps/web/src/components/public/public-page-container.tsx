import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { tokens } from '../../styles/tokens.stylex';

type PublicPageContainerProps = {
  children: ReactNode;
  /** Optional id for skip-link target. Defaults to "main-content". */
  id?: string;
};

/**
 * Constrained main content container for public pages.
 * Centers children and applies responsive horizontal padding.
 */
export function PublicPageContainer({
  children,
  id = 'main-content',
}: PublicPageContainerProps) {
  return (
    <div id={id} {...stylex.props(styles.container)}>
      {children}
    </div>
  );
}

const styles = stylex.create({
  container: {
    width: '100%',
    maxWidth: tokens.contentMaxWidth,
    marginInline: 'auto',
    paddingInline: tokens.contentPaddingInline,
    paddingBlock: tokens.space3xl,
  },
});
