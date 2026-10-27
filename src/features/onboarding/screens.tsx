import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { getNextLesson } from '@/db/queries';
import { courseIdFor } from '@/features/lessons/course';
import { track } from '@/services/analytics';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';
import type { DailyMinutes } from '@/types/profile';

import { ChoiceStep } from './components/ChoiceStep';
import { OnboardingScaffold } from './components/OnboardingScaffold';
import {
    LANGUAGE_NAMES,
    LANGUAGE_OPTIONS,
    LEVEL_LABELS,
    LEVEL_OPTIONS,
    READY_MESSAGES,
    REASON_OPTIONS,
    STEP_COUNT,
    TIME_OPTIONS,
} from './options';

const progressFor = (step: number) => step / STEP_COUNT;

export function LanguageScreen() {
  const router = useRouter();
  const language = useProfileStore((s) => s.language);
  const interested = useProfileStore((s) => s.interestedLanguages);
  const setLanguage = useProfileStore((s) => s.setLanguage);
  const toggleInterest = useProfileStore((s) => s.toggleInterest);

  return (
    <ChoiceStep
      progress={progressFor(1)}
      title="What language do you want to learn?"
      subtitle="More Ghanaian languages are on the way."
      options={LANGUAGE_OPTIONS}
      value={language}
      onSelect={(id) => {
        if (id === 'twi') setLanguage(id);
      }}
      interestedIds={interested}
      onInterest={(id) => {
        if (!interested.includes(id)) track('language_interest', { language: id });
        toggleInterest(id);
      }}
      onContinue={() => router.push('/level')}
    />
  );
}

export function LevelScreen() {
  const router = useRouter();
  const language = useProfileStore((s) => s.language);
  const level = useProfileStore((s) => s.level);
  const setLevel = useProfileStore((s) => s.setLevel);

  return (
    <ChoiceStep
      progress={progressFor(2)}
      title={`How much ${LANGUAGE_NAMES[language]} do you know?`}
      options={LEVEL_OPTIONS}
      value={level}
      onSelect={setLevel}
      onContinue={() => router.push('/reason')}
    />
  );
}

export function ReasonScreen() {
  const router = useRouter();
  const language = useProfileStore((s) => s.language);
  const reason = useProfileStore((s) => s.reason);
  const setReason = useProfileStore((s) => s.setReason);

  return (
    <ChoiceStep
      progress={progressFor(3)}
      title={`Why are you learning ${LANGUAGE_NAMES[language]}?`}
      subtitle="This helps us choose what to teach you first."
      options={REASON_OPTIONS}
      value={reason}
      onSelect={setReason}
      onContinue={() => router.push('/time')}
    />
  );
}

export function TimeScreen() {
  const router = useRouter();
  const dailyMinutes = useProfileStore((s) => s.dailyMinutes);
  const setDailyMinutes = useProfileStore((s) => s.setDailyMinutes);

  return (
    <ChoiceStep
      progress={progressFor(4)}
      title="How much time can you spend each day?"
      subtitle="You can change this anytime."
      options={TIME_OPTIONS}
      value={dailyMinutes ? (String(dailyMinutes) as '5' | '10' | '15') : null}
      onSelect={(id) => setDailyMinutes(Number(id) as DailyMinutes)}
      onContinue={() => router.push('/ready')}
    />
  );
}

export function ReadyScreen() {
  const { colors, spacing, radius, typography, elevation } = useTheme();
  const language = useProfileStore((s) => s.language);
  const level = useProfileStore((s) => s.level);
  const reason = useProfileStore((s) => s.reason);
  const dailyMinutes = useProfileStore((s) => s.dailyMinutes);
  const completeOnboarding = useProfileStore((s) => s.completeOnboarding);
  const setPendingLesson = useProfileStore((s) => s.setPendingLesson);

  const lesson = useMemo(() => getNextLesson(courseIdFor(language, level)), [language, level]);

  const chips = [
    LANGUAGE_NAMES[language],
    level ? LEVEL_LABELS[level] : 'Beginner',
    `${dailyMinutes ?? 5} min / day`,
  ];

  const handleStart = () => {
    track('onboarding_completed', {
      language,
      level,
      reason,
      daily_minutes: dailyMinutes,
    });
    // Home opens this lesson as soon as it appears. Navigating from here would run while
    // the route guard is swapping screens, which is fragile.
    setPendingLesson(lesson?.id ?? null);
    // Flips the route guard in the root layout, which moves the learner out of onboarding.
    completeOnboarding();
  };

  return (
    <OnboardingScaffold
      progress={progressFor(5)}
      title="Your first lesson is ready"
      subtitle={reason ? READY_MESSAGES[reason] : undefined}
      ctaLabel="Start lesson"
      onContinue={handleStart}
    >
      {lesson ? (
        <View
          style={[
            elevation.card,
            {
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              padding: spacing.lg,
              borderRadius: radius.lg,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outline,
            },
          ]}
        >
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primaryContainer,
            }}
          >
            <Text style={{ fontSize: 28 }}>👋</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              Lesson {lesson.position}
            </Text>
            <Text style={[typography.title, { color: colors.text }]}>{lesson.title}</Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              About {lesson.estimatedMinutes} minutes · {lesson.itemCount} new words and phrases
            </Text>
          </View>
        </View>
      ) : null}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {chips.map((chip) => (
          <View
            key={chip}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.pill,
              backgroundColor: colors.surfaceVariant,
            }}
          >
            <Text style={[typography.label, { color: colors.text }]}>{chip}</Text>
          </View>
        ))}
      </View>
    </OnboardingScaffold>
  );
}