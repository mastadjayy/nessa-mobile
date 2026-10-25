import type { SQLiteDatabase } from 'expo-sqlite';

import twiSeed from '../../assets/content/twi/course.json';

type ItemSeed = {
  id: string;
  kind: 'word' | 'phrase';
  text: string;
  respelling: string | null;
  audioFile: string | null;
  notes: string | null;
  reviewed: boolean;
  translations: Record<string, { text: string; exampleTranslation?: string | null }>;
};

type ExerciseSeed = {
  id: string;
  itemId: string | null;
  type: 'multiple_choice' | 'matching' | 'listening';
  prompt: string;
  payload: unknown;
  acceptedAnswers: string[] | null;
  explanation: string | null;
};

type LessonSeed = {
  id: string;
  title: string;
  description: string | null;
  estimatedMinutes: number;
  items: ItemSeed[];
  exercises: ExerciseSeed[];
};

type CourseSeed = {
  contentVersion: number;
  language: { id: string; name: string; variant: string | null };
  course: { id: string; level: string; title: string; description: string | null };
  modules: { id: string; title: string; description: string | null; lessons: LessonSeed[] }[];
};

/** Add new language seed files here. */
const SEEDS: CourseSeed[] = [twiSeed as unknown as CourseSeed];

/** Twi uses ɛ, ɔ and ŋ. Normalizing to NFC keeps text comparisons reliable. */
const nfc = (value: string) => value.normalize('NFC');
const nfcOrNull = (value: string | null | undefined) => (value == null ? null : nfc(value));

/**
 * Loads each seed file into the content tables when its contentVersion has changed.
 * Bump "contentVersion" in the JSON after editing content. User progress is untouched.
 */
export function seedContent(db: SQLiteDatabase): void {
  for (const seed of SEEDS) {
    const versionKey = `content_version:${seed.language.id}`;
    const current = db.getFirstSync<{ value: string }>('SELECT value FROM meta WHERE key = ?', [
      versionKey,
    ])?.value;

    if (current === String(seed.contentVersion)) continue;

    db.withTransactionSync(() => {
      // Cascades to modules, lessons, items, translations and exercises.
      db.runSync('DELETE FROM courses WHERE language_id = ?', [seed.language.id]);

      db.runSync(
        `INSERT INTO languages (id, name, variant) VALUES (?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET name = excluded.name, variant = excluded.variant`,
        [seed.language.id, seed.language.name, seed.language.variant],
      );

      db.runSync(
        'INSERT INTO courses (id, language_id, level, title, description) VALUES (?, ?, ?, ?, ?)',
        [seed.course.id, seed.language.id, seed.course.level, seed.course.title, seed.course.description],
      );

      seed.modules.forEach((module, moduleIndex) => {
        db.runSync(
          'INSERT INTO modules (id, course_id, position, title, description) VALUES (?, ?, ?, ?, ?)',
          [module.id, seed.course.id, moduleIndex + 1, module.title, module.description],
        );

        module.lessons.forEach((lesson, lessonIndex) => {
          db.runSync(
            `INSERT INTO lessons (id, module_id, position, title, description, estimated_minutes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [lesson.id, module.id, lessonIndex + 1, lesson.title, lesson.description, lesson.estimatedMinutes],
          );

          lesson.items.forEach((item, itemIndex) => {
            db.runSync(
              `INSERT INTO content_items
                 (id, lesson_id, position, kind, text, respelling, audio_file, notes, reviewed)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                item.id,
                lesson.id,
                itemIndex + 1,
                item.kind,
                nfc(item.text),
                item.respelling,
                item.audioFile,
                nfcOrNull(item.notes),
                item.reviewed ? 1 : 0,
              ],
            );

            for (const [locale, translation] of Object.entries(item.translations)) {
              db.runSync(
                'INSERT INTO item_translations (item_id, locale, text, example_translation) VALUES (?, ?, ?, ?)',
                [item.id, locale, translation.text, translation.exampleTranslation ?? null],
              );
            }
          });

          lesson.exercises.forEach((exercise, exerciseIndex) => {
            db.runSync(
              `INSERT INTO exercises
                 (id, lesson_id, item_id, position, type, prompt, payload, accepted_answers, explanation)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                exercise.id,
                lesson.id,
                exercise.itemId,
                exerciseIndex + 1,
                exercise.type,
                nfc(exercise.prompt),
                nfc(JSON.stringify(exercise.payload)),
                exercise.acceptedAnswers ? nfc(JSON.stringify(exercise.acceptedAnswers)) : null,
                nfcOrNull(exercise.explanation),
              ],
            );
          });
        });
      });

      db.runSync(
        `INSERT INTO meta (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [versionKey, String(seed.contentVersion)],
      );
    });
  }
}