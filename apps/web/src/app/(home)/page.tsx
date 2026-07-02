import Image from "next/image";
import Link from "next/link";
import type { LearningPath } from "@pathway/api";
import { resolveStrapiMediaUrl, toUserFacingError, USER_FACING_MESSAGES } from "@pathway/api";
import { getPathwayApiClient } from "@/lib/pathway-api";
import { getStrapiUrl } from "@/lib/env";

export const dynamic = "force-dynamic";

async function getLearningPaths(): Promise<LearningPath[]> {
  const api = getPathwayApiClient();

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
    <article className="flex flex-col gap-3 border-2 border-black bg-[#EFEEEA] p-0 overflow-hidden">
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={alt}
          width={400}
          height={200}
          className="h-40 w-full object-cover"
          unoptimized
        />
      )}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="border-2 border-black bg-[#D4E7DD] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-black">
            {difficultyLabels[path.difficulty] ?? path.difficulty}
          </span>
          {path.featured && (
            <span className="border-2 border-black bg-[#FAF9F5] px-2 py-0.5 text-xs font-bold uppercase text-black">
              ★ Featured
            </span>
          )}
        </div>
        <h2 className="text-lg font-bold text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
          {path.title}
        </h2>
        <p className="text-sm text-zinc-600">{path.description}</p>
        <div className="flex gap-4 text-sm text-zinc-500">
          <span>{path.lessonCount} lessons</span>
          <span>·</span>
          <span>{path.estimatedDuration} min</span>
        </div>
      </div>
    </article>
  );
}

export default async function Home() {
  let paths: LearningPath[];
  try {
    paths = await getLearningPaths();
  } catch (err) {
    const userKind = toUserFacingError(err);
    return (
      <main className="flex flex-1 flex-col gap-12 px-6 py-16">
        <header className="flex flex-col gap-3">
          <h1 className="text-4xl font-extrabold text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Pathway
          </h1>
        </header>
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Featured learning paths
          </h2>
          <p className="text-zinc-600">{USER_FACING_MESSAGES[userKind]}</p>
        </div>
      </main>
    );
  }

  const strapiUrl = getStrapiUrl();

  return (
    <main className="flex flex-1 flex-col gap-12 px-6 py-16">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
          Pathway
        </h1>
        <p className="max-w-xl text-lg text-zinc-600">
          Short, structured learning for mobile engineers and product builders.
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-zinc-900" style={{ fontFamily: 'var(--font-heading)' }}>
          Featured learning paths
        </h2>

        {paths.length === 0 ? (
          <p className="text-zinc-500">
            No learning paths have been published yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paths.map((path) => (
              <Link
                key={path.id}
                href={`/paths/${path.slug}`}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
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
