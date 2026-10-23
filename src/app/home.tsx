import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { WarmBackground } from '@/components/ui/WarmBackground';
import { dailyXpGoalFor } from '@/features/progress/goals';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';

/**
 * TEMPORARY placeholder shown after onboarding.
 * It will be replaced by the Home, Practice and Profile tabs.
 */
export default function HomePlaceholder() {
  const { colors, spacing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const { language, level, reason, dailyMinutes, resetProfile } = useProfileStore();

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
        <Text style={[typography.headline, { color: colors.text }]}>Home is coming next</Text>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Saved: {language} · {level} · {reason} · {dailyMinutes} min/day · goal{' '}
          {dailyXpGoalFor(dailyMinutes)} XP
        </Text>

        {__DEV__ ? (
          <Button label="Reset onboarding (dev only)" variant="secondary" onPress={resetProfile} />
        ) : null}
      </View>
    </WarmBackground>
  );
}