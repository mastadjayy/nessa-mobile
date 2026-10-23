import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { palette, useTheme } from '@/theme';

/** Blends two hex colors. `amount` is how much of `tint` to mix into `base` (0 to 1). */
function mix(base: string, tint: string, amount: number): string {
  const parse = (hex: string) => {
    const value = hex.replace('#', '');
    return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  };
  const [br, bg, bb] = parse(base);
  const [tr, tg, tb] = parse(tint);
  const channel = (from: number, to: number) => Math.round(from + (to - from) * amount);
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(channel(br, tr))}${toHex(channel(bg, tg))}${toHex(channel(bb, tb))}`.toUpperCase();
}

/**
 * The soft warm background color: the theme background with a little brand orange.
 * Light mode stays light (about #F9F2E7); dark mode stays dark with a hint of warmth.
 * Exposed as a hook so navigators can use the same color and avoid flashes.
 */
export function useWarmBackgroundColor(): string {
  const { colors, isDark } = useTheme();
  return mix(colors.background, palette.orange, isDark ? 0.05 : 0.07);
}

type Props = {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function WarmBackground({ children, style }: Props) {
  const backgroundColor = useWarmBackgroundColor();
  return <View style={[styles.root, { backgroundColor }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});