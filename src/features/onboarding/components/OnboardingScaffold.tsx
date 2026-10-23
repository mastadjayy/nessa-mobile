import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { WarmBackground } from '@/components/ui/WarmBackground';
import { useTheme } from '@/theme';

import { STEP_COUNT } from '../options';

type Props = {
  /** 0 to 1 */
  progress: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  onContinue: () => void;
};

/**
 * Shared frame for every onboarding step: back button and progress bar on top,
 * title and content in the middle, one big button at the bottom.
 */
export function OnboardingScaffold({
  progress,
  title,
  subtitle,
  children,
  ctaLabel = 'Continue',
  ctaDisabled = false,
  onContinue,
}: Props) {
  const { colors, spacing, sizing, typography } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <WarmBackground>
      <View
        style={[
          styles.root,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.lg },
        ]}
      >
        <View style={[styles.column, { maxWidth: sizing.maxContentWidth }]}>
          <View style={[styles.header, { paddingHorizontal: spacing.md, gap: spacing.sm }]}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={{
                width: sizing.touchTarget,
                height: sizing.touchTarget,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="chevron-back" size={sizing.iconMd} color={colors.text} />
            </Pressable>
            <ProgressBar
              progress={progress}
              from={Math.max(0, progress - 1 / STEP_COUNT)}
              label="Setup progress"
              style={styles.progress}
            />
            {/* Balances the back button so the bar stays centered. */}
            <View style={{ width: sizing.touchTarget }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.xl,
              paddingTop: spacing.lg,
              paddingBottom: spacing.xl,
              gap: spacing.xl,
            }}
          >
            <View style={{ gap: spacing.sm }}>
              <Text accessibilityRole="header" style={[typography.headline, { color: colors.text }]}>
                {title}
              </Text>
              {subtitle ? (
                <Text style={[typography.body, { color: colors.textSecondary }]}>{subtitle}</Text>
              ) : null}
            </View>
            {children}
          </ScrollView>

          <View style={{ paddingHorizontal: spacing.xl }}>
            <Button label={ctaLabel} onPress={onContinue} disabled={ctaDisabled} />
          </View>
        </View>
      </View>
    </WarmBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  column: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    flex: 1,
  },
});