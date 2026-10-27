import { useEffect } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useReducedMotion,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/theme';

type Props = {
  /** 0 to 1 */
  progress: number;
  /** Where the fill animates from on mount (0 to 1). Defaults to `progress`. */
  from?: number;
  color?: string;
  /** Color of the empty part of the bar. Defaults to the theme's variant surface. */
  trackColor?: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function ProgressBar({ progress, from, color, trackColor, label, style }: Props) {
  const { colors, radius, sizing, motion } = useTheme();
  const reduceMotion = useReducedMotion();
  const value = useSharedValue(reduceMotion ? progress : (from ?? progress));

  useEffect(() => {
    value.value = reduceMotion
      ? progress
      : withTiming(progress, { duration: motion.slow, easing: Easing.out(Easing.cubic) });
  }, [progress, reduceMotion, motion.slow, value]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${value.value * 100}%` }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
      style={[
        styles.track,
        { height: sizing.progressBar, borderRadius: radius.pill, backgroundColor: trackColor ?? colors.surfaceVariant },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          { borderRadius: radius.pill, backgroundColor: color ?? colors.primary },
          fillStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});