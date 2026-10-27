import { Text, View } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  value: string;
  label: string;
  color?: string;
};

/** A big number with a small label underneath. */
export function StatCard({ value, label, color }: Props) {
  const { colors, spacing, radius, typography } = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={`${value} ${label}`}
      style={{
        flex: 1,
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.sm,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.outline,
      }}
    >
      <Text style={[typography.headline, { color: color ?? colors.text }]}>{value}</Text>
      <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
        {label}
      </Text>
    </View>
  );
}