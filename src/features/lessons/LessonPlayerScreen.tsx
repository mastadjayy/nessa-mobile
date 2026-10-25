import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { WarmBackground } from '@/components/ui/WarmBackground';
import { getLesson } from '@/db/queries';
import { useTheme } from '@/theme';

import { LessonPlayer } from './LessonPlayer';

/** Loads a lesson from the database and plays it. Shows a friendly message if it is missing. */
export function LessonPlayerScreen({ lessonId }: { lessonId: string }) {
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const lesson = useMemo(() => getLesson(lessonId), [lessonId]);

  if (!lesson) {
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
          <Text style={[typography.headline, { color: colors.text }]}>Lesson not found</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            This lesson is not available. Go back and try another one.
          </Text>
          <Button
            label="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
          />
        </View>
      </WarmBackground>
    );
  }

  return <LessonPlayer lesson={lesson} />;
}