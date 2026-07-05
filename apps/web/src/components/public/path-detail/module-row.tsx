import * as stylex from '@stylexjs/stylex';
import { tokens } from '../../../styles/tokens.stylex';
import type { PathDetailModule } from '@/lib/path-data';
import { LessonRow } from './lesson-row';

type ModuleRowProps = {
  module: PathDetailModule;
};

/**
 * A single module row in the path curriculum.
 *
 * Always visible — no accordion. The published portfolio content set
 * is small (3 modules, 3 lessons each), so progressive disclosure
 * would add complexity without improving scannability. Each module
 * displays its order number (from the Strapi `order` field), title,
 * optional description, lesson count, and its lessons in content order.
 */
export function ModuleRow({ module }: ModuleRowProps) {
  return (
    <li {...stylex.props(styles.module)}>
      <div {...stylex.props(styles.header)}>
        <span aria-hidden="true" {...stylex.props(styles.number)}>
          {String(module.order).padStart(2, '0')}
        </span>
        <div {...stylex.props(styles.headerBody)}>
          <h3 {...stylex.props(styles.title)}>{module.title}</h3>
          {module.description && (
            <p {...stylex.props(styles.description)}>{module.description}</p>
          )}
          <p {...stylex.props(styles.lessonCount)}>
            {module.lessons.length}{' '}
            {module.lessons.length === 1 ? 'lesson' : 'lessons'}
          </p>
        </div>
      </div>

      {module.lessons.length > 0 ? (
        <ol {...stylex.props(styles.lessonList)}>
          {module.lessons.map((lesson, index) => (
            <LessonRow key={lesson.id} lesson={lesson} index={index + 1} />
          ))}
        </ol>
      ) : (
        <p {...stylex.props(styles.noLessons)}>
          Lessons for this module will appear here once published.
        </p>
      )}
    </li>
  );
}

const styles = stylex.create({
  module: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.surfaceRaised,
    borderWidth: tokens.borderWidthStrong,
    borderStyle: 'solid',
    borderColor: tokens.borderStrong,
    boxShadow: tokens.shadowResting,
  },
  header: {
    display: 'flex',
    gap: tokens.spaceLg,
    padding: tokens.spaceXl,
    borderBottomWidth: tokens.borderWidthStrong,
    borderBottomStyle: 'solid',
    borderBottomColor: tokens.borderStrong,
  },
  number: {
    display: 'inline-block',
    flexShrink: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSize2xl,
    fontWeight: tokens.fontWeightBlack,
    color: tokens.textSecondary,
    lineHeight: 1,
  },
  headerBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spaceXs,
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontFamily: tokens.fontFamilyHeading,
    fontSize: tokens.fontSizeXl,
    fontWeight: tokens.fontWeightBlack,
    lineHeight: tokens.lineHeightTight,
    letterSpacing: '-0.02em',
    color: tokens.textPrimary,
  },
  description: {
    margin: 0,
    maxWidth: '42rem',
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    lineHeight: tokens.lineHeightRelaxed,
    color: tokens.textSecondary,
  },
  lessonCount: {
    margin: 0,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeXs,
    fontWeight: tokens.fontWeightSemibold,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: tokens.textSecondary,
  },
  lessonList: {
    display: 'flex',
    flexDirection: 'column',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  noLessons: {
    margin: 0,
    padding: tokens.spaceLg,
    fontFamily: tokens.fontFamilyBody,
    fontSize: tokens.fontSizeSm,
    color: tokens.textSecondary,
    fontStyle: 'italic',
  },
});