import { View } from 'react-native';

import { OptionCard } from '@/components/ui/OptionCard';
import { useTheme } from '@/theme';

import type { Option } from '../options';
import { OnboardingScaffold } from './OnboardingScaffold';

type Props<T extends string> = {
  progress: number;
  title: string;
  subtitle?: string;
  options: Option<T>[];
  value: T | null;
  onSelect: (id: T) => void;
  onContinue: () => void;
  /** Options flagged `comingSoon` that the learner has tapped. */
  interestedIds?: string[];
  onInterest?: (id: T) => void;
};

/** One question, a list of options, and a Continue button that unlocks once something is picked. */
export function ChoiceStep<T extends string>({
  progress,
  title,
  subtitle,
  options,
  value,
  onSelect,
  onContinue,
  interestedIds = [],
  onInterest,
}: Props<T>) {
  const { spacing } = useTheme();

  return (
    <OnboardingScaffold
      progress={progress}
      title={title}
      subtitle={subtitle}
      ctaDisabled={value === null}
      onContinue={onContinue}
    >
      <View accessibilityRole="radiogroup" style={{ gap: spacing.md }}>
        {options.map((option) =>
          option.comingSoon ? (
            <OptionCard
              key={option.id}
              label={option.label}
              description={option.description}
              emoji={option.emoji}
              muted
              accessibilityRole="button"
              accessibilityHint="Double tap to tell us you are interested in this language"
              badge={
                interestedIds.includes(option.id)
                  ? { text: 'Thanks, noted', done: true }
                  : { text: 'Coming soon' }
              }
              onPress={() => onInterest?.(option.id)}
            />
          ) : (
            <OptionCard
              key={option.id}
              label={option.label}
              description={option.description}
              emoji={option.emoji}
              selected={value === option.id}
              onPress={() => onSelect(option.id)}
            />
          ),
        )}
      </View>
    </OnboardingScaffold>
  );
}