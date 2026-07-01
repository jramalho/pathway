import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { Metadata } from "next";
import type { LearningPath } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";
import { getPathwayApiClient } from "@/lib/pathway-api";
import { getStrapiUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/**
 * Deduplicate the fetch between `generateMetadata` and the page render.
 * React `cache` memoizes per-request so the CMS is hit once.
 */
const fetchLearningPath = cache(
  async (slug: string): Promise<LearningPath | null> => {
    const api = getPathwayApiClient();
    return api.getLearningPathBySlug(slug);
  },
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Catch API errors here so a network/HTTP failure doesn't prevent the
  // page component from rendering its own error boundary. Returning a
  // fallback title lets the page's error boundary handle the real error.
  let path: LearningPath | null;
  try {
    path = await fetchLearningPath(slug);
  } catch {
    return { title: "Learning Path | Pathway" };
  }

  if (!path) {
    return { title: "Learning Path | Pathway" };
  }

  return {
    title: `${path.title} | Pathway`,
    description: path.description,
  };
}

export default async function LearningPathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = await fetchLearningPath(slug);

  if (!path) notFound();

  const strapiUrl = getStrapiUrl();
  const coverUrl = path.coverImage
    ? resolveStrapiMediaUrl(path.coverImage.url, strapiUrl)
    : null;
  const coverAlt = path.coverImage?.alternativeText ?? path.title;

  return (
    <main className="flex flex-1 flex-col gap-10 px-6 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-zinc-500 dark:text-zinc-400">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/" className="hover:underline">
              Learning Paths
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-zinc-900 dark:text-zinc-50">
            {path.title}
          </li>
        </ol>
      </nav>

      <header className="flex flex-col gap-4">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={coverAlt}
            width={1200}
            height={400}
            className="h-64 w-full rounded-2xl object-cover"
            unoptimized
            priority
          />
        )}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {difficultyLabels[path.difficulty] ?? path.difficulty}
            </span>
            {path.featured && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {path.title}
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            {path.description}
          </p>
          <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
            <span>{path.lessonCount} lessons</span>
            <span>·</span>
            <span>{path.estimatedDuration} min</span>
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Modules
        </h2>
        {path.modules.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            No modules have been added to this learning path yet.
          </p>
        ) : (
          <ol className="flex flex-col gap-6">
            {path.modules.map((module) => (
              <li
                key={module.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                    Module {module.order}
                  </span>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                    {module.title}
                  </h3>
                  {module.description && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {module.description}
                    </p>
                  )}
                </div>
                {module.lessons.length === 0 ? (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    No lessons in this module yet.
                  </p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {module.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="flex flex-col gap-1 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
                            {lesson.title}
                          </h4>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {lesson.estimatedDuration} min
                          </span>
                        </div>
                        {lesson.summary && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            {lesson.summary}
                          </p>
                        )}
                        <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                          {difficultyLabels[lesson.difficulty] ?? lesson.difficulty}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}