import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';

type Props = {
  /** neutral = plain footer; success and error = feedback panel after checking. */
  tone?: 'neutral' | 'success' | 'error';
  children: ReactNode;
};

/** Bottom area of the lesson player. Becomes a colored feedback panel after an answer. */
export function PlayerFooter({ tone = 'neutral', children }: Props) {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();

  const background =
    tone === 'success' ? colors.successContainer : tone === 'error' ? colors.errorContainer : 'transparent';

  return (
    <View
      style={{
        backgroundColor: background,
        borderTopLeftRadius: tone === 'neutral' ? 0 : radius.xl,
        borderTopRightRadius: tone === 'neutral' ? 0 : radius.xl,
        paddingHorizontal: spacing.xl,
        paddingTop: tone === 'neutral' ? spacing.sm : spacing.lg,
        paddingBottom: insets.bottom + spacing.lg,
        gap: spacing.lg,
      }}
    >
      {children}
    </View>
  );
}

type FeedbackProps = {
  correct: boolean;
  title: string;
  message?: string | null;
};

/** Icon, title and message inside the feedback panel. Meaning never depends on color alone. */
export function FeedbackMessage({ correct, title, message }: FeedbackProps) {
  const { colors, spacing, typography, sizing } = useTheme();
  const textColor = correct ? colors.onSuccessContainer : colors.onErrorContainer;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}
    >
      <Ionicons
        name={correct ? 'checkmark-circle' : 'close-circle'}
        size={sizing.iconLg}
        color={correct ? colors.success : colors.error}
      />
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text style={[typography.title, { color: textColor }]}>{title}</Text>
        {message ? <Text style={[typography.body, { color: textColor }]}>{message}</Text> : null}
      </View>
    </View>
  );
}