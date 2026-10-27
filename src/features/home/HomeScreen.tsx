import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WarmBackground } from '@/components/ui/WarmBackground';
import { courseIdFor } from '@/features/lessons/course';
import { useCoursePath, type PathLesson } from '@/features/lessons/useCoursePath';
import { dailyXpGoalFor } from '@/features/progress/goals';
import { useProgressSummary } from '@/features/progress/useProgressSummary';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';

import { ContinueCard } from './components/ContinueCard';
import { DailyGoalCard } from './components/DailyGoalCard';
import { HeaderStrip } from './components/HeaderStrip';
import { LearningPath } from './components/LearningPath';

export function HomeScreen() {
  const { spacing, sizing } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const language = useProfileStore((s) => s.language);
  const level = useProfileStore((s) => s.level);
  const dailyMinutes = useProfileStore((s) => s.dailyMinutes);
  const pendingLessonId = useProfileStore((s) => s.pendingLessonId);
  const setPendingLesson = useProfileStore((s) => s.setPendingLesson);

  const path = useCoursePath(courseIdFor(language, level));
  const progress = useProgressSummary();

  // Right after onboarding, go straight into the first lesson.
  useEffect(() => {
    if (!pendingLessonId) return;
    setPendingLesson(null);
    router.push({ pathname: '/lesson/[id]', params: { id: pendingLessonId } });
  }, [pendingLessonId, setPendingLesson, router]);

  const openLesson = (lesson: PathLesson) =>
    router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } });

  return (
    <WarmBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: insets.top + spacing.md,
          paddingBottom: spacing.xxl,
          paddingHorizontal: spacing.xl,
        }}
      >
        <View style={{ width: '100%', maxWidth: sizing.maxContentWidth, gap: spacing.xl }}>
          <HeaderStrip streak={progress.streak.current} totalXp={progress.totalXp} />

          <DailyGoalCard xpToday={progress.xpToday} goal={dailyXpGoalFor(dailyMinutes)} />

          <ContinueCard
            lesson={path.current}
            module={path.currentModule}
            onStart={openLesson}
            onPracticeAgain={() => router.navigate('/practice')}
          />

          <LearningPath modules={path.modules} onOpenLesson={openLesson} />
        </View>
      </ScrollView>
    </WarmBackground>
  );
}