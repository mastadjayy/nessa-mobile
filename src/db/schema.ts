/**
 * Database migrations. Each entry is one version, applied in order and tracked
 * with PRAGMA user_version. Never edit a released migration: add a new one.
 *
 * Content tables (languages to exercises) are rebuilt from the seed JSON whenever
 * its contentVersion changes. User tables (lesson_progress) are never touched by
 * seeding, and refer to lessons by their stable string id.
 */
export const MIGRATIONS: string[] = [
  // Version 1
  `
  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY NOT NULL,
    value TEXT NOT NULL
  );

  CREATE TABLE languages (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    variant TEXT
  );

  CREATE TABLE courses (
    id TEXT PRIMARY KEY NOT NULL,
    language_id TEXT NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    level TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE modules (
    id TEXT PRIMARY KEY NOT NULL,
    course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT
  );

  CREATE TABLE lessons (
    id TEXT PRIMARY KEY NOT NULL,
    module_id TEXT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    estimated_minutes INTEGER NOT NULL DEFAULT 5
  );

  CREATE TABLE content_items (
    id TEXT PRIMARY KEY NOT NULL,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK (kind IN ('word', 'phrase')),
    text TEXT NOT NULL,
    respelling TEXT,
    audio_file TEXT,
    notes TEXT,
    reviewed INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE item_translations (
    item_id TEXT NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    text TEXT NOT NULL,
    example_translation TEXT,
    PRIMARY KEY (item_id, locale)
  );

  CREATE TABLE exercises (
    id TEXT PRIMARY KEY NOT NULL,
    lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    item_id TEXT,
    position INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'matching', 'listening')),
    prompt TEXT NOT NULL,
    payload TEXT NOT NULL,
    accepted_answers TEXT,
    explanation TEXT
  );

  CREATE TABLE lesson_progress (
    lesson_id TEXT PRIMARY KEY NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('in_progress', 'completed')),
    best_score INTEGER,
    attempts INTEGER NOT NULL DEFAULT 0,
    started_at TEXT,
    completed_at TEXT,
    updated_at TEXT NOT NULL
  );

  CREATE INDEX idx_modules_course ON modules(course_id, position);
  CREATE INDEX idx_lessons_module ON lessons(module_id, position);
  CREATE INDEX idx_items_lesson ON content_items(lesson_id, position);
  CREATE INDEX idx_exercises_lesson ON exercises(lesson_id, position);
  `,

  // Version 2: XP. The streak is derived from the days that have XP events.
  `
  CREATE TABLE xp_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL,
    ref_id TEXT,
    local_date TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX idx_xp_events_date ON xp_events(local_date);
  `,
];