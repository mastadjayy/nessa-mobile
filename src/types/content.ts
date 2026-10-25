export type ContentKind = 'word' | 'phrase';

export type ContentItem = {
  id: string;
  lessonId: string;
  position: number;
  kind: ContentKind;
  /** The Twi (or other target language) text. */
  text: string;
  /** Simple pronunciation respelling, e.g. "ah-KWAH-bah". Not IPA. */
  respelling: string | null;
  /** File name of the native-speaker recording, or null if none yet. */
  audioFile: string | null;
  notes: string | null;
  /** True once a native speaker has reviewed this item. */
  reviewed: boolean;
  /** Translation in the requested locale (English by default). */
  translation: string;
  exampleTranslation: string | null;
};

type ExerciseBase = {
  id: string;
  lessonId: string;
  /** The content item this exercise tests, used to track mastery per word. */
  itemId: string | null;
  position: number;
  prompt: string;
  acceptedAnswers: string[] | null;
  explanation: string | null;
};

export type MultipleChoiceExercise = ExerciseBase & {
  type: 'multiple_choice';
  payload: { options: string[] };
};

export type MatchingExercise = ExerciseBase & {
  type: 'matching';
  payload: { pairs: { left: string; right: string }[] };
};

export type ListeningExercise = ExerciseBase & {
  type: 'listening';
  payload: { options: string[] };
};

export type Exercise = MultipleChoiceExercise | MatchingExercise | ListeningExercise;

export type Lesson = {
  id: string;
  moduleId: string;
  position: number;
  title: string;
  description: string | null;
  estimatedMinutes: number;
  items: ContentItem[];
  exercises: Exercise[];
};

export type LessonStatus = 'not_started' | 'in_progress' | 'completed';

/** A lesson as shown on the learning path, without its items and exercises. */
export type LessonSummary = {
  id: string;
  moduleId: string;
  position: number;
  title: string;
  description: string | null;
  estimatedMinutes: number;
  itemCount: number;
  exerciseCount: number;
  status: LessonStatus;
  bestScore: number | null;
};

export type PathModule = {
  id: string;
  position: number;
  title: string;
  description: string | null;
  lessons: LessonSummary[];
};