/** XP and score rules for a finished lesson. */
export const COMPLETION_XP = 10;
export const XP_PER_CORRECT_ANSWER = 2;

export function calculateXp(correctAnswers: number): number {
    return COMPLETION_XP + correctAnswers * XP_PER_CORRECT_ANSWER;
}

export function scorePercent(correctAnswers: number, totalExercises: number): number {
    if (totalExercises === 0) return 100;
    return Math.round((correctAnswers / totalExercises) * 100);
}