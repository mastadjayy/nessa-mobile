import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { WarmBackground } from '@/components/ui/WarmBackground';
import { resetUserData } from '@/db/progress';
import { LANGUAGE_NAMES, LEVEL_LABELS, REASON_OPTIONS } from '@/features/onboarding/options';
import { DAILY_XP_GOAL } from '@/features/progress/goals';
import { useProgressSummary } from '@/features/progress/useProgressSummary';
import { useProfileStore } from '@/store/profileStore';
import { useTheme } from '@/theme';
import type { DailyMinutes } from '@/types/profile';

const GOAL_OPTIONS: DailyMinutes[] = [5, 10, 15];

export function ProfileScreen() {
  const { colors, spacing, radius, sizing, typography } = useTheme();
  const insets = useSafeAreaInsets();
  const progress = useProgressSummary();

  const language = useProfileStore((s) => s.language);
  const level = useProfileStore((s) => s.level);
  const reason = useProfileStore((s) => s.reason);
  const dailyMinutes = useProfileStore((s) => s.dailyMinutes);
  const setDailyMinutes = useProfileStore((s) => s.setDailyMinutes);
  const resetProfile = useProfileStore((s) => s.resetProfile);

  const reasonLabel = REASON_OPTIONS.find((option) => option.id === reason)?.label ?? 'Not set';

  const plan = [
    { label: 'Language', value: `${LANGUAGE_NAMES[language]} (Asante)` },
    { label: 'Level', value: level ? LEVEL_LABELS[level] : 'Beginner' },
    { label: 'Reason', value: reasonLabel },
  ];

  const card = {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.outline,
  };

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
          <Text accessibilityRole="header" style={[typography.headline, { color: colors.text }]}>
            Profile
          </Text>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <StatCard value={`${progress.streak.current}`} label="Day streak" color={colors.streak} />
            <StatCard value={`${progress.totalXp}`} label="Total XP" color={colors.tertiaryText} />
            <StatCard value={`${progress.completedLessons}`} label="Lessons done" />
          </View>

          <View style={card}>
            <Text style={[typography.title, { color: colors.text }]}>Your plan</Text>
            {plan.map((row) => (
              <View
                key={row.label}
                style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}
              >
                <Text style={[typography.body, { color: colors.textSecondary }]}>{row.label}</Text>
                <Text
                  style={[typography.bodyStrong, { color: colors.text, flexShrink: 1, textAlign: 'right' }]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={card}>
            <View style={{ gap: 2 }}>
              <Text style={[typography.title, { color: colors.text }]}>Daily goal</Text>
              <Text style={[typography.caption, { color: colors.textSecondary }]}>
                How much time you want to spend learning each day.
              </Text>
            </View>

            <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: spacing.sm }}>
              {GOAL_OPTIONS.map((minutes) => {
                const selected = dailyMinutes === minutes;
                return (
                  <Pressable
                    key={minutes}
                    onPress={() => setDailyMinutes(minutes)}
                    accessibilityRole="radio"
                    accessibilityLabel={`${minutes} minutes a day, ${DAILY_XP_GOAL[minutes]} XP`}
                    accessibilityState={{ selected }}
                    style={{
                      flex: 1,
                      minHeight: sizing.touchTarget + spacing.md,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: radius.lg,
                      borderWidth: 2,
                      borderColor: selected ? colors.primary : colors.outline,
                      backgroundColor: selected ? colors.primaryContainer : colors.surface,
                    }}
                  >
                    <Text
                      style={[
                        typography.bodyStrong,
                        { color: selected ? colors.onPrimaryContainer : colors.text },
                      ]}
                    >
                      {minutes} min
                    </Text>
                    <Text
                      style={[
                        typography.caption,
                        { color: selected ? colors.onPrimaryContainer : colors.textSecondary },
                      ]}
                    >
                      {DAILY_XP_GOAL[minutes]} XP
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {__DEV__ ? (
            <Button
              label="Reset everything (dev only)"
              variant="secondary"
              onPress={() => {
                resetUserData();
                resetProfile();
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </WarmBackground>
  );
}