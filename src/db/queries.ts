import type {
    ContentItem,
    ContentKind,
    Exercise,
    Lesson,
    LessonStatus,
    LessonSummary,
    PathModule,
} from '@/types/content';

import { getDb } from './index';

const DEFAULT_LOCALE = 'en';

// ---------------------------------------------------------------------------
// Row shapes (as stored in SQLite)
// ---------------------------------------------------------------------------
type PathRow = {
  module_id: string;
  module_position: number;
  module_title: string;
  module_description: string | null;
  id: string;
  position: number;
  title: string;
  description: string | null;
  estimated_minutes: number;
  item_count: number;
  exercise_count: number;
  status: 'in_progress' | 'completed' | null;
  best_score: number | null;
};

type LessonRow = {
  id: string;
  module_id: string;
  position: number;
  title: string;
  description: string | null;
  estimated_minutes: number;
};

type ItemRow = {
  id: string;
  lesson_id: string;
  position: number;
  kind: ContentKind;
  text: string;
  respelling: string | null;
  audio_file: string | null;
  notes: string | null;
  reviewed: number;
  translation: string | null;
  example_translation: string | null;
};

type ExerciseRow = {
  id: string;
  lesson_id: string;
  item_id: string | null;
  position: number;
  type: Exercise['type'];
  prompt: string;
  payload: string;
  accepted_answers: string | null;
  explanation: string | null;
};

// ---------------------------------------------------------------------------
// Learning path
// ---------------------------------------------------------------------------

/** Modules and their lessons, with each lesson's progress status. Used by Home. */
export function getCoursePath(courseId: string): PathModule[] {
  const rows = getDb().getAllSync<PathRow>(
    `SELECT
       m.id AS module_id, m.position AS module_position,
       m.title AS module_title, m.description AS module_description,
       l.id, l.position, l.title, l.description, l.estimated_minutes,
       (SELECT COUNT(*) FROM content_items i WHERE i.lesson_id = l.id) AS item_count,
       (SELECT COUNT(*) FROM exercises e WHERE e.lesson_id = l.id) AS exercise_count,
       p.status, p.best_score
     FROM modules m
     JOIN lessons l ON l.module_id = m.id
     LEFT JOIN lesson_progress p ON p.lesson_id = l.id
     WHERE m.course_id = ?
     ORDER BY m.position, l.position`,
    [courseId],
  );

  const modules: PathModule[] = [];
  for (const row of rows) {
    let module = modules.find((m) => m.id === row.module_id);
    if (!module) {
      module = {
        id: row.module_id,
        position: row.module_position,
        title: row.module_title,
        description: row.module_description,
        lessons: [],
      };
      modules.push(module);
    }
    module.lessons.push({
      id: row.id,
      moduleId: row.module_id,
      position: row.position,
      title: row.title,
      description: row.description,
      estimatedMinutes: row.estimated_minutes,
      itemCount: row.item_count,
      exerciseCount: row.exercise_count,
      status: (row.status ?? 'not_started') as LessonStatus,
      bestScore: row.best_score,
    });
  }
  return modules;
}

/** The first lesson in path order that the learner has not completed yet. */
export function getNextLesson(courseId: string): LessonSummary | null {
  const lessons = getCoursePath(courseId).flatMap((module) => module.lessons);
  return lessons.find((lesson) => lesson.status !== 'completed') ?? null;
}

// ---------------------------------------------------------------------------
// A single lesson
// ---------------------------------------------------------------------------

export function getLesson(lessonId: string, locale: string = DEFAULT_LOCALE): Lesson | null {
  const db = getDb();

  const lesson = db.getFirstSync<LessonRow>(
    `SELECT id, module_id, position, title, description, estimated_minutes
     FROM lessons WHERE id = ?`,
    [lessonId],
  );
  if (!lesson) return null;

  const itemRows = db.getAllSync<ItemRow>(
    `SELECT i.id, i.lesson_id, i.position, i.kind, i.text, i.respelling, i.audio_file,
            i.notes, i.reviewed, t.text AS translation, t.example_translation
     FROM content_items i
     LEFT JOIN item_translations t ON t.item_id = i.id AND t.locale = ?
     WHERE i.lesson_id = ?
     ORDER BY i.position`,
    [locale, lessonId],
  );

  const exerciseRows = db.getAllSync<ExerciseRow>(
    `SELECT id, lesson_id, item_id, position, type, prompt, payload, accepted_answers, explanation
     FROM exercises WHERE lesson_id = ? ORDER BY position`,
    [lessonId],
  );

  const items: ContentItem[] = itemRows.map((row) => ({
    id: row.id,
    lessonId: row.lesson_id,
    position: row.position,
    kind: row.kind,
    text: row.text,
    respelling: row.respelling,
    audioFile: row.audio_file,
    notes: row.notes,
    reviewed: row.reviewed === 1,
    translation: row.translation ?? '',
    exampleTranslation: row.example_translation,
  }));

  const exercises = exerciseRows.map(
    (row) =>
      ({
        id: row.id,
        lessonId: row.lesson_id,
        itemId: row.item_id,
        position: row.position,
        type: row.type,
        prompt: row.prompt,
        payload: JSON.parse(row.payload),
        acceptedAnswers: row.accepted_answers ? JSON.parse(row.accepted_answers) : null,
        explanation: row.explanation,
      }) as Exercise,
  );

  return {
    id: lesson.id,
    moduleId: lesson.module_id,
    position: lesson.position,
    title: lesson.title,
    description: lesson.description,
    estimatedMinutes: lesson.estimated_minutes,
    items,
    exercises,
  };
}

// ---------------------------------------------------------------------------
// Lesson progress
// ---------------------------------------------------------------------------

/** Call when a learner opens a lesson. Never downgrades a completed lesson. */
export function startLesson(lessonId: string): void {
  const now = new Date().toISOString();
  getDb().runSync(
    `INSERT INTO lesson_progress (lesson_id, status, attempts, started_at, updated_at)
     VALUES (?, 'in_progress', 1, ?, ?)
     ON CONFLICT(lesson_id) DO UPDATE SET
       attempts = attempts + 1,
       updated_at = excluded.updated_at,
       status = CASE WHEN status = 'completed' THEN 'completed' ELSE 'in_progress' END`,
    [lessonId, now, now],
  );
}

/** Call when a learner finishes a lesson. `scorePercent` is 0 to 100. Keeps the best score. */
export function completeLesson(lessonId: string, scorePercent: number): void {
  const now = new Date().toISOString();
  getDb().runSync(
    `INSERT INTO lesson_progress
       (lesson_id, status, best_score, attempts, started_at, completed_at, updated_at)
     VALUES (?, 'completed', ?, 1, ?, ?, ?)
     ON CONFLICT(lesson_id) DO UPDATE SET
       status = 'completed',
       best_score = MAX(COALESCE(best_score, 0), excluded.best_score),
       completed_at = COALESCE(completed_at, excluded.completed_at),
       updated_at = excluded.updated_at`,
    [lessonId, Math.round(scorePercent), now, now, now],
  );
}