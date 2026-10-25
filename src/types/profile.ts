/** Languages shown in the picket.
 * Only the ones in AvailableLanguageId can be learned today
*/
export type LanguageId = "twi" | "kroumen" | "ga" | "fante" | "ewe" | "dagbani";
export type AvailableLanguageId = "twi";

/** "few_words" also starts on the Beginner course in the MVP. */
export type LevelId = "beginner" | "few_words";

export type ReasonId = "conversation" | "heritage" | "travel" | "living" | "curious";

export type DailyMinutes = 5 | 10 | 15;