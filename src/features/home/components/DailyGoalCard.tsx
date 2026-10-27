import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { ProgressRing } from '@/components/ui/ProgressRing';
import { useTheme } from '@/theme';

type Props = {
  xpToday: number;
  goal: number;
};

// A finished lesson earns at most 24 XP, so a smaller gap means one lesson is enough.
const MAX_LESSON_XP = 24;

export function DailyGoalCard({ xpToday, goal }: Props) {
  const { colors, spacing, radius, sizing, typography, elevation } = useTheme();

  const reached = xpToday >= goal;
  const remaining = Math.max(0, goal - xpToday);

  const message = reached
    ? 'Goal reached! Great work today.'
    : xpToday === 0
      ? 'Finish a lesson to get started.'
      : remaining <= MAX_LESSON_XP
        ? 'One more lesson should do it.'
        : `${remaining} XP to go.`;

  return (
    <View
      style={[
        elevation.card,
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.lg,
          padding: spacing.lg,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.outline,
        },
      ]}
    >
      <ProgressRing
        progress={goal === 0 ? 0 : xpToday / goal}
        color={reached ? colors.success : colors.tertiary}
        label="Daily goal progress"
      >
        <Ionicons
          name={reached ? 'checkmark' : 'flash'}
          size={sizing.iconLg - 4}
          color={reached ? colors.success : colors.tertiaryText}
        />
      </ProgressRing>

      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>Daily goal</Text>
        <Text style={[typography.title, { color: colors.text }]}>
          {Math.min(xpToday, goal)} / {goal} XP
        </Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>{message}</Text>
      </View>
    </View>
  );
}