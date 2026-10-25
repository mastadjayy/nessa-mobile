import type { AvailableLanguageId, LevelId } from '@/types/profile';

/**
 * Maps the learner's onboarding answers to a course id.
 * Both "beginner" and "few_words" start on the Beginner course in the MVP.
 */
export function courseIdFor(language: AvailableLanguageId, _level: LevelId | null): string {
  return `${language}-beginner`;
}