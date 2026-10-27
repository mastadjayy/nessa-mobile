import { useMemo } from 'react';

import { getCoursePath } from '@/db/queries';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import type { LessonSummary, PathModule } from '@/types/content';

/** completed = done, current = the next one to take, locked = comes after the current one. */
export type LessonState = 'completed' | 'current' | 'locked';

export type PathLesson = LessonSummary & { state: LessonState };
export type PathModuleWithState = Omit<PathModule, 'lessons'> & { lessons: PathLesson[] };

/** The course path with a state for every lesson. Re-read whenever the screen is focused. */
export function useCoursePath(courseId: string) {
  const version = useRefreshOnFocus();

  return useMemo(() => {
    let currentFound = false;

    const modules: PathModuleWithState[] = getCoursePath(courseId).map((module) => ({
      ...module,
      lessons: module.lessons.map((lesson) => {
        let state: LessonState;
        if (lesson.status === 'completed') {
          state = 'completed';
        } else if (!currentFound) {
          state = 'current';
          currentFound = true;
        } else {
          state = 'locked';
        }
        return { ...lesson, state };
      }),
    }));

    const lessons = modules.flatMap((module) => module.lessons);
    const current = lessons.find((lesson) => lesson.state === 'current') ?? null;
    const currentModule = current
      ? (modules.find((module) => module.id === current.moduleId) ?? null)
      : null;

    return {
      modules,
      lessons,
      current,
      currentModule,
      completedCount: lessons.filter((lesson) => lesson.state === 'completed').length,
      totalCount: lessons.length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, version]);
}