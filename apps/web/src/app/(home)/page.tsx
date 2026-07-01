import Image from "next/image";
import Link from "next/link";
import type { LearningPath } from "@pathway/api";
import { resolveStrapiMediaUrl } from "@pathway/api";
import { getPathwayApiClient } from "@/lib/pathway-api";
import { getStrapiUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

async function getLearningPaths(): Promise<LearningPath[]> {
  const api = getPathwayApiClient();

  // Try featured first; fall back to all published if none are featured.
  const featured = await api.getFeaturedLearningPaths();
  if (featured.length > 0) return featured;

  return api.getPublishedLearningPaths();
}

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function LearningPathCard({ path, strapiUrl }: { path: LearningPath; strapiUrl: string }) {
  const coverUrl = path.coverImage
    ? resolveStrapiMediaUrl(path.coverImage.url, strapiUrl)
    : null;
  const alt = path.coverImage?.alternativeText ?? path.title;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={alt}
          width={400}
          height={200}
          className="h-40 w-full rounded-xl object-cover"
          unoptimized
        />
      )}
      <div className="flex flex-col gap-1">
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
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          {path.title}
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{path.description}</p>
      </div>
      <div className="flex gap-4 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{path.lessonCount} lessons</span>
        <span>·</span>
        <span>{path.estimatedDuration} min</span>
      </div>
    </article>
  );
}

export default async function Home() {
  const paths = await getLearningPaths();
  const strapiUrl = getStrapiUrl();

  return (
    <main className="flex flex-1 flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Pathway
        </h1>
        <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
          Short, structured learning for mobile engineers and product builders.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Featured learning paths
        </h2>

        {paths.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400">
            No learning paths have been published yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map((path) => (
              <Link
                key={path.id}
                href={`/paths/${path.slug}`}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 rounded-2xl"
              >
                <LearningPathCard path={path} strapiUrl={strapiUrl} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
