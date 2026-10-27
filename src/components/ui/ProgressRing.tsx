import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedProps,
    useReducedMotion,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  /** 0 to 1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  /** Content drawn in the middle of the ring, e.g. an icon. */
  children?: ReactNode;
  label?: string;
};

export function ProgressRing({ progress, size = 72, strokeWidth = 8, color, children, label }: Props) {
  const { colors, motion } = useTheme();
  const reduceMotion = useReducedMotion();

  const clamped = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const value = useSharedValue(reduceMotion ? clamped : 0);
  useEffect(() => {
    value.value = reduceMotion
      ? clamped
      : withTiming(clamped, { duration: motion.slow * 2, easing: Easing.out(Easing.cubic) });
  }, [clamped, reduceMotion, motion.slow, value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - value.value),
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
    >
      <Svg width={size} height={size} style={[StyleSheet.absoluteFill, styles.rotated]}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceVariant}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color ?? colors.tertiary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          fill="none"
        />
      </Svg>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  // Start the ring at the top instead of at the right.
  rotated: { transform: [{ rotate: '-90deg' }] },
});