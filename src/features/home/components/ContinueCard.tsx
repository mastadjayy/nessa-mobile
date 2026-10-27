import { Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTheme } from '@/theme';

import type { PathLesson, PathModuleWithState } from '@/features/lessons/useCoursePath';

type Props = {
  lesson: PathLesson | null;
  module: PathModuleWithState | null;
  onStart: (lesson: PathLesson) => void;
  onPracticeAgain: () => void;
};

/** The most prominent card on Home: the next lesson, or a friendly "all caught up". */
export function ContinueCard({ lesson, module, onStart, onPracticeAgain }: Props) {
  const { colors, spacing, radius, typography, elevation } = useTheme();

  if (!lesson || !module) {
    return (
      <View
        style={{
          gap: spacing.lg,
          padding: spacing.xl,
          borderRadius: radius.xl,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.outline,
        }}
      >
        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.headline, { color: colors.text }]}>You are all caught up 🎉</Text>
          <Text style={[typography.body, { color: colors.textSecondary }]}>
            You finished every lesson that is available. More are coming soon.
          </Text>
        </View>
        <Button label="Practice again" variant="secondary" onPress={onPracticeAgain} />
      </View>
    );
  }

  const done = module.lessons.filter((item) => item.state === 'completed').length;
  const total = module.lessons.length;
  const started = lesson.status === 'in_progress';

  return (
    <View
      style={[
        elevation.card,
        {
          gap: spacing.lg,
          padding: spacing.xl,
          borderRadius: radius.xl,
          backgroundColor: colors.primary,
        },
      ]}
    >
      <View style={{ gap: spacing.xs }}>
        <Text style={[typography.label, { color: colors.textOnPrimary }]}>{module.title}</Text>
        <Text accessibilityRole="header" style={[typography.display, { color: colors.textOnPrimary }]}>
          {lesson.title}
        </Text>
        <Text style={[typography.body, { color: colors.textOnPrimary }]}>
          About {lesson.estimatedMinutes} min · {lesson.itemCount} new words and phrases
        </Text>
      </View>

      <View style={{ gap: spacing.xs }}>
        <ProgressBar
          progress={total === 0 ? 0 : done / total}
          color={colors.textOnPrimary}
          trackColor="rgba(43, 23, 0, 0.18)"
          label="Module progress"
        />
        <Text style={[typography.caption, { color: colors.textOnPrimary }]}>
          {done} of {total} {total === 1 ? 'lesson' : 'lessons'} complete
        </Text>
      </View>

      <Button
        label={started ? 'Continue' : 'Start lesson'}
        variant="inverted"
        onPress={() => onStart(lesson)}
      />
    </View>
  );
}