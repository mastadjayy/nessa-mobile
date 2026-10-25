import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { useTheme } from '@/theme';
import type { MatchingExercise } from '@/types/content';
import { shuffle } from '@/utils/shuffle';

import { FeedbackMessage, PlayerFooter } from './PlayerFooter';

type Props = {
  exercise: MatchingExercise;
  onComplete: (correct: boolean) => void;
};

type Side = 'left' | 'right';
type Pick = { side: Side; value: string };
type TileState = 'idle' | 'selected' | 'matched' | 'wrong';

const WRONG_FLASH_MS = 700;

export function MatchingView({ exercise, onComplete }: Props) {
  const { colors, spacing, typography } = useTheme();
  const pairs = exercise.payload.pairs;

  const lefts = useMemo(() => shuffle(pairs.map((pair) => pair.left)), [exercise.id]);
  const rights = useMemo(() => shuffle(pairs.map((pair) => pair.right)), [exercise.id]);

  const [pick, setPick] = useState<Pick | null>(null);
  const [matched, setMatched] = useState<string[]>([]); // matched left values
  const [wrong, setWrong] = useState<{ left: string; right: string } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const rightFor = (left: string) => pairs.find((pair) => pair.left === left)?.right;
  const matchedRights = matched.map(rightFor);
  const done = matched.length === pairs.length;

  const stateOf = (side: Side, value: string): TileState => {
    if (side === 'left' ? matched.includes(value) : matchedRights.includes(value)) return 'matched';
    if (wrong && (side === 'left' ? wrong.left === value : wrong.right === value)) return 'wrong';
    if (pick && pick.side === side && pick.value === value) return 'selected';
    return 'idle';
  };

  const handlePress = (side: Side, value: string) => {
    if (wrong || done || stateOf(side, value) === 'matched') return;

    // First tap, or a tap on the same side: just (re)select.
    if (!pick || pick.side === side) {
      setPick(pick && pick.side === side && pick.value === value ? null : { side, value });
      return;
    }

    const left = side === 'left' ? value : pick.value;
    const right = side === 'right' ? value : pick.value;

    if (rightFor(left) === right) {
      setMatched((current) => [...current, left]);
      setPick(null);
    } else {
      setWrong({ left, right });
      setMistakes((count) => count + 1);
      timer.current = setTimeout(() => {
        setWrong(null);
        setPick(null);
      }, WRONG_FLASH_MS);
    }
  };

  const perfect = mistakes === 0;

  const renderColumn = (side: Side, values: string[]) => (
    <View style={{ flex: 1, gap: spacing.md }}>
      {values.map((value) => (
        <MatchTile
          key={value}
          label={value}
          state={stateOf(side, value)}
          onPress={() => handlePress(side, value)}
        />
      ))}
    </View>
  );

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

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          {renderColumn('left', lefts)}
          {renderColumn('right', rights)}
        </View>
      </ScrollView>

      {done ? (
        <PlayerFooter tone={perfect ? 'success' : 'error'}>
          <FeedbackMessage
            correct={perfect}
            title={perfect ? 'All matched!' : `Matched, with ${mistakes} ${mistakes === 1 ? 'mistake' : 'mistakes'}`}
            message={perfect ? null : 'Practice makes perfect. You will see these words again.'}
          />
          <Button
            label="Continue"
            variant={perfect ? 'success' : 'error'}
            onPress={() => onComplete(perfect)}
          />
        </PlayerFooter>
      ) : (
        <PlayerFooter>
          <Button label="Match all pairs" disabled onPress={() => {}} />
        </PlayerFooter>
      )}
    </View>
  );
}

function MatchTile({
  label,
  state,
  onPress,
}: {
  label: string;
  state: TileState;
  onPress: () => void;
}) {
  const { colors, spacing, radius, sizing, typography } = useTheme();

  const look = {
    idle: { background: colors.surface, border: colors.outline, text: colors.text },
    selected: { background: colors.primaryContainer, border: colors.primary, text: colors.onPrimaryContainer },
    matched: { background: colors.successContainer, border: colors.success, text: colors.onSuccessContainer },
    wrong: { background: colors.errorContainer, border: colors.error, text: colors.onErrorContainer },
  }[state];

  const stateLabel = state === 'matched' ? '. Matched' : state === 'wrong' ? '. Not a match' : '';

  return (
    <Pressable
      onPress={onPress}
      disabled={state === 'matched'}
      accessibilityRole="button"
      accessibilityLabel={`${label}${stateLabel}`}
      accessibilityState={{ selected: state === 'selected', disabled: state === 'matched' }}
      style={{
        minHeight: sizing.touchTarget + spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.lg,
        borderWidth: 2,
        gap: spacing.xs,
        backgroundColor: look.background,
        borderColor: look.border,
      }}
    >
      <Text style={[typography.bodyStrong, { color: look.text, textAlign: 'center' }]}>{label}</Text>
      {state === 'matched' ? (
        <Ionicons name="checkmark-circle" size={sizing.iconSm} color={colors.success} />
      ) : state === 'wrong' ? (
        <Ionicons name="close-circle" size={sizing.iconSm} color={colors.error} />
      ) : null}
    </Pressable>
  );
}