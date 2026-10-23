import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type AccessibilityRole } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  label: string;
  description?: string;
  emoji?: string;
  selected?: boolean;
  onPress: () => void;
  /** Small pill on the right, e.g. "Coming soon". Text plus icon, never color alone. */
  badge?: { text: string; done?: boolean };
  /** De-emphasizes cards that cannot be chosen yet. */
  muted?: boolean;
  accessibilityRole?: AccessibilityRole;
  accessibilityHint?: string;
};

export function OptionCard({
  label,
  description,
  emoji,
  selected = false,
  onPress,
  badge,
  muted = false,
  accessibilityRole = 'radio',
  accessibilityHint,
}: Props) {
  const { colors, spacing, radius, sizing, typography } = useTheme();

  const textColor = selected ? colors.onPrimaryContainer : muted ? colors.textSecondary : colors.text;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={description ? `${label}. ${description}` : label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.card,
        {
          minHeight: sizing.touchTarget + spacing.lg,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          gap: spacing.md,
          backgroundColor: selected ? colors.primaryContainer : colors.surface,
          borderColor: selected ? colors.primary : colors.outline,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : null}

      <View style={styles.texts}>
        <Text style={[typography.bodyStrong, { color: textColor }]}>{label}</Text>
        {description ? (
          <Text
            style={[
              typography.caption,
              { color: selected ? colors.onPrimaryContainer : colors.textSecondary },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {badge ? (
        <View
          style={[
            styles.badge,
            {
              borderRadius: radius.pill,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              gap: spacing.xs,
              backgroundColor: badge.done ? colors.successContainer : colors.surfaceVariant,
            },
          ]}
        >
          {badge.done ? (
            <Ionicons name="checkmark" size={sizing.iconSm - 4} color={colors.onSuccessContainer} />
          ) : null}
          <Text
            style={[
              typography.label,
              { color: badge.done ? colors.onSuccessContainer : colors.textSecondary },
            ]}
          >
            {badge.text}
          </Text>
        </View>
      ) : selected ? (
        <Ionicons name="checkmark-circle" size={sizing.iconMd} color={colors.primaryDeep} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
  },
  emoji: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  texts: {
    flex: 1,
    gap: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});