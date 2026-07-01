'use strict';

/**
 * Pathway seed script.
 *
 * Creates the Pathway content model data: categories, an author, 4 learning paths
 * (each with 3 modules and 3 lessons per module), and publishes the
 * "React Native Performance" path.
 *
 * Usage:  pnpm seed:pathway
 * Reset:  delete apps/cms/.tmp/data.db (and -journal) then re-run.
 */

const { createStrapi, compileStrapi } = require('@strapi/strapi');

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const author = {
  name: 'Jonathan Ramalho',
  shortBio:
    'React Native and Expo engineer focused on production mobile apps, ' +
    'accessibility, and content-driven products. Building Pathway as a ' +
    'portfolio project to show how a CMS-driven learning platform fits together.',
};

const categories = [
  { name: 'Mobile', slug: 'mobile' },
  { name: 'Accessibility', slug: 'accessibility' },
  { name: 'Product', slug: 'product' },
  { name: 'AI', slug: 'ai' },
];

// Helper to build a lesson body (markdown stored in a richtext field).
function body(paragraphs) {
  return paragraphs.map((p) => p).join('\n\n');
}

// ---------------------------------------------------------------------------
// Learning paths, modules, and lessons.
// Each path has 3 modules, each module has 3 lessons (9 lessons per path).
// ---------------------------------------------------------------------------

