import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';
import type { PathDetailView } from '@/lib/path-data';
import { ModuleRow } from './module-row';

type PathCurriculumProps = {
  path: PathDetailView;
};

/**
 * Structured curriculum section for a learning path.
 *
 * Renders modules in their actual content order with lessons inside
 * each module. The section carries `id="curriculum"` so the hero's
 * primary CTA ("View curriculum") can anchor to it. When the path has
 * no modules, a graceful empty state is shown — not an application
 * crash.
 */
export function PathCurriculum({ path }: PathCurriculumProps) {
  const moduleCount = path.modules.length;

  return (
    <section id="curriculum" {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.header)}>
        <p {...stylex.props(styles.eyebrow)}>
          <span aria-hidden="true" {...stylex.props(styles.eyebrowMark)}>▍</span>
          Curriculum
        </p>
        <h2 {...stylex.props(styles.title)}>Path curriculum</h2>
        <p {...stylex.props(styles.supporting)}>
          {moduleCount > 0
            ? `${moduleCount} ${moduleCount === 1 ? 'module' : 'modules'} · ${path.lessonCount} ${path.lessonCount === 1 ? 'lesson' : 'lessons'}`
            : 'The curriculum will appear here once modules are published.'}
        </p>
      </div>

      {moduleCount > 0 ? (
        <ol {...stylex.props(styles.moduleList)}>
          {path.modules.map((module) => (
            <ModuleRow key={module.id} module={module} />
          ))}
        </ol>
      ) : (
        <div {...stylex.props(styles.empty)}>
          <p {...stylex.props(styles.emptyTitle)}>No modules published yet</p>
          <p {...stylex.props(styles.emptyDescription)}>
            This learning path doesn&apos;t have published modules yet.
            Check back soon or explore other available paths.
          </p>
        </div>
      )}
    </section>
  );
}

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXl,
    scrollMarginTop: tokens.space2xl,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: tokens.spaceSm,
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    fontWeight: tokens.fontWeightBold,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.textSecondary,
  },
  eyebrowMark: {
    display: 'inline-block',
    color: tokens.accentActive,
    fontSize: tokens.fontSizeMd,
    lineHeight: 1,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: {
      default: tokens.fontSizeXl,
      '@media (min-width: 768px)': tokens.fontSize2xl,
    },
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.02em',
    color: tokens.textPrimary,
  },
  supporting: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  moduleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXl,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceSm,
    padding: tokens.space2xl,
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
  },
  emptyTitle: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeLg,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textPrimary,
  },
  emptyDescription: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
});