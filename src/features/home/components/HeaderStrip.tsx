import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  streak: number;
  totalXp: number;
};

/** Greeting on the left, streak and total XP on the right. Always visible motivation. */
export function HeaderStrip({ streak, totalXp }: Props) {
  const { colors, spacing, radius, sizing, typography } = useTheme();

  const pill = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text accessibilityRole="header" style={[typography.headline, { color: colors.text }]}>
        Akwaaba 👋
      </Text>

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <View
          accessible
          accessibilityLabel={`${streak} day streak`}
          style={pill}
        >
          <Ionicons
            name="flame"
            size={sizing.iconMd - 2}
            color={streak > 0 ? colors.streak : colors.textDisabled}
          />
          <Text style={[typography.label, { color: colors.text }]}>{streak}</Text>
        </View>

        <View accessible accessibilityLabel={`${totalXp} XP in total`} style={pill}>
          <Ionicons name="flash" size={sizing.iconMd - 2} color={colors.tertiaryText} />
          <Text style={[typography.label, { color: colors.text }]}>{totalXp} XP</Text>
        </View>
      </View>
    </View>
  );
}