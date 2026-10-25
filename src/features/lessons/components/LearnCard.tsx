import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme';
import type { ContentItem } from '@/types/content';

import { PlayerFooter } from './PlayerFooter';

type Props = {
  item: ContentItem;
  index: number;
  total: number;
  isLast: boolean;
  onNext: () => void;
};

/** One new word or phrase: the Twi text, how to say it, what it means. */
export function LearnCard({ item, index, total, isLast, onNext }: Props) {
  const { colors, spacing, radius, typography, elevation } = useTheme();

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
          <Text style={[typography.label, { color: colors.tertiaryText }]}>
            {item.kind === 'phrase' ? 'New phrase' : 'New word'}
          </Text>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {index + 1} of {total}
          </Text>
        </View>

        <View
          style={[
            elevation.card,
            {
              alignItems: 'center',
              gap: spacing.lg,
              padding: spacing.xxl,
              borderRadius: radius.xl,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.outline,
            },
          ]}
        >
          <Text
            accessibilityRole="header"
            style={[typography.display, { color: colors.text, textAlign: 'center' }]}
          >
            {item.text}
          </Text>

          {item.respelling ? (
            <View
              accessibilityLabel={`Pronounced ${item.respelling}`}
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: radius.pill,
                backgroundColor: colors.surfaceVariant,
              }}
            >
              <Text style={[typography.respelling, { color: colors.text }]}>{item.respelling}</Text>
            </View>
          ) : null}

          <Text style={[typography.headline, { color: colors.text, textAlign: 'center' }]}>
            {item.translation}
          </Text>
        </View>

        {item.notes ? (
          <View
            style={{
              padding: spacing.lg,
              borderRadius: radius.lg,
              backgroundColor: colors.hintContainer,
            }}
          >
            <Text style={[typography.caption, { color: colors.onHintContainer }]}>{item.notes}</Text>
          </View>
        ) : null}
      </ScrollView>

      <PlayerFooter>
        <Button label={isLast ? 'Start practice' : 'Next'} onPress={onNext} />
      </PlayerFooter>
    </View>
  );
}