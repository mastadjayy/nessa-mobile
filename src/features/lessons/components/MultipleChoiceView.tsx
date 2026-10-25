import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { OptionCard } from '@/components/ui/OptionCard';
import { useTheme } from '@/theme';
import type { ListeningExercise, MultipleChoiceExercise } from '@/types/content';
import { shuffle } from '@/utils/shuffle';

import { FeedbackMessage, PlayerFooter } from './PlayerFooter';

type Props = {
  exercise: MultipleChoiceExercise | ListeningExercise;
  /** Called when the learner taps Continue. `correct` is true if the first answer was right. */
  onComplete: (correct: boolean) => void;
};

export function MultipleChoiceView({ exercise, onComplete }: Props) {
  const { colors, spacing, typography } = useTheme();

  // Shuffled once per exercise, so the correct answer is not always in the same place.
  const options = useMemo(() => shuffle(exercise.payload.options), [exercise.id]);
  const accepted = (exercise.acceptedAnswers ?? []).map((answer) => answer.normalize('NFC'));

  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = selected !== null && accepted.includes(selected.normalize('NFC'));

  const statusOf = (option: string) => {
    if (!checked) return undefined;
    if (accepted.includes(option.normalize('NFC'))) return 'correct' as const;
    if (option === selected) return 'incorrect' as const;
    return undefined;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.xl,
          paddingVertical: spacing.lg,
          gap: spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text accessibilityRole="header" style={[typography.headline, { color: colors.text }]}>
          {exercise.prompt}
        </Text>

        <View accessibilityRole="radiogroup" style={{ gap: spacing.md }}>
          {options.map((option) => {
            const status = statusOf(option);
            return (
              <OptionCard
                key={option}
                label={option}
                selected={!checked && selected === option}
                status={status}
                muted={checked && !status}
                disabled={checked}
                onPress={() => setSelected(option)}
              />
            );
          })}
        </View>
      </ScrollView>

      {checked ? (
        <PlayerFooter tone={isCorrect ? 'success' : 'error'}>
          <FeedbackMessage
            correct={isCorrect}
            title={isCorrect ? 'Correct!' : 'Not quite'}
            message={
              isCorrect
                ? exercise.explanation
                : [`Correct answer: ${exercise.acceptedAnswers?.[0] ?? ''}`, exercise.explanation]
                    .filter(Boolean)
                    .join('\n')
            }
          />
          <Button
            label="Continue"
            variant={isCorrect ? 'success' : 'error'}
            onPress={() => onComplete(isCorrect)}
          />
        </PlayerFooter>
      ) : (
        <PlayerFooter>
          <Button label="Check" disabled={selected === null} onPress={() => setChecked(true)} />
        </PlayerFooter>
      )}
    </View>
  );
}