import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, type AccessibilityRole } from 'react-native';

import { useTheme } from '@/theme';

type Props = {
  label: string;
  description?: string;
  emoji?: string;
  selected?: boolean;
  /** Result of a checked answer. Always shown withan icon, never by color alone. */
  status?: 'correct' | 'incorrect';
  onPress: () => void;
  disabled?: boolean;
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
  status,
  onPress,
  disabled = false,
  badge,
  muted = false,
  accessibilityRole = 'radio',
  accessibilityHint,
}: Props) {
  const { colors, spacing, radius, sizing, typography } = useTheme();

  let background = selected ? colors.primaryContainer : colors.surface;
  let border = selected ? colors.primary : colors.outline;
  let textColor = selected ? colors.onPrimaryContainer : muted ? colors.textSecondary : colors.text;
  let secondaryColor = selected ? colors.onPrimaryContainer : colors.textSecondary;

  if (status === 'correct') {
    background = colors.successContainer;
    border = colors.success;
    textColor = secondaryColor = colors.onSuccessContainer;
  } else if (status === 'incorrect') {
    background = colors.errorContainer;
    border = colors.error;
    textColor = secondaryColor = colors.onErrorContainer;
  }

  const statusLabel = status === 'correct' ? '. Correct answer' : status === 'incorrect' ? '. Incorrect' : '';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={`${description ? `${label}. ${description}` : label}${statusLabel}`}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ selected, disabled }}
      style={({ pressed }) => [
        styles.card,
        {
          minHeight: sizing.touchTarget + spacing.lg,
          borderRadius: radius.lg,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          gap: spacing.md,
          backgroundColor: background,
          borderColor: border,
          transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
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
      ) : status === 'correct' ? (
        <Ionicons name="checkmark-circle" size={sizing.iconMd} color={colors.success} />
      ) : status === 'incorrect' ? (
        <Ionicons name="close-circle" size={sizing.iconMd} color={colors.error} />
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