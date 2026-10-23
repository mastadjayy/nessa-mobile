import type { LanguageId, LevelId, ReasonId } from "@/types/profile";

/** Language, level, reason, time, then the "ready" screen. */
export const STEP_COUNT = 5;

export type Option<T extends string = string> = {
    id: T;
    label: string;
    description?: string;
    emoji?: string;
    comingSoon?: boolean;
};

export const LANGUAGE_OPTIONS: Option<LanguageId>[] = [
    { id:"kroumen", label: "Kroumen", description: "Kroumen - Bas Sassandra" },
    { id:"twi", label: "Twi", description: "Asante dialect" },
    { id:"ga", label: "Ga", comingSoon: true },
    { id:"fante", label: "Fante", comingSoon: true },
    { id:"ewe", label: "Ewe", comingSoon: true },
    { id:"dagbani", label: "Dagbani", comingSoon: true },
];

export const LANGUAGE_NAMES: Record<LanguageId, string> = {
    twi: "Twi",
    kroumen: "Kroumen",
    ga: "Ga",
    fante: "Fante",
    ewe: "Ewe",
    dagbani: "Dagbani",
};

// Both options start on the Beginner course in the MVP.
export const LEVEL_OPTIONS: Option<LevelId>[] = [
    { id: 'beginner', emoji: '🌱', label: "I'm new to this", description: "I don't know any words yet" },
    { id: 'few_words', emoji: '👋', label: 'I know a few words', description: 'Greetings and common phrases' },
];
 
export const LEVEL_LABELS: Record<LevelId, string> = {
    beginner: 'Beginner',
    few_words: 'Beginner',
};
 
export const REASON_OPTIONS: Option<ReasonId>[] = [
    { id: 'conversation', emoji: '💬', label: 'Talk with people' },
    { id: 'heritage', emoji: '🌍', label: 'Reconnect with my roots' },
    { id: 'travel', emoji: '✈️', label: 'Travel to CIV' },
    { id: 'living', emoji: '🏠', label: 'Live or work in CIV' },
    { id: 'curious', emoji: '✨', label: "I'm just curious" },
];

// Ids are strings ('5', '10', '15') and converted to numbers where they are saved.
export const TIME_OPTIONS: Option<'5' | '10' | '15'>[] = [
    { id: '5', emoji: '☕', label: '5 min / day', description: 'Casual · about 1 lesson' },
    { id: '10', emoji: '📖', label: '10 min / day', description: 'Regular · about 2 lessons' },
    { id: '15', emoji: '🔥', label: '15 min / day', description: 'Serious · about 3 lessons' },
];
 
export const READY_MESSAGES: Record<ReasonId, string> = {
    conversation: "Let's get you talking.",
    heritage: "Let's start your journey back to your roots.",
    travel: "Let's get you ready for CIV.",
    living: "Let's make everyday life in CIV easier.",
    curious: "Let's see where your curiosity takes you.",
};
 
// TODO: replace with the real first lesson once the content database exists.
export const FIRST_LESSON_PREVIEW = {
    title: 'Greetings',
    duration: 'About 5 minutes',
};