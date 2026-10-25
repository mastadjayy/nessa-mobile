import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { WarmBackground } from '@/components/ui/WarmBackground';
import { getTotalXp, getXpToday, resetUserData } from '@/db/progress';
import { getCoursePath } from '@/db/queries';
import { courseIdFor } from '@/features/lessons/course';
import { dailyXpGoalFor } from '@/features/progress/goals';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';

/**
 * TEMPORARY placeholder shown after onboarding.
 * It will be replaced by the Home, Practice and Profile tabs.
 */
export default function HomePlaceholder() {
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { language, level, reason, dailyMinutes, resetProfile } = useProfileStore();

  // Re-read the database every time screen comes back into focus.
  const [refreshKey, setRefreshKey] = useState(0);
  useFocusEffect(useCallback(() =>setRefreshKey((key) => key + 1), []));

  const data = useMemo(() => {
    const lessons = getCoursePath(courseIdFor(language, level)).flatMap((module) => module.lessons);
    return {
        lessons,
        next: lessons.find((lesson) => lesson.status !== 'completed') ?? null,
        totalXp: getTotalXp(),
        xpToday: getXpToday(),
    };
    // eslint-disabled-next-line react-hooks/exhaustive-deps
  }, [language, level, refreshKey]);

  const openLesson = (id: string) => router.push({ pathname: '/lesson/[id]', params: { id } });
  const replayTarget = data.lessons[0] ?? null;

  return (
    <WarmBackground>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: spacing.xl,
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
          gap: spacing.lg,
        }}
      >
        <Text style={[typography.headline, { color: colors.text }]}>Home is coming next</Text>
 
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          XP today: {data.xpToday} / {dailyXpGoalFor(dailyMinutes)} · Total XP: {data.totalXp}
        </Text>
 
        {data.next ? (
          <Button
            label={`${data.next.status === 'in_progress' ? 'Continue' : 'Start'}: ${data.next.title}`}
            onPress={() => openLesson(data.next!.id)}
          />
        ) : (
          <Text style={[typography.body, { color: colors.text }]}>
            You finished every available lesson. More are coming soon.
          </Text>
        )}
 
        {__DEV__ ? (
          <View style={{ gap: spacing.md }}>
            {replayTarget ? (
              <Button
                label={`Replay: ${replayTarget.title} (dev only)`}
                variant="secondary"
                onPress={() => openLesson(replayTarget.id)}
              />
            ) : null}
            <Button
              label="Reset everything (dev only)"
              variant="secondary"
              onPress={() => {
                resetUserData();
                resetProfile();
              }}
            />
          </View>
        ) : null}
      </View>
    </WarmBackground>
  );
}