const learningPaths = [
  {
    title: 'React Native Performance',
    slug: 'react-native-performance',
    description:
      'Identify, diagnose, and fix performance bottlenecks in React Native apps. ' +
      'Covers re-renders, lists, profiling, and the new architecture.',
    difficulty: 'intermediate',
    estimatedDurationMinutes: 180,
    featured: true,
    categorySlug: 'mobile',
    publish: true,
    modules: [
      {
        title: 'Understanding Re-renders',
        description: 'How React Native decides to re-render and how to control it.',
        order: 1,
        lessons: [
          {
            title: 'Understanding React Native Re-renders',
            slug: 'understanding-react-native-re-renders',
            summary:
              'Learn what triggers a re-render in React Native and why unnecessary re-renders slow down your app.',
            body: body([
              '## Why re-renders matter\n\nEvery re-render runs your component function and reconciles the virtual tree. In React Native, each reconciliation can cross the JS-to-native bridge, so unnecessary re-renders are more expensive than on the web.',
              '## Common triggers\n\n- Parent re-renders without memoized children\n- New object/array literals in props\n- Inline functions passed as props\n- Context value changes that few consumers actually use',
              '## What to do\n\nWrap expensive children in `React.memo`, stabilize references with `useCallback` and `useMemo`, and split contexts so a value change does not force every consumer to re-render.',
            ]),
            estimatedDurationMinutes: 15,
            difficulty: 'intermediate',
          },
          {
            title: 'Memoization Done Right',
            slug: 'memoization-done-right',
            summary:
              'When to use React.memo, useCallback, and useMemo — and when they add overhead instead of removing it.',
            body: body([
              '## The rule\n\nMemoization is not free. It costs memory and a comparison check. Use it when the component is expensive to render AND its props rarely change.',
              '## Signs you are over-memoizing\n\n- Every component is wrapped in `React.memo` with no profiling evidence.\n- `useCallback` wraps functions that are never passed to memoized children.\n- `useMemo` caches values that are cheap to recompute.',
              '## A practical check\n\nProfile with the React DevTools profiler first. Memoize only the components that show up as hot spots.',
            ]),
            estimatedDurationMinutes: 12,
            difficulty: 'intermediate',
          },
          {
            title: 'Context Without Re-render Storms',
            slug: 'context-without-re-render-storms',
            summary:
              'How to split and structure Context providers so a single value update does not re-render the entire tree.',
            body: body([
              '## The problem\n\nA single Context with a large value object forces every consumer to re-render when any field changes, even if the consumer only reads one field.',
              '## Split contexts\n\nCreate one context per concern: one for theme, one for user, one for dispatch. Consumers of the theme context do not re-render when the user changes.',
              '## Or use a selector pattern\n\nLibraries like `use-context-selector` let consumers subscribe to only the slice they need.',
            ]),
            estimatedDurationMinutes: 14,
            difficulty: 'intermediate',
          },
        ],
      },
      {
        title: 'Lists and Virtualization',
        description: 'Render long lists without dropping frames.',
        order: 2,
        lessons: [
          {
            title: 'Optimizing Long Lists with FlashList',
            slug: 'optimizing-long-lists-with-flashlist',
            summary:
              'Replace FlatList with FlashList for recycling, predictable memory, and smoother scrolling on large lists.',
            body: body([
              '## Why FlashList\n\nFlashList recycles item views like UICollectionView and RecyclerView do. This keeps memory flat as the list grows, instead of allocating a view per item.',
              '## Key props\n\n- `estimatedItemSize` — the single most important prop for performance.\n- `keyExtractor` — must be stable and unique.\n- Avoid inline `renderItem` closures that change every render.',
              '## Common mistake\n\nOmitting `estimatedItemSize` forces FlashList to measure items dynamically, which can be slower than FlatList for simple layouts.',
            ]),
            estimatedDurationMinutes: 15,
            difficulty: 'intermediate',
          },
          {
            title: 'Item Layout and Recycling',
            slug: 'item-layout-and-recycling',
            summary:
              'How view recycling works and why stable item height and key are critical to smooth scrolling.',
            body: body([
              '## Recycling explained\n\nA recycled view is reused for a different data item as you scroll. The view is not destroyed and recreated — only its content is updated.',
              '## Why layout stability matters\n\nIf item heights vary unpredictably, the recycler cannot predict scroll position, causing jumps and blank flashes.',
              '## Practical advice\n\nUse `getItemLayout` when possible. Avoid images that load at unknown sizes — set explicit dimensions or aspect ratios.',
            ]),
            estimatedDurationMinutes: 12,
            difficulty: 'intermediate',
          },
          {
            title: 'Avoiding Inline Renderers',
            slug: 'avoiding-inline-renderers',
            summary:
              'Why inline renderItem functions and inline styles hurt list performance and how to extract them.',
            body: body([
              '## The hidden cost\n\nAn inline `renderItem` is a new function every render. If the list component re-renders, every item receives a new function reference, defeating memoization.',
              '## Fix\n\nMove `renderItem` outside the component or wrap it in `useCallback`. Pass only the data each item needs.',
              '## Same for styles\n\n`style={{ flex: 1 }}` creates a new object every render. Use `StyleSheet.create` once at module scope.',
            ]),
            estimatedDurationMinutes: 10,
            difficulty: 'beginner',
          },
        ],
      },
      {
        title: 'Profiling and the New Architecture',
        description: 'Use profiling tools and understand Fabric and TurboModules.',
        order: 3,
        lessons: [
          {
            title: 'Profiling Slow Mobile Screens',
            slug: 'profiling-slow-mobile-screens',
            summary:
              'A workflow for finding the cause of jank: React DevTools, Hermes profiler, and native systrace.',
            body: body([
              '## Start with React DevTools Profiler\n\nRecord an interaction and look for components that take long to render. Flame charts show exactly where time is spent in JS.',
              '## Move to Hermes profiler\n\nIf JS execution is not the bottleneck, use the Hermes profiler to see function-level timing and find expensive non-React code.',
              '## Finish with native systrace\n\nFor bridge or native module issues, systrace shows the native frame timeline and where the main thread is blocked.',
            ]),
            estimatedDurationMinutes: 18,
            difficulty: 'advanced',
          },
          {
            title: 'Getting Started with Fabric and TurboModules',
            slug: 'getting-started-with-fabric-and-turbomodules',
            summary:
              'What the New Architecture changes, what Fabric and TurboModules are, and how to start adopting them.',
            body: body([
              '## Fabric\n\nFabric is the new rendering system. It moves layout and shadow tree computation to C++, enabling concurrent rendering and synchronous native calls.',
              '## TurboModules\n\nTurboModules replace the old bridge-based native modules with direct JSI bindings, so native function calls are synchronous and do not serialize data.',
              '## Adoption\n\nStart by enabling the New Architecture in your app config, then audit third-party libraries for compatibility. Many popular libraries already support it.',
            ]),
            estimatedDurationMinutes: 20,
            difficulty: 'advanced',
          },
          {
            title: 'Building Safe Refresh Token Flows',
            slug: 'building-safe-refresh-token-flows',
            summary:
              'Design a refresh token flow that survives app kills, race conditions, and concurrent requests.',
            body: body([
              '## The goal\n\nA user should stay logged in across app restarts without storing their password, and concurrent API calls should not trigger duplicate refresh requests.',
              '## Store the refresh token securely\n\nUse SecureStore (expo-secure-store) or Keychain, never AsyncStorage.',
              '## Handle races\n\nUse a single in-flight refresh promise. If multiple requests fail with 401 at the same time, they all await the same refresh, then retry.',
              '## Survive app kills\n\nPersist enough state to resume the session on launch: the refresh token and the user profile, not the access token (it may be expired).',
            ]),
            estimatedDurationMinutes: 16,
            difficulty: 'intermediate',
          },
        ],
      },
    ],
  },

  {
    title: 'Production Mobile Engineering',
    slug: 'production-mobile-engineering',
    description:
      'Practices for shipping and maintaining real mobile apps: feature flags, ' +
      'release safety, monitoring, and offline resilience.',
    difficulty: 'intermediate',
    estimatedDurationMinutes: 150,
    featured: false,
    categorySlug: 'product',
    publish: false,
    modules: [
      {
        title: 'Release Safety',
        description: 'Ship with confidence using staged rollouts and feature flags.',
        order: 1,
        lessons: [
          {
            title: 'Feature Flags and Release Safety',
            slug: 'feature-flags-and-release-safety',
            summary:
              'Use feature flags to decouple deploy from release and roll back without a new binary.',
            body: body([
              '## Why flags\n\nA flag lets you merge code to main, deploy it, and turn it on for a subset of users later. If something breaks, you turn it off without a new app store release.',
              '## Flag types\n\n- Release flags: short-lived, for staged rollout.\n- Experiment flags: A/B test variants.\n- Permission flags: long-lived, gate entitlements.',
              '## Keep flags clean\n\nRemove release flags once the feature is fully rolled out. Dead flags are technical debt.',
            ]),
            estimatedDurationMinutes: 14,
            difficulty: 'intermediate',
          },
          {
            title: 'Staged Rollouts',
            slug: 'staged-rollouts',
            summary:
              'How to use app store phased releases and server-side gating to limit blast radius.',
            body: body([
              '## Phased release\n\nBoth App Store Connect and Google Play support phased rollouts that gradually increase the percentage of users who get the update.',
              '## Pair with monitoring\n\nWatch crash rates and key metrics during each phase. Pause the rollout if a regression appears.',
              '## Server-side gating\n\nFor backend-dependent features, gate on the server so you can disable a feature without waiting for users to update.',
            ]),
            estimatedDurationMinutes: 12,
            difficulty: 'intermediate',
          },
          {
            title: 'Hotfix Workflow',
            slug: 'hotfix-workflow',
            summary:
              'A repeatable process for shipping a critical fix fast without breaking the main branch.',
            body: body([
              '## Branch from the release tag\n\nDo not hotfix on main. Branch from the tag the live build was cut from, so the fix includes only what is needed.',
              '## Cherry-pick to main\n\nAfter shipping the hotfix, cherry-pick the commit to main so the fix is in the next regular release.',
              '## Keep it small\n\nA hotfix is one focused change. Resist bundling unrelated fixes — they increase review time and risk.',
            ]),
            estimatedDurationMinutes: 10,
            difficulty: 'intermediate',
          },
        ],
      },
      {
        title: 'Monitoring and Crashes',
        description: 'Know what is happening in production before users tell you.',
        order: 2,
        lessons: [
          {
            title: 'Crash Reporting Basics',
            slug: 'crash-reporting-basics',
            summary:
              'Set up crash reporting, symbolicate stack traces, and triage the top crashes first.',
            body: body([
              '## Upload symbols\n\nWithout debug symbols, crash reports are useless. Upload dSYMs (iOS) and ProGuard mappings (Android) to your crash reporter on every build.',
              '## Triage by impact\n\nSort crashes by number of affected users, not by how dramatic they look. A crash hitting 5% of users is more urgent than a rare null-pointer.',
              '## Add breadcrumbs\n\nLog the last user action before a crash. Context turns a stack trace into a reproducible scenario.',
            ]),
            estimatedDurationMinutes: 13,
            difficulty: 'intermediate',
          },
          {
            title: 'Performance Monitoring',
            slug: 'performance-monitoring',
            summary:
              'Track app start time, screen render time, and network latency to catch regressions early.',
            body: body([
              '## What to measure\n\nApp start time, screen-to-interaction time, and key API latency. These are the metrics users feel.',
              '## Set budgets\n\nDefine a threshold for each metric. Alert when a release crosses it, before users complain.',
              '## Segment by device\n\nA mid-range Android phone is your real baseline. Flagship devices hide regressions.',
            ]),
            estimatedDurationMinutes: 14,
            difficulty: 'intermediate',
          },
          {
            title: 'Logging That Helps',
            slug: 'logging-that-helps',
            summary:
              'Structured logging that is useful in production without leaking PII or filling disk.',
            body: body([
              '## Structure logs\n\nUse key-value pairs, not free text. Structured logs are searchable and aggregatable.',
              '## Levels matter\n\nUse levels correctly: warn for unexpected but recoverable, error for something that needs attention. Do not log at info for everything.',
              '## Protect users\n\nNever log tokens, passwords, or PII. Redact before logging, and respect Do Not Track.',
            ]),
            estimatedDurationMinutes: 11,
            difficulty: 'beginner',
          },
        ],
      },
      {
        title: 'Offline and Resilience',
        description: 'Design apps that work when the network does not.',
        order: 3,
        lessons: [
          {
            title: 'Offline-First Data',
            slug: 'offline-first-data',
            summary:
              'Persist data locally and sync later so the app stays usable without a connection.',
            body: body([
              '## Local source of truth\n\nWrite to a local database first, then sync to the server. The UI reads from local, so it never blocks on the network.',
              '## Conflict resolution\n\nDecide a strategy before you need it: last-write-wins, server-wins, or field-level merge. Document it.',
              '## Queue mutations\n\nStore writes in a queue while offline and flush them when connectivity returns. Handle failures with retries and backoff.',
            ]),
            estimatedDurationMinutes: 16,
            difficulty: 'advanced',
          },
          {
            title: 'Retry and Backoff',
            slug: 'retry-and-backoff',
            summary:
              'Retry network requests with exponential backoff and jitter to avoid thundering herds.',
            body: body([
              '## Why backoff\n\nRetrying immediately after a failure stresses a struggling server. Exponential backoff gives it time to recover.',
              '## Add jitter\n\nPure exponential backoff causes synchronized retries. Random jitter spreads them out.',
              '## Know when to stop\n\nSet a max retry count and a max delay. After the limit, surface an error to the user instead of retrying forever.',
            ]),
            estimatedDurationMinutes: 12,
            difficulty: 'intermediate',
          },
          {
            title: 'Graceful Degradation',
            slug: 'graceful-degradation',
            summary:
              'Show useful states when data is missing or the network is down, instead of a blank screen.',
            body: body([
              '## Cache last good state\n\nIf the network fails, show the last successfully loaded data with a stale indicator, not an error.',
              '## Design empty states\n\nA screen with no data is not an error. Show a helpful empty state with a clear next action.',
              '## Distinguish error from empty\n\nAn error means something went wrong. Empty means there is nothing yet. Mixing them confuses users.',
            ]),
            estimatedDurationMinutes: 11,
            difficulty: 'beginner',
          },
        ],
      },
    ],
  },

  {
    title: 'Accessible Product Design',
    slug: 'accessible-product-design',
    description:
      'Build products that everyone can use: touch targets, focus, color contrast, ' +
      'and screen-reader-friendly patterns.',
    difficulty: 'beginner',
    estimatedDurationMinutes: 120,
    featured: false,
    categorySlug: 'accessibility',
    publish: false,
    modules: [
      {
        title: 'Touch and Movement',
        description: 'Make controls reachable and usable for people with motor differences.',
        order: 1,
        lessons: [
          {
            title: 'Accessible Touch Targets',
            slug: 'accessible-touch-targets',
            summary:
              'Size interactive elements so they are tappable by everyone, including people with motor impairments.',
            body: body([
              '## Minimum size\n\nApple recommends 44x44pt, Google 48x48dp. These are floors, not targets. When in doubt, go bigger.',
              '## Spacing matters\n\nTwo adjacent 44pt buttons with no gap are easy to mis-tap. Leave at least 8pt between targets.',
              '## Test on a real device\n\nSimulators do not model fingers. Test with a thumb on a phone, not a mouse on a laptop.',
            ]),
            estimatedDurationMinutes: 10,
            difficulty: 'beginner',
          },
          {
            title: 'Hit Slop and Overflow',
            slug: 'hit-slop-and-overflow',
            summary:
              'Use hitSlop to expand the tappable area without changing the visual size of a small control.',
            body: body([
              '## What hitSlop does\n\nIt extends the touch area beyond the visual bounds. A small icon button can have a 44pt touch area while looking compact.',
              '## Watch overflow\n\nhitSlop can overlap with adjacent targets. Keep it within the available padding so it does not steal taps from neighbors.',
              '## Pair with labels\n\nA larger touch area helps only if the control is also labelled for assistive technology.',
            ]),
            estimatedDurationMinutes: 9,
            difficulty: 'beginner',
          },
          {
            title: 'Reducing Required Precision',
            slug: 'reducing-required-precision',
            summary:
              'Design interactions that do not require precise movement, like swipe alternatives and confirmation dialogs.',
            body: body([
              '## Avoid precision-only actions\n\nA tiny drag handle that is the only way to perform an action excludes many users. Provide a button alternative.',
              '## Confirm destructive gestures\n\nA swipe-to-delete is fast for power users but easy to trigger by accident. Confirm before deleting.',
              '## Support multiple input methods\n\nLet users reach the same action via tap, keyboard, or voice. Do not rely on a single gesture.',
            ]),
            estimatedDurationMinutes: 11,
            difficulty: 'beginner',
          },
        ],
      },
      {
        title: 'Focus and Navigation',
        description: 'Keyboard and screen-reader navigation.',
        order: 2,
        lessons: [
          {
            title: 'Focus Management on Web',
            slug: 'focus-management-on-web',
            summary:
              'Manage focus for single-page interactions so keyboard and screen-reader users follow the action.',
            body: body([
              '## Move focus on route change\n\nIn a SPA, a route change does not move focus. Programmatically focus the new page heading so screen readers announce it.',
              '## Trap focus in modals\n\nWhen a dialog opens, focus should stay inside it. When it closes, focus should return to the trigger.',
              '## Visible focus\n\nNever remove the focus outline without a replacement. Keyboard users need to see where they are.',
            ]),
            estimatedDurationMinutes: 13,
            difficulty: 'intermediate',
          },
          {
            title: 'Screen Reader Labels',
            slug: 'screen-reader-labels',
            summary:
              'Give every interactive element an accessible label so screen readers describe it correctly.',
            body: body([
              '## accessibleLabel / accessibilityLabel\n\nAn icon-only button needs a label. "Close" is better than a close icon read as "multiply".',
              '## Hide decorative images\n\nSet decorative images to not be announced. Only meaningful images should be exposed to assistive technology.',
              '## Label the state\n\nA toggle button should announce its state: "Expanded" or "Collapsed", not just "Button".',
            ]),
            estimatedDurationMinutes: 12,
            difficulty: 'beginner',
          },
          {
            title: 'Logical Reading Order',
            slug: 'logical-reading-order',
            summary:
              'Structure the DOM so screen readers read content in the order a sighted user would expect.',
            body: body([
              '## Source order matters\n\nScreen readers follow the DOM order, not the visual order. If you reorder visually with CSS, the reading order may become confusing.',
              '## Use headings hierarchically\n\nH1, H2, H3 create a document outline. Screen reader users navigate by headings. Do not skip levels.',
              '## Landmarks\n\nUse landmark roles (header, nav, main, footer) so users can jump to sections quickly.',
            ]),
            estimatedDurationMinutes: 11,
            difficulty: 'intermediate',
          },
        ],
      },
      {
        title: 'Color and Contrast',
        description: 'Ensure information is perceivable without relying on color alone.',
        order: 3,
        lessons: [
          {
            title: 'Color Contrast Basics',
            slug: 'color-contrast-basics',
            summary:
              'Meet WCAG contrast ratios so text is readable for people with low vision and in bright sunlight.',
            body: body([
              '## The ratios\n\nWCAG AA requires 4.5:1 for normal text and 3:1 for large text. AAA is 7:1 and 4.5:1.',
              '## Test with a tool\n\nDo not eyeball contrast. Use a contrast checker with the exact hex values.',
              '## Remember the environment\n\nA phone in sunlight needs more contrast than a desktop in a dim office. Aim above the minimum.',
            ]),
            estimatedDurationMinutes: 10,
            difficulty: 'beginner',
          },
          {
            title: 'Do Not Rely on Color Alone',
            slug: 'do-not-rely-on-color-alone',
            summary:
              'Convey meaning with text, icons, or patterns in addition to color so colorblind users are not excluded.',
            body: body([
              '## The problem\n\nA red border for errors and a green border for success is invisible to some users. 1 in 12 men have some form of color vision deficiency.',
              '## Add a second cue\n\nPair color with an icon, a text label, or a pattern. An error should have both a red outline and an error icon and text.',
              '## Check in grayscale\n\nIf the design still works in grayscale, it does not rely on color alone.',
            ]),
            estimatedDurationMinutes: 9,
            difficulty: 'beginner',
          },
          {
            title: 'Dark Mode and Theming',
            slug: 'dark-mode-and-theming',
            summary:
              'Design themes that keep contrast and meaning in both light and dark modes.',
            body: body([
              '## Contrast in both modes\n\nA color that passes in light mode may fail in dark mode. Check both.',
              '## Semantic tokens\n\nUse semantic color names (foreground, background, danger) not raw hex values. Swap the token values per theme.',
              '## Test real content\n\nPlaceholder text is short. Test with real, long content to see if contrast and readability hold up.',
            ]),
            estimatedDurationMinutes: 12,
            difficulty: 'intermediate',
          },
        ],
      },
    ],
  },

  {
    title: 'AI Tools for Product Teams',
    slug: 'ai-tools-for-product-teams',
    description:
      'Practical, honest use of AI tools in product development: where they help, ' +
      'where they fail, and how to stay in control.',
    difficulty: 'beginner',
    estimatedDurationMinutes: 90,
    featured: false,
    categorySlug: 'ai',
    publish: false,
    modules: [
      {
        title: 'Writing With AI',
        description: 'Using AI for drafts, not for decisions.',
        order: 1,
        lessons: [
          {
            title: 'AI for First Drafts',
            slug: 'ai-for-first-drafts',
            summary:
              'Use AI to beat the blank page, then edit heavily. The draft is a starting point, not a finished product.',
            body: body([
              '## The good use\n\nAI is fast at generating a structure or a rough draft from a prompt. It turns a blank page into something to react to.',
              '## The trap\n\nA first draft that reads smoothly feels finished. It is not. Edit for accuracy, voice, and relevance before publishing.',
              '## Own the output\n\nIf you cannot explain why every sentence is there, you did not write it — you forwarded it.',
            ]),
            estimatedDurationMinutes: 10,
            difficulty: 'beginner',
          },
          {
            title: 'Prompting for Specificity',
            slug: 'prompting-for-specificity',
            summary:
              'How to write prompts that produce useful, specific output instead of generic filler.',
            body: body([
              '## Be specific about context\n\n"Write a lesson intro" gives filler. "Write a 3-sentence intro for a lesson on FlashList, audience: intermediate RN devs" gives something usable.',
              '## Constrain the format\n\nAsk for a specific structure: bullet points, a table, a fixed word count. Constraints fight generic prose.',
              '## Iterate\n\nTreat the first response as a draft. Ask for revisions with concrete feedback, not a full rewrite.',
            ]),
            estimatedDurationMinutes: 11,
            difficulty: 'beginner',
          },
          {
            title: 'Editing AI Output',
            slug: 'editing-ai-output',
            summary:
              'A checklist for turning AI-generated text into something you would put your name on.',
            body: body([
              '## Check facts first\n\nAI can state wrong facts confidently. Verify every claim, number, and API name against real documentation.',
              "## Cut filler\n\nAI loves \"In today's fast-paced world\". Cut it. Start with the point.",
              '## Match your voice\n\nRewrite sentences that sound unlike you. The goal is your writing, assisted by AI, not AI writing in your name.',
            ]),
            estimatedDurationMinutes: 9,
            difficulty: 'beginner',
          },
        ],
      },
      {
        title: 'AI in Code',
        description: 'Using AI coding tools without outsourcing judgment.',
        order: 2,
        lessons: [
          {
            title: 'AI for Boilerplate',
            slug: 'ai-for-boilerplate',
            summary:
              'Let AI write repetitive scaffolding while you own architecture and review.',
            body: body([
              '## Good delegation\n\nType definitions, test scaffolds, config files, and CRUD adapters are good candidates. They are repetitive and low-risk.',
              '## Keep judgment\n\nArchitecture, state ownership, and API contracts are decisions. Do not let AI make them for you.',
              '## Review everything\n\nRead every line AI generates as if a junior developer wrote it. Catch the subtle bug before it ships.',
            ]),
            estimatedDurationMinutes: 12,
            difficulty: 'intermediate',
          },
          {
            title: 'Reviewing AI Code',
            slug: 'reviewing-ai-code',
            summary:
              'AI-generated code needs the same review as human code — and a few extra checks.',
            body: body([
              '## Same standards\n\nAI code is not exempt from your lint, type, and test rules. If it would not pass from a human, it does not pass from AI.',
              '## Watch for hallucinated APIs\n\nAI may use functions or props that do not exist. Run the code, do not just read it.',
              '## Check the edge cases\n\nAI optimizes for the happy path. Manually test empty, null, and error states.',
            ]),
            estimatedDurationMinutes: 13,
            difficulty: 'intermediate',
          },
          {
            title: 'Knowing When Not to Use AI',
            slug: 'knowing-when-not-to-use-ai',
            summary:
              'Some tasks are faster, safer, or better done by hand. Learn to recognize them.',
            body: body([
              '## When the domain is unfamiliar\n\nIf you cannot tell if the output is right, you are not ready to use AI for it. Learn the domain first.',
              '## When the cost of error is high\n\nSecurity, data migration, and financial logic are bad candidates. The risk of a subtle AI error is too high.',
              '## When it is faster to just do it\n\nFor a one-line fix or a small rename, the time to prompt and review AI exceeds the time to do it yourself.',
            ]),
            estimatedDurationMinutes: 10,
            difficulty: 'beginner',
          },
        ],
      },
      {
        title: 'Staying in Control',
        description: 'Process and habits to keep ownership of your product.',
        order: 3,
        lessons: [
          {
            title: 'Owning Decisions',
            slug: 'owning-decisions',
            summary:
              'AI can inform decisions, but you are responsible for them. Keep the decision log.',
            body: body([
              "## The line\n\nAI can summarize options and trade-offs. The choice is yours. If the choice is wrong, that is your responsibility, not the tool's.",
              '## Write down why\n\nKeep a decision record: what you chose, what you rejected, and why. This survives tool changes and team turnover.',
              '## Do not delegate judgment\n\n"AI suggested it" is not a justification. "I chose it because X" is.',
            ]),
            estimatedDurationMinutes: 11,
            difficulty: 'beginner',
          },
          {
            title: 'Keeping Context',
            slug: 'keeping-context',
            summary:
              'AI tools lose context fast. Keep your own notes, diagrams, and decision records.',
            body: body([
              '## Context is your moat\n\nAI does not know your users, your constraints, or your history. You do. That context is the part AI cannot replace.',
              '## Write it down\n\nNotes, ADRs, and diagrams are how context survives. If it is only in your head, it is lost when you switch tools or context.',
              '## Bring context to AI\n\nThe more context you put in the prompt, the better the output. Vague prompts give vague results.',
            ]),
            estimatedDurationMinutes: 10,
            difficulty: 'beginner',
          },
          {
            title: 'Honesty About AI Use',
            slug: 'honesty-about-ai-use',
            summary:
              'Be transparent about where AI helped. Honesty builds trust; hiding it erodes it.',
            body: body([
              '## Say what AI did\n\n"AI helped draft this, I edited and verified it" is honest and clear. It sets correct expectations.',
              '## Do not claim AI work as solely yours\n\nIf AI wrote a section and you did not change it, you are forwarding, not writing. Be clear about that.',
              '## The portfolio lesson\n\nThis project uses AI for scaffolding and drafts. Every architectural decision is human-owned. That is the point.',
            ]),
            estimatedDurationMinutes: 9,
            difficulty: 'beginner',
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function setPublicPermissions(newPermissions) {
  const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    console.warn('Public role not found; skipping permission setup.');
    return;
  }

  const allPermissionsToCreate = [];
  Object.keys(newPermissions).map((controller) => {
    const actions = newPermissions[controller];
    const permissionsToCreate = actions.map((action) =>
      strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: `api::${controller}.${controller}.${action}`,
          role: publicRole.id,
        },
      })
    );
    allPermissionsToCreate.push(...permissionsToCreate);
  });
  await Promise.all(allPermissionsToCreate);
}

async function createEntry(uid, data, publish = false) {
  const params = { data };
  if (publish) {
    params.status = 'published';
  }
  return strapi.documents(uid).create(params);
}

async function findCategoryBySlug(slug) {
  return strapi.documents('api::category.category').findFirst({
    filters: { slug: { $eq: slug } },
  });
}

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------

async function seedPathway() {
  console.log('Seeding Pathway content...');

  // 1. Public permissions for all Pathway content types.
  await setPublicPermissions({
    'learning-path': ['find', 'findOne'],
    module: ['find', 'findOne'],
    lesson: ['find', 'findOne'],
    category: ['find', 'findOne'],
    author: ['find', 'findOne'],
  });

  // 2. Categories
  const categoryMap = {};
  for (const cat of categories) {
    const existing = await findCategoryBySlug(cat.slug);
    if (existing) {
      categoryMap[cat.slug] = existing;
      continue;
    }
    const created = await createEntry('api::category.category', cat);
    categoryMap[cat.slug] = created;
    console.log(`  category: ${cat.name}`);
  }

  // 3. Author
  let authorDoc = await strapi.documents('api::author.author').findFirst({
    filters: { name: { $eq: author.name } },
  });
  if (!authorDoc) {
    authorDoc = await createEntry('api::author.author', author);
    console.log(`  author: ${author.name}`);
  }

  // 4. Learning paths, modules, lessons
  for (const lp of learningPaths) {
    const category = categoryMap[lp.categorySlug];
    const lpData = {
      title: lp.title,
      slug: lp.slug,
      description: lp.description,
      difficulty: lp.difficulty,
      estimatedDurationMinutes: lp.estimatedDurationMinutes,
      featured: lp.featured,
      category: category ? { documentId: category.documentId } : null,
    };

    const lpDoc = await createEntry('api::learning-path.learning-path', lpData, lp.publish);
    console.log(`  learning path: ${lp.title}${lp.publish ? ' (published)' : ''}`);

    for (const mod of lp.modules) {
      const modData = {
        title: mod.title,
        description: mod.description,
        order: mod.order,
        learningPath: { documentId: lpDoc.documentId },
      };
      const modDoc = await createEntry('api::module.module', modData);
      console.log(`    module: ${mod.title}`);

      for (const lesson of mod.lessons) {
        const lessonData = {
          title: lesson.title,
          slug: lesson.slug,
          summary: lesson.summary,
          body: lesson.body,
          estimatedDurationMinutes: lesson.estimatedDurationMinutes,
          difficulty: lesson.difficulty,
          author: { documentId: authorDoc.documentId },
          category: category ? { documentId: category.documentId } : null,
          module: { documentId: modDoc.documentId },
          learningPath: { documentId: lpDoc.documentId },
        };
        await createEntry('api::lesson.lesson', lessonData, lp.publish);
        console.log(`      lesson: ${lesson.title}${lp.publish ? ' (published)' : ''}`);
      }
    }
  }

  console.log('Seed complete.');
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

async function main() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await seedPathway();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
