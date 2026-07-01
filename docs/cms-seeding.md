# CMS Seeding

How to reset and seed the local Strapi database for Pathway.

## Prerequisites

- Node 22 and pnpm installed (see root README)
- Dependencies installed: `pnpm install` from the repo root

## Seed data

The seed script (`apps/cms/scripts/seed-pathway.js`) creates:

- 4 categories: Mobile, Accessibility, Product, AI
- 1 author: Jonathan Ramalho
- 4 learning paths, each with 3 modules and 3 lessons per module (36 lessons total)
- The **React Native Performance** path is fully published (path, modules, and lessons)
- Public read permissions for learning-path, module, lesson, category, and author

The script is idempotent for categories and the author (it skips them if they
already exist by slug/name). Learning paths, modules, and lessons are created
fresh each run, so **reset before re-seeding** to avoid duplicates.

## Reset and seed

From the repository root:

```bash
# 1. Stop the CMS if it is running.

# 2. Delete the local SQLite database.
rm -f apps/cms/.tmp/data.db apps/cms/.tmp/data.db-journal

# 3. Start the CMS once so Strapi creates the schema and the admin account.
pnpm dev:cms
# Create the admin account at http://localhost:1337/admin when prompted.
# Stop the CMS (Ctrl+C) once it has finished booting.

# 4. Seed the content.
pnpm --filter @pathway/cms seed:pathway
```

## Re-seed without recreating the admin account

If you already have an admin account and just want fresh content:

```bash
rm -f apps/cms/.tmp/data.db apps/cms/.tmp/data.db-journal
pnpm dev:cms          # let it boot, then Ctrl+C
pnpm --filter @pathway/cms seed:pathway
```

The admin account is stored in the database, so deleting `data.db` removes it.
If you want to keep the admin account, back up the database before deleting.

## Verify the seed

After seeding, start the CMS and check the public API:

```bash
pnpm dev:cms
```

Published content is readable without authentication:

```bash
# Published learning paths
curl http://localhost:1337/api/learning-paths

# Published lessons
curl http://localhost:1337/api/lessons
```

Only the **React Native Performance** path and its lessons are published.
The other three paths remain as drafts and will not appear in public API
responses until you publish them in the Strapi admin.

## Edit seeded content

Open http://localhost:1337/admin, log in, and use the Content Manager to
edit any seeded entry. The React Native Performance path and its lessons are
already published; the other paths are drafts you can review and publish.
