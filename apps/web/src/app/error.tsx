"use client";

import { toUserFacingError, USER_FACING_MESSAGES } from "@pathway/api";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const userKind = toUserFacingError(error);
  const message = USER_FACING_MESSAGES[userKind];

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24">
      <h1 className="text-2xl font-bold text-zinc-900">
        Something went wrong
      </h1>
      <p className="max-w-md text-center text-zinc-600">
        {message}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-none border-2 border-black bg-[#79FF5B] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-black"
      >
        Try again
      </button>
    </main>
  );
}
