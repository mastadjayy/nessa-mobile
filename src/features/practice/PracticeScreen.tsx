import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { WarmBackground } from '@/components/ui/WarmBackground';
import { LessonRow } from '@/features/lessons/components/LessonRow';
import { courseIdFor } from '@/features/lessons/course';
import { useCoursePath, type PathLesson } from '@/features/lessons/useCoursePath';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';

/**
 * For now, Practice lets learners replay lessons they have completed.
 * Smart review of difficult words (spaced repetition) will come later.
 */
export function PracticeScreen() {
  const { colors, spacing, radius, sizing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const language = useProfileStore((s) => s.language);
  const level = useProfileStore((s) => s.level);
  const path = useCoursePath(courseIdFor(language, level));

  const completed = path.lessons.filter((lesson) => lesson.state === 'completed');

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
          <View style={{ gap: spacing.xs }}>
            <Text accessibilityRole="header" style={[typography.headline, { color: colors.text }]}>
              Practice
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              Replay a lesson you have finished to keep the words fresh.
            </Text>
          </View>

          {completed.length > 0 ? (
            <View style={{ gap: spacing.sm }}>
              {completed.map((lesson) => (
                <LessonRow key={lesson.id} lesson={lesson} onPress={openLesson} />
              ))}
            </View>
          ) : (
            <View
              style={{
                alignItems: 'center',
                gap: spacing.sm,
                padding: spacing.xl,
                borderRadius: radius.lg,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.outline,
              }}
            >
              <Ionicons name="albums-outline" size={sizing.iconLg} color={colors.textSecondary} />
              <Text style={[typography.title, { color: colors.text, textAlign: 'center' }]}>
                Nothing to practice yet
              </Text>
              <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
                Finish your first lesson and it will show up here.
              </Text>
            </View>
          )}

          <View
            style={{
              padding: spacing.lg,
              borderRadius: radius.lg,
              backgroundColor: colors.hintContainer,
            }}
          >
            <Text style={[typography.caption, { color: colors.onHintContainer }]}>
              Coming soon: Nessa will remind you of the words you find hardest, so they stick.
            </Text>
          </View>
        </View>
      </ScrollView>
    </WarmBackground>
  );
}