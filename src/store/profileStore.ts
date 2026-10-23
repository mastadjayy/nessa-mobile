/** Saved choices:
 * they live here,
 * stored locally in SQLite,
 * and are read synchronously at startup */
import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";

import type {
    AvailableLanguageId,
    DailyMinutes,
    LanguageId,
    LevelId,
    ReasonId,
} from "@/types/profile";

/**
 * Synchronous storage adapter on top of expo-sqlite's key-value store.
 * Because reads are synchronous, the store is hydrated before the first render,
 * so the app never flashes the wrong screen on launch.
*/
const kvStorage: StateStorage = {
    getItem: (name) => Storage.getItemSync(name),
    setItem: (name, value) => Storage.setItemSync(name, value),
    removeItem: (name) => Storage.removeItemSync(name),
};

type ProfileData = {
    language: AvailableLanguageId;
    level: LevelId | null;
    reason: ReasonId | null;
    dailyMinutes: DailyMinutes | null;
    /** Languages the learner tapped "Coming soon" on. */
    interestedLanguages: LanguageId[];
    onboardingCompleted: boolean;
    onboardingCompletedAt: string | null;
};
 
type ProfileActions = {
    setLanguage: (language: AvailableLanguageId) => void;
    setLevel: (level: LevelId) => void;
    setReason: (reason: ReasonId) => void;
    setDailyMinutes: (minutes: DailyMinutes) => void;
    toggleInterest: (language: LanguageId) => void;
    completeOnboarding: () => void;
    resetProfile: () => void;
};
 
const initialData: ProfileData = {
    language: 'twi',
    level: null,
    reason: null,
    dailyMinutes: null,
    interestedLanguages: [],
    onboardingCompleted: false,
    onboardingCompletedAt: null,
};

export const useProfileStore = create<ProfileData & ProfileActions>()(
    persist(
        (set) => ({
            ...initialData,
            setLanguage: (language) => set({ language }),
            setLevel: (level) => set({ level }),
            setReason: (reason) => set({ reason }),
            setDailyMinutes: (dailyMinutes) => set({ dailyMinutes }),
            toggleInterest: (language) =>
            set((state) => ({
                interestedLanguages: state.interestedLanguages.includes(language)
                ? state.interestedLanguages.filter((id) => id !== language)
                : [...state.interestedLanguages, language],
            })),
            completeOnboarding: () =>
            set({ onboardingCompleted: true, onboardingCompletedAt: new Date().toISOString() }),
            resetProfile: () => set(initialData),
        }),
        {
            name: 'nessa.profile',
            version: 1,
            storage: createJSONStorage(() => kvStorage),
        },
    ),
);