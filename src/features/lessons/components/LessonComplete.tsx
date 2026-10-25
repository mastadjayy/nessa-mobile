import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme';

import { PlayerFooter } from './PlayerFooter';

export type LessonResult = {
  score: number;
  xp: number;
  correct: number;
  total: number;
  words: number;
};

type Props = {
  lessonTitle: string;
  summary: LessonResult;
  onContinue: () => void;
};

export function LessonComplete({ lessonTitle, summary, onContinue }: Props) {
  const { colors, spacing, radius, typography } = useTheme();

  const stats = [
    { value: `+${summary.xp}`, label: 'XP earned', color: colors.tertiaryText },
    { value: `${summary.score}%`, label: 'Score', color: colors.text },
    { value: `${summary.words}`, label: summary.words === 1 ? 'Word learned' : 'Words learned', color: colors.text },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <Text style={{ fontSize: 64 }}>🎉</Text>
          <Text
            accessibilityRole="header"
            style={[typography.display, { color: colors.text, textAlign: 'center' }]}
          >
            Lesson complete!
          </Text>
          <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
            {lessonTitle} · {summary.correct} of {summary.total} correct on the first try
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              accessible
              accessibilityLabel={`${stat.value} ${stat.label}`}
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
              <Text style={[typography.headline, { color: stat.color }]}>{stat.value}</Text>
              <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <PlayerFooter>
        <Button label="Continue" onPress={onContinue} />
      </PlayerFooter>
    </View>
  );
}