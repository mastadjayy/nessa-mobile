import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgressBar } from '@/components/ui/ProgressBar';
import { WarmBackground } from '@/components/ui/WarmBackground';
import { awardXp, countCompletedLessons } from '@/db/progress';
import { completeLesson, startLesson } from '@/db/queries';
import { calculateXp, scorePercent } from '@/features/progress/xp';
import { track } from '@/services/analytics';
import { useTheme } from '@/theme';
import type { Lesson } from '@/types/content';

import { ExerciseView } from './components/ExerciseView';
import { LearnCard } from './components/LearnCard';
import { LessonComplete, type LessonResult } from './components/LessonComplete';

type Phase = 'learn' | 'practice' | 'complete';

/**
 * Plays one lesson: learn the new words, practice them, then see the result.
 * Progress and XP are saved only when the lesson is finished.
 */
export function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { colors, spacing, sizing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Listening exercises need recordings, which do not exist yet.
  const exercises = useMemo(
    () => lesson.exercises.filter((exercise) => exercise.type !== 'listening'),
    [lesson],
  );

  const [phase, setPhase] = useState<Phase>(lesson.items.length > 0 ? 'learn' : 'practice');
  const [cardIndex, setCardIndex] = useState(0);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [results, setResults] = useState<boolean[]>([]);
  const [summary, setSummary] = useState<LessonResult | null>(null);

  const started = useRef(false);
  const finished = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    startLesson(lesson.id);
    track('lesson_started', { lesson_id: lesson.id });
  }, [lesson.id]);

  const exit = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  }, [router]);

  const confirmExit = useCallback(() => {
    if (phase === 'complete') {
      exit();
      return;
    }
    Alert.alert('Leave this lesson?', 'Your progress in this lesson will be lost.', [
      { text: 'Keep learning', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: exit },
    ]);
  }, [phase, exit]);

  // Android hardware back button asks before leaving too.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmExit();
      return true;
    });
    return () => subscription.remove();
  }, [confirmExit]);

  const handleExerciseDone = (correct: boolean) => {
    const allResults = [...results, correct];

    if (exerciseIndex + 1 < exercises.length) {
      setResults(allResults);
      setExerciseIndex((index) => index + 1);
      return;
    }

    if (finished.current) return;
    finished.current = true;

    const correctCount = allResults.filter(Boolean).length;
    const score = scorePercent(correctCount, exercises.length);
    const xp = calculateXp(correctCount);
    const isFirstLesson = countCompletedLessons() === 0;

    completeLesson(lesson.id, score);
    awardXp(xp, 'lesson', lesson.id);
    track('lesson_completed', {
      lesson_id: lesson.id,
      score,
      xp,
      is_first_lesson: isFirstLesson,
    });

    setResults(allResults);
    setSummary({
      score,
      xp,
      correct: correctCount,
      total: exercises.length,
      words: lesson.items.length,
    });
    setPhase('complete');
  };

  const startPractice = () => {
    if (exercises.length === 0) {
      handleExerciseDone(true);
    } else {
      setPhase('practice');
    }
  };

  const totalSteps = lesson.items.length + exercises.length;
  const doneSteps =
    phase === 'learn'
      ? cardIndex
      : phase === 'practice'
        ? lesson.items.length + exerciseIndex
        : totalSteps;
  const progress = totalSteps === 0 ? 1 : doneSteps / totalSteps;

  const item = lesson.items[cardIndex];
  const exercise = exercises[exerciseIndex];

  return (
    <WarmBackground>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: insets.top + spacing.sm,
        }}
      >
        <View style={{ flex: 1, width: '100%', maxWidth: sizing.maxContentWidth }}>
          {phase !== 'complete' ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: spacing.md,
                gap: spacing.sm,
              }}
            >
              <Pressable
                onPress={confirmExit}
                accessibilityRole="button"
                accessibilityLabel="Close lesson"
                style={{
                  width: sizing.touchTarget,
                  height: sizing.touchTarget,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="close" size={sizing.iconLg} color={colors.textSecondary} />
              </Pressable>
              <ProgressBar progress={progress} label="Lesson progress" style={{ flex: 1 }} />
              <View style={{ width: sizing.touchTarget }} />
            </View>
          ) : null}

          {phase === 'learn' && item ? (
            <LearnCard
              key={item.id}
              item={item}
              index={cardIndex}
              total={lesson.items.length}
              isLast={cardIndex === lesson.items.length - 1}
              onNext={() =>
                cardIndex === lesson.items.length - 1
                  ? startPractice()
                  : setCardIndex((index) => index + 1)
              }
            />
          ) : null}

          {phase === 'practice' && exercise ? (
            <ExerciseView key={exercise.id} exercise={exercise} onComplete={handleExerciseDone} />
          ) : null}

          {phase === 'complete' && summary ? (
            <LessonComplete lessonTitle={lesson.title} summary={summary} onContinue={exit} />
          ) : null}
        </View>
      </View>
    </WarmBackground>
  );
}