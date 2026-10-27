import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme';

import type { PathLesson } from '../useCoursePath';

type Props = {
  lesson: PathLesson;
  onPress: (lesson: PathLesson) => void;
};

/** One lesson on the learning path: completed, current (next to take), or locked. */
export function LessonRow({ lesson, onPress }: Props) {
  const { colors, spacing, radius, sizing, typography } = useTheme();

  const locked = lesson.state === 'locked';
  const current = lesson.state === 'current';
  const completed = lesson.state === 'completed';

  const badge = completed
    ? { background: colors.success, icon: 'checkmark' as const, color: colors.onSuccess }
    : current
      ? { background: colors.primary, icon: 'play' as const, color: colors.textOnPrimary }
      : { background: colors.surfaceVariant, icon: 'lock-closed' as const, color: colors.textSecondary };

  const details = [
    `${lesson.estimatedMinutes} min`,
    `${lesson.itemCount} words`,
    completed && lesson.bestScore !== null ? `Best ${lesson.bestScore}%` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  const stateLabel = completed
    ? 'Completed'
    : current
      ? 'Next lesson'
      : 'Locked. Finish the previous lesson first';

  return (
    <Pressable
      onPress={() => onPress(lesson)}
      disabled={locked}
      accessibilityRole="button"
      accessibilityLabel={`${lesson.title}. ${stateLabel}. ${details}`}
      accessibilityState={{ disabled: locked }}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: sizing.touchTarget + spacing.lg,
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 2,
        borderColor: current ? colors.primary : colors.outline,
        backgroundColor: colors.surface,
        opacity: locked ? 0.7 : 1,
        transform: [{ scale: pressed && !locked ? 0.98 : 1 }],
      })}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: badge.background,
        }}
      >
        <Ionicons name={badge.icon} size={sizing.iconSm} color={badge.color} />
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[typography.bodyStrong, { color: locked ? colors.textSecondary : colors.text }]}>
          {lesson.title}
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>{details}</Text>
      </View>

      {!locked ? (
        <Ionicons name="chevron-forward" size={sizing.iconMd} color={colors.textSecondary} />
      ) : null}
    </Pressable>
  );
}