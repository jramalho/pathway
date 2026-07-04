'use client';

import { useEffect } from 'react';
import { ContentState } from '@/components/public/states';
import { toUserFacingError, USER_FACING_MESSAGES } from '@pathway/api';

/**
 * Root error boundary.
 *
 * Required by Next.js to be a Client Component so it can receive the
 * `reset()` callback. Shows a user-facing error state with retry and
 * a safe link back to the homepage. Raw error details are logged to
 * the console for developers — never shown to end users.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Pathway] Route error:', error);
  }, [error]);

  const userKind = toUserFacingError(error);
  const message = USER_FACING_MESSAGES[userKind];

  return (
    <ContentState
      variant="error"
      eyebrow="Error"
      title="Couldn't load this page"
      description={message}
      primaryAction={{
        label: 'Try again',
        onClick: reset,
      }}
      secondaryAction={{
        label: 'Back to home',
        href: '/',
        variant: 'secondary',
      }}
    />
  );
}